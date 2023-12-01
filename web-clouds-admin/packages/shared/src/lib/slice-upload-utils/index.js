/* eslint-disable */
/* prettier-ignore */

import { ref, computed, watch, readonly, nextTick } from "vue";

class AjaxRequestError extends Error {
  constructor(message, status, method, url) {
    super(message)
    this.name = 'AjaxRequestError'
    this.status = status
    this.method = method
    this.url = url
  }
}
function getError(url, option, xhr) {
  let msg
  if (xhr.responseType === 'blob') msg = 'fail to responseType blob'
  else if (xhr.response) msg = `${xhr.response.error || xhr.response}`
  else if (xhr.responseText) msg = `${xhr.responseText}`
  else msg = `fail to ${option.method}${url}${xhr.status}`
  return new AjaxRequestError(msg, xhr.status, option.method, url)
}
function getBody(xhr) {
  if (xhr.responseType === 'blob') return xhr.response || xhr.responseText
  const text = xhr.responseText || xhr.response
  if (!text) return text
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}
function isObject(data) {
  return (
    !(data instanceof FormData) &&
    typeof data !== null &&
    typeof data === 'object'
  )
}
const ajaxRequest = option => {
  if (typeof XMLHttpRequest === 'undefined')
    throw new Error('XMLHttpRequest is undefined')
  const xhr = new XMLHttpRequest()
  const url = option.url
  if (option.timeout !== void 0) {
    xhr.timeout = option.timeout
    xhr.ontimeout = () => {
      option.onError(getError(url, option, xhr))
    }
  }
  if (option.responseType) xhr.responseType = option.responseType
  if (xhr.upload && option.onUploadProgress) {
    xhr.upload.addEventListener('progress', evt => {
      const progressEvt = evt
      progressEvt.percent = evt.total > 0 ? (evt.loaded / evt.total) * 100 : 0
      option.onUploadProgress?.(progressEvt)
    })
  }
  if (option.onDownloadProgress) {
    xhr.addEventListener('progress', evt => {
      const progressEvt = evt
      progressEvt.percent = evt.total > 0 ? (evt.loaded / evt.total) * 100 : 0
      option.onDownloadProgress?.(progressEvt)
    })
  }
  xhr.addEventListener('loadstart', () => {
    option.onLoadstart?.()
  })
  option.onAbort &&
    xhr.addEventListener('abort', () => {
      option.onAbort?.(getError(url, option, xhr))
    })
  xhr.addEventListener('error', () => {
    option.onError(getError(url, option, xhr))
  })
  xhr.addEventListener('readystatechange', () => {
    option.readystatechange?.()
  })
  xhr.addEventListener('load', () => {
    option.onLoad?.()
  })
  xhr.addEventListener('load', () => {
    if (xhr.status < 200 || xhr.status >= 300)
      return option.onError(getError(url, option, xhr))
    option.onSuccess(getBody(xhr))
  })
  if (option.withCredentials && 'withCredentials' in xhr)
    xhr.withCredentials = true
  const setHeader = () => {
    const headers = option.headers || {}
    if (headers instanceof Headers) {
      headers.forEach((value, key) => xhr.setRequestHeader(key, value))
    } else if (headers && typeof headers === 'object') {
      for (const [key, value] of Object.entries(headers)) {
        if (value === null || value === void 0) continue
        xhr.setRequestHeader(key, String(value))
      }
    }
    const hasJson = data =>
      data.some(value => String(value).includes('application/json'))
    if (
      option.method !== 'GET' &&
      isObject(option.data) &&
      (!headers ||
        (headers instanceof Headers && !hasJson([...headers.values()])) ||
        (headers &&
          typeof headers === 'object' &&
          !hasJson(Object.values(headers))))
    )
      xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8')
  }
  xhr.request = () => {
    let url2 = option.url
    const isGet = option.method === 'GET'
    let data = option.data
    if (isGet && data) {
      const prefix = url2.includes('?') ? '&' : '?'
      if (typeof data === 'string') {
        url2 += prefix + data
      } else {
        const params = new URLSearchParams()
        for (const [key, value] of Object.entries(data)) {
          if (value === null || value === void 0) continue
          params.append(key, String(value))
        }
        url2 += prefix + params.toString()
      }
    } else if (!isGet && isObject(data)) {
      data = JSON.stringify(data)
    }
    xhr.open(option.method, url2, true)
    setHeader()
    xhr.send(isGet ? null : data)
  }
  return xhr
}
class Emitter {
  constructor() {
    this.eventsMap = new Map()
  }
  on(eventName, cb) {
    const events = this.eventsMap.get(eventName) || []
    events.push(cb)
    this.eventsMap.set(eventName, events)
    return this
  }
  emit(eventName, ...args) {
    const events = this.eventsMap.get(eventName) || []
    events.forEach(cb => cb(...args))
    return this
  }
  off(eventName, cb) {
    if (!cb) {
      this.eventsMap.set(eventName, [])
    } else {
      const events = this.eventsMap.get(eventName) || []
      this.eventsMap.set(
        eventName,
        events.filter(v => v !== cb)
      )
    }
    return this
  }
}
async function promisePool(params) {
  const { promiseList, limit, resolve, reject } = params
  const poolSet = new Set()
  for (const promiseFn of promiseList) {
    if (params.beStop?.()) return
    if (poolSet.size >= limit) await Promise.race(poolSet).catch(e => e)
    const onfulfilled = res => {
      resolve?.(res)
    }
    const onrejected = res => {
      reject?.(res)
    }
    const promise = promiseFn()
    poolSet.add(promise)
    promise.then(onfulfilled, onrejected).finally(() => {
      poolSet.delete(promise)
    })
  }
}
class SliceDownload {
  constructor(options) {
    this.fileSize = 0
    this.isCancel = false
    this.isPause = false
    this.events = new Emitter()
    this.currentRequestChunkIndex = -1
    this.sliceFileChunks = []
    this.downloadRequestInstance = null
    this.xhr = []
    this._progress = -1
    const {
      filename = '',
      fileSize = 0,
      poolCount = 3,
      retryCount = 3,
      autoSave = true,
      timeout = 15e3,
      retryDelay = 300,
      chunkSize = 1024 * 1024 * 2,
      fileType = 'application/octet-stream'
    } = options
    this.autoSave = autoSave
    this.fileType = fileType
    this.fileSize = fileSize
    this.filename = filename
    this.chunkSize = chunkSize
    this.poolCount = poolCount
    this.retryCount = retryCount
    this.retryDelay = retryDelay
    this.timeout = timeout
  }
  setFileOptions(options) {
    const { filename, fileSize, fileType } = options
    if (filename) this.filename = filename
    if (fileSize) this.fileSize = fileSize
    if (fileType) this.fileType = fileType
    this.check()
  }
  check() {
    if (!this.filename) throw new Error('filename is required')
    if (!this.fileSize) throw new Error('fileSize is required')
    if (!this.downloadRequestInstance)
      throw new Error('downloadRequestInstance is required')
  }
  async start() {
    if (['downloading', 'success'].includes(this.status)) return
    this.check()
    if (!this.sliceFileChunks.length) {
      this.initSliceFileChunks()
      this.emitProgress()
    }
    const _sliceFileChunks = this.sliceFileChunks.filter(
      v => v.status !== 'success' && v.progress !== 100
    )
    if (this.sliceFileChunks.length && !_sliceFileChunks.length) {
      this.emitProgress()
      this.emitFinish()
      return
    }
    this.isCancel = false
    this.isPause = false
    const failChunks = this.sliceFileChunks.filter(v => v.status === 'error')
    failChunks.forEach(v => (v.status = 'ready'))
    this.emit('start')
    this.emitProgress()
    const { promiseList } = this.createPromiseList(_sliceFileChunks)
    promisePool({
      promiseList,
      limit: this.poolCount,
      beStop: () => this.stop || !this.sliceFileChunks.length,
      resolve: () => {
        this.emitFinish()
      }
    })
  }
  abort() {
    this.xhr.forEach(v => v && v.abort())
    this.xhr = []
  }
  pause() {
    this.isPause = true
    this.abort()
    this.emit('pause')
  }
  cancel() {
    this.isCancel = true
    this.abort()
    this.initSliceFileChunks()
    this.emitProgress()
    this._progress = -1
    this.currentRequestChunkIndex = -1
    this.emit('cancel')
  }
  createPromiseList(chunks) {
    const beDownloadChunks = chunks.filter(v => v.status === 'ready')
    const len = beDownloadChunks.length
    const { filename, chunkSize, fileType } = this
    const chunkTotal = this.sliceFileChunks.length
    const promiseList = beDownloadChunks.map(v => {
      const { start, end, index } = v
      const sliceChunk = this.sliceFileChunks[index]
      const params = {
        start,
        end,
        index,
        fileType,
        filename,
        chunkSize,
        chunkTotal
      }
      return async () => {
        let flag = true
        try {
          this.currentRequestChunkIndex = index
          const result = await this.downloadRequestInstance(params)
          if (result instanceof Blob) {
            sliceChunk.file = result
          } else {
            flag = false
            console.error('downloadRequest must return Blob')
          }
        } catch (e) {
          flag = false
        }
        if (flag) {
          sliceChunk.status = 'success'
          sliceChunk.retryCount = 0
          sliceChunk.progress = 100
          this.emitProgress()
        } else {
          sliceChunk.status = 'error'
          this.emit(
            'error',
            new AjaxRequestError(
              `chunk ${sliceChunk.index}downloaded,request fail`,
              700,
              '',
              ''
            )
          )
        }
        this.currentRequestChunkIndex = -1
        return flag
      }
    })
    return { promiseList, len }
  }
  ajaxRequest(options) {
    const { timeout } = this
    return new Promise((resolve, reject) => {
      const idx = this.currentRequestChunkIndex
      const chunk = this.sliceFileChunks[idx]
      const retryFn = () => {
        chunk.retryCount++
        this.xhr[idx].request()
      }
      const abortFn = () => {
        if (this.stop) this.xhr[idx].request()
        return this.stop
      }
      const { start, end } = chunk
      const headers = { Range: `bytes=${start}-${end}`, ...options.headers }
      const ajaxRequestOptions = {
        method: 'GET',
        withCredentials: false,
        timeout,
        responseType: 'blob',
        ...options,
        headers,
        readystatechange: () => {
          abortFn()
        },
        onLoadstart: () => {
          chunk.status = 'downloading'
          abortFn()
        },
        onAbort: evt => {
          if (chunk.progress !== 100) chunk.status = 'ready'
          this.currentRequestChunkIndex = -1
          reject(evt)
        },
        onError: evt => {
          if (chunk.retryCount < this.retryCount) {
            this.retryDelay > 0
              ? setTimeout(() => retryFn(), this.retryDelay)
              : retryFn()
            return
          }
          chunk.status = 'error'
          this.currentRequestChunkIndex = -1
          this.emit('error', evt)
          reject(evt)
        },
        onSuccess: evt => {
          resolve(evt)
        },
        onDownloadProgress: evt => {
          if (abortFn()) return
          if (evt.percent === 100) {
            chunk.status = 'success'
            chunk.retryCount = 0
            chunk.progress = 100
          }
          const progress = chunk.progress
          if (progress < evt.percent) chunk.progress = evt.percent
          if (evt.percent !== 100 && !this.stop && chunk.status !== 'error')
            chunk.status = 'downloading'
          this.emitProgress()
        }
      }
      this.xhr[idx] = ajaxRequest(ajaxRequestOptions)
      !this.stop && this.xhr[idx].request()
    })
  }
  setDownloadRequest(request) {
    this.downloadRequestInstance = request
    return this
  }
  emitProgress() {
    const progress = this.progress
    if (progress !== this._progress) {
      this.emit('progress', { progress })
      this._progress = progress
    }
  }
  emitFinish() {
    if (this.status === 'success') {
      const { filename, chunkSize, fileType } = this
      const chunks = this.sliceFileChunks
        .filter(v => v.status === 'success' && v.file)
        .map(v => v.file)
      const file = mergeFile(chunks, filename, fileType)
      this.autoSave && saveFile(file, filename)
      this.emit('finish', {
        file,
        chunkSize,
        chunkTotal: this.sliceFileChunks.length
      })
    }
  }
  initSliceFileChunks(fileChunks) {
    const reset = { status: 'ready', progress: 0, retryCount: 0 }
    if (!fileChunks?.length && !this.sliceFileChunks.length) {
      const { fileSize, chunkSize } = this
      const chunkTotal = Math.ceil(fileSize / chunkSize)
      this.sliceFileChunks = Array.from({ length: chunkTotal }, (_, index) => ({
        index,
        file: null,
        start: index * chunkSize,
        end: index + 1 === chunkTotal ? fileSize : (index + 1) * chunkSize - 1,
        ...reset
      }))
      return
    }
    this.sliceFileChunks = (fileChunks ?? this.sliceFileChunks).map(v => ({
      ...v,
      ...reset
    }))
  }
  destroy() {
    this.reset()
    this.events = new Emitter()
    this.downloadRequestInstance = null
  }
  reset() {
    this.currentRequestChunkIndex = -1
    this.sliceFileChunks = []
    this.abort()
    this.isCancel = false
    this.isPause = false
  }
  on(eventName, cb) {
    this.events.on(eventName, cb)
    return this
  }
  off(eventName, cb) {
    this.events.off(eventName, cb)
    return this
  }
  emit(eventName, ...args) {
    this.events.emit(eventName, ...args)
    return this
  }
  getData() {
    const chunks = this.sliceFileChunks.map(v => {
      let status = this.isCancel ? 'cancel' : this.isPause ? 'pause' : v.status
      if (v.progress === 100 || v.progress === 0) status = v.status
      return {
        status,
        progress: v.progress,
        start: v.start,
        end: v.end,
        index: v.index
      }
    })
    return { chunks }
  }
  get stop() {
    return this.isCancel || this.isPause
  }
  get status() {
    const chunks = this.sliceFileChunks
    if (!chunks.length) return 'ready'
    if (this.isCancel) return 'cancel'
    if (this.isPause) return 'pause'
    if (chunks.some(v => v.status === 'downloading')) return 'downloading'
    if (chunks.every(v => v.status === 'success')) return 'success'
    if (chunks.some(v => v.status === 'error')) return 'error'
    return 'ready'
  }
  get progress() {
    const chunks = this.sliceFileChunks
    const len = chunks.length
    if (!len) return 0
    const progressTotal = chunks
      .map(v => v.progress)
      .reduce((pre, cur) => pre + cur, 0)
    return progressTotal / len
  }
}
function defineSliceDownload(options) {
  return new SliceDownload(options)
}
function mergeFile(files, filename, type) {
  return new File(files, filename, { type })
}
function saveFile(file, filename) {
  const aLink = document.createElement('a')
  aLink.href = URL.createObjectURL(file)
  aLink.download = filename
  aLink.click()
  URL.revokeObjectURL(aLink.href)
  aLink.remove()
}
class SliceUpload {
  constructor(options) {
    this.timeout = 0
    this.preHash = ''
    this.currentRequestChunkHash = null
    this.sliceFileChunks = []
    this.isCancel = false
    this.isPause = false
    this.events = new Emitter()
    this.uploadRequestInstance = null
    this.preVerifyRequestInstance = null
    this.xhr = []
    this._progress = -1
    this.file = options?.file || null
    const {
      poolCount = 3,
      retryCount = 3,
      timeout = 15e3,
      retryDelay = 300,
      realPreHash = false,
      realChunkHash = false,
      chunkSize = 1024 ** 2 * 2
    } = options || {}
    this.poolCount = poolCount
    this.chunkSize = chunkSize
    this.retryCount = retryCount
    this.retryDelay = retryDelay
    this.realPreHash = realPreHash
    this.realChunkHash = realChunkHash
    this.timeout = timeout
  }
  setFile(file) {
    file && this.reset()
    this.file = file
    return this
  }
  on(eventName, cb) {
    this.events.on(eventName, cb)
    return this
  }
  off(eventName, cb) {
    this.events.off(eventName, cb)
    return this
  }
  emit(eventName, ...args) {
    this.events.emit(eventName, ...args)
    return this
  }
  reset() {
    this.preHash = null
    this.currentRequestChunkHash = null
    this.sliceFileChunks = []
    this.abort()
    this.isCancel = false
    this.isPause = false
  }
  destroy() {
    this.reset()
    this.events = new Emitter()
    this.file = null
    this.uploadRequestInstance = null
    this.preVerifyRequestInstance = null
  }
  setUploadRequest(request) {
    this.uploadRequestInstance = request
    return this
  }
  ajaxRequest(options) {
    const { timeout } = this
    return new Promise((resolve, reject) => {
      const chunk = this.findSliceFileChunk(this.currentRequestChunkHash)
      const idx = this.sliceFileChunks.findIndex(
        v => v.chunkHash === chunk.chunkHash
      )
      const retryFn = () => {
        chunk.retryCount++
        this.xhr[idx].request()
      }
      const abortFn = () => {
        if (this.stop) this.xhr[idx].abort()
        return this.stop
      }
      const ajaxRequestOptions = {
        method: 'POST',
        withCredentials: false,
        timeout,
        ...options,
        readystatechange: () => {
          abortFn()
        },
        onLoadstart: () => {
          chunk.status = 'uploading'
          abortFn()
        },
        onAbort: evt => {
          if (chunk.progress !== 100) chunk.status = 'ready'
          reject(evt)
        },
        onError: evt => {
          if (chunk.retryCount < this.retryCount) {
            this.retryDelay > 0
              ? setTimeout(() => retryFn(), this.retryDelay)
              : retryFn()
            return
          }
          chunk.status = 'error'
          this.emit('error', evt)
          reject(evt)
        },
        onSuccess: evt => {
          resolve(evt)
        },
        onUploadProgress: evt => {
          if (abortFn()) return
          const progress = chunk.progress
          if (progress < evt.percent) chunk.progress = evt.percent
          if (evt.percent >= 99) chunk.progress = 99
          if (evt.percent !== 100 && !this.stop && chunk.status !== 'error')
            chunk.status = 'uploading'
          this.emitProgress()
        }
      }
      this.xhr[idx] = ajaxRequest(ajaxRequestOptions)
      !this.stop && this.xhr[idx].request()
    })
  }
  setPreVerifyRequest(request) {
    this.preVerifyRequestInstance = request
    return this
  }
  async start() {
    if (['uploading', 'success'].includes(this.status)) return
    this.check()
    if (!this.preHash && !this.sliceFileChunks.length) {
      const { file, chunkSize, realPreHash, realChunkHash } = this
      const { preHash, fileChunks } = await getHashChunks({
        file,
        chunkSize,
        realPreHash,
        realChunkHash
      })
      this.preHash = preHash
      this.initSliceFileChunks(fileChunks)
      this.emitProgress()
    }
    let _sliceFileChunks = this.sliceFileChunks.slice()
    if (this.preVerifyRequestInstance) {
      const { preHash, file, chunkSize } = this
      let result = []
      try {
        const checkList = await this.preVerifyRequestInstance({
          preHash,
          filename: file.name,
          chunkSize,
          chunkTotal: this.sliceFileChunks.length
        })
        if (checkList === true) result = _sliceFileChunks.map(v => v.chunkHash)
        else if (Array.isArray(checkList)) result = checkList
      } catch (e) {
        console.error('preVerifyRequest is fail', e)
        result = []
      }
      _sliceFileChunks = _sliceFileChunks.filter(
        v => !result.includes(v.chunkHash)
      )
      this.sliceFileChunks.forEach(v => {
        if (result.includes(v.chunkHash)) {
          v.status = 'success'
          v.progress = 100
        }
      })
      this.emitFinish()
    }
    this.isCancel = false
    this.isPause = false
    const failChunks = this.sliceFileChunks.filter(v => v.status === 'error')
    failChunks.forEach(v => (v.status = 'ready'))
    this.emit('start')
    this.emitProgress()
    if (!_sliceFileChunks.length) return
    const { promiseList } = this.createPromiseList(_sliceFileChunks)
    promisePool({
      promiseList,
      limit: this.poolCount,
      beStop: () => this.stop || !this.sliceFileChunks.length,
      resolve: () => {
        this.emitFinish()
      }
    })
  }
  emitFinish() {
    if (this.status === 'success')
      this.emit('finish', {
        preHash: this.preHash,
        filename: this.file?.name,
        file: this.file,
        chunkTotal: this.sliceFileChunks.length,
        chunkSize: this.chunkSize
      })
  }
  createPromiseList(chunks) {
    const beUploadChunks = chunks.filter(v => v.status === 'ready')
    const len = beUploadChunks.length
    const promiseList = beUploadChunks.map(v => {
      const { chunk, index, chunkHash } = v
      const sliceChunk = this.findSliceFileChunk(chunkHash)
      const params = {
        chunk,
        index,
        chunkHash,
        preHash: this.preHash,
        filename: this.file?.name,
        chunkTotal: this.sliceFileChunks.length
      }
      return async () => {
        let flag = true
        try {
          this.currentRequestChunkHash = chunkHash
          const result = await this.uploadRequestInstance(params)
          if (result === false) flag = false
        } catch (e) {
          flag = false
        }
        if (flag) {
          sliceChunk.status = 'success'
          sliceChunk.retryCount = 0
          sliceChunk.progress = 100
          this.emitProgress()
        } else {
          sliceChunk.status = 'error'
          this.emit(
            'error',
            new AjaxRequestError(
              `chunk ${sliceChunk.index}uploaded,request fail`,
              700,
              '',
              ''
            )
          )
        }
        this.currentRequestChunkHash = null
        return flag
      }
    })
    return { promiseList, len }
  }
  initSliceFileChunks(fileChunks) {
    const initialSliceFileChunkOther = {
      status: 'ready',
      progress: 0,
      retryCount: 0
    }
    this.sliceFileChunks = (fileChunks ?? this.sliceFileChunks).map(v => ({
      ...v,
      ...initialSliceFileChunkOther
    }))
  }
  emitProgress() {
    const progress = this.progress
    if (progress !== this._progress) {
      this.emit('progress', { progress })
      this._progress = progress
    }
  }
  abort() {
    this.xhr.forEach(v => v && v.abort())
    this.xhr = []
  }
  pause() {
    this.isPause = true
    this.abort()
    this.emit('pause')
  }
  cancel() {
    this.isCancel = true
    this.abort()
    this.initSliceFileChunks()
    this.emitProgress()
    this._progress = -1
    this.currentRequestChunkHash = null
    this.emit('cancel')
  }
  findSliceFileChunk(chunkHash) {
    return this.sliceFileChunks.find(v => v.chunkHash === chunkHash)
  }
  check() {
    if (!this.file) throw new Error('file is required')
    if (!this.uploadRequestInstance)
      throw new Error('uploadRequestInstance is required')
    if (!this.file?.size) throw new Error('file size is 0')
  }
  getFile() {
    return this.file
  }
  getData() {
    const { preHash, sliceFileChunks, file } = this
    const chunks = sliceFileChunks.map(v => {
      let status = this.isCancel ? 'cancel' : this.isPause ? 'pause' : v.status
      if (v.progress === 100 || v.progress === 0) status = v.status
      return {
        status,
        progress: v.progress,
        chunkHash: v.chunkHash,
        index: v.index
      }
    })
    return { preHash, file, chunks }
  }
  get hasFile() {
    return !!this.file?.size
  }
  get isRealPreHash() {
    return this.file?.size <= this.chunkSize || this.realPreHash
  }
  get isRealChunkHash() {
    return this.file?.size <= this.chunkSize || this.realChunkHash
  }
  get stop() {
    return this.isCancel || this.isPause
  }
  get progress() {
    const chunks = this.sliceFileChunks
    const len = chunks.length
    if (!len) return 0
    const progressTotal = chunks
      .map(v => v.progress)
      .reduce((pre, cur) => pre + cur, 0)
    return progressTotal / len
  }
  get hasRequestInstance() {
    return !!this.uploadRequestInstance
  }
  get status() {
    const chunks = this.sliceFileChunks
    if (!chunks.length) return 'ready'
    if (this.isCancel) return 'cancel'
    if (this.isPause) return 'pause'
    if (chunks.some(v => v.status === 'uploading')) return 'uploading'
    if (chunks.every(v => v.status === 'success')) return 'success'
    if (chunks.some(v => v.status === 'error')) return 'error'
    return 'ready'
  }
}
function defineSliceUpload(options) {
  return new SliceUpload(options)
}
async function chunkWorker(params) {
  const { chunkSize, file, preHash } = params
  const chunkTotal = Math.ceil(file.size / chunkSize)
  const fileChunks = []
  for (let index = 0; index < chunkTotal; index++) {
    const start = index * chunkSize
    const end = start + chunkSize >= file.size ? file.size : start + chunkSize
    const chunk = file.slice(start, end)
    fileChunks.push({ chunk, index, chunkHash: index })
  }
  return { fileChunks, preHash }
}
async function getFileChunk(params) {
  if (params.file.size <= params.chunkSize) {
    const preHash = params.preHash
    return {
      preHash,
      fileChunks: [{ chunk: params.file, index: 0, chunkHash: preHash }]
    }
  } else {
    return await getFileChunkWorker(params)
  }
}
function getFileChunkWorker(params) {
  return chunkWorker(params)
}
async function getHashChunks(params) {
  const { file, chunkSize } = params
  const preHash = `${file.name}_${file.size}`
  const result = await getFileChunk({ file, preHash, chunkSize })
  return result
}
function getPreFile(file, chunkSize) {
  if (file.size <= chunkSize) return file
  const size = 500 * 1024
  const mid = Math.ceil(file.size / 2)
  const last = file.size - size
  const firstFile = file.slice(0, size)
  const midFile = file.slice(mid, mid + size)
  const lastFile = file.slice(last, file.size)
  const newFile = new File([firstFile, midFile, lastFile], file.name, {
    type: file.type
  })
  return newFile
}
function useSliceUpload(options) {
  const progress = ref(0)
  const chunks = ref([])
  const status = ref('ready')
  const isFinish = computed(() => progress.value === 100)
  const instance = defineSliceUpload({ ...options, file: options.file.value })
  options.preVerifyRequest &&
    instance.setPreVerifyRequest(options.preVerifyRequest)
  instance.setUploadRequest(options.request)
  const setChunk = () => {
    const data = instance.getData()
    chunks.value = data.chunks
  }
  watch(options.file, file => {
    status.value = 'ready'
    progress.value = 0
    chunks.value = []
    file && instance.setFile(file)
  })
  watch(status, () => {
    setChunk()
  })
  instance.on('progress', params => {
    progress.value = params.progress
    setChunk()
  })
  instance.on('finish', params => {
    status.value = 'success'
    setChunk()
    options.onFinish?.(params)
  })
  instance.on('error', error => {
    if (['uploading'].includes(status.value)) status.value = 'error'
    setChunk()
    if (status.value === 'error') options.onError?.(error)
  })
  const setRequest = request => {
    instance.setUploadRequest(request)
  }
  const start = async () => {
    await nextTick()
    if (['success', 'uploading'].includes(status.value)) return
    instance.start()
    if (instance.hasFile) status.value = 'uploading'
    setChunk()
  }
  const pause = () => {
    if (['success', 'cancel', 'pause', 'ready'].includes(status.value)) return
    instance.pause()
    status.value = 'pause'
    setChunk()
  }
  const cancel = () => {
    if (['cancel', 'ready'].includes(status.value)) return
    instance.cancel()
    status.value = 'cancel'
    setChunk()
  }
  const ajaxRequest = params => instance.ajaxRequest(params)
  return {
    chunks,
    instance,
    isFinish,
    status: readonly(status),
    progress: readonly(progress),
    start,
    pause,
    cancel,
    setRequest,
    ajaxRequest
  }
}
function useSliceDownload(options) {
  const progress = ref(0)
  const chunks = ref([])
  const status = ref('ready')
  const isFinish = computed(() => progress.value === 100)
  const instance = defineSliceDownload({ ...options })
  instance.setDownloadRequest(options.request)
  const setChunk = () => {
    const data = instance.getData()
    chunks.value = data.chunks
  }
  watch(status, () => {
    setChunk()
  })
  instance.on('progress', params => {
    progress.value = params.progress
    setChunk()
  })
  instance.on('finish', params => {
    status.value = 'success'
    setChunk()
    options.onFinish?.(params)
  })
  instance.on('error', error => {
    if (['downloading'].includes(status.value)) status.value = 'error'
    setChunk()
    if (status.value === 'error') options.onError?.(error)
  })
  const setRequest = request => {
    instance.setDownloadRequest(request)
  }
  const ajaxRequest = params => instance.ajaxRequest(params)
  const setFileOptions = options2 => instance.setFileOptions(options2)
  const start = () => {
    if (['success', 'downloading'].includes(status.value)) return
    instance.start()
    status.value = 'downloading'
    setChunk()
  }
  const pause = () => {
    if (['success', 'cancel', 'pause', 'ready'].includes(status.value)) return
    instance.pause()
    status.value = 'pause'
    setChunk()
  }
  const cancel = () => {
    if (['cancel', 'ready'].includes(status.value)) return
    instance.cancel()
    status.value = 'cancel'
    setChunk()
  }
  return {
    chunks,
    instance,
    isFinish,
    status: readonly(status),
    progress: readonly(progress),
    start,
    pause,
    cancel,
    setRequest,
    ajaxRequest,
    setFileOptions
  }
}
export {
  AjaxRequestError,
  SliceDownload,
  SliceUpload,
  ajaxRequest,
  defineSliceDownload,
  defineSliceUpload,
  getFileChunk,
  getFileChunkWorker,
  getHashChunks,
  getPreFile,
  mergeFile,
  saveFile,
  useSliceDownload,
  useSliceUpload
}
