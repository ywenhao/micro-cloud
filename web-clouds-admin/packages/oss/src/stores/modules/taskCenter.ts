import { Message } from '@arco-design/web-vue'
import {
  postObjectsMultipartApi,
  updateObjectsMultipartApi
} from '@vca/apis/oss'
import { getAppName } from '@vca/shared'
import type { SliceUploadStatus } from '@vca/shared/src/lib/slice-upload-utils'
import { defineStore } from 'pinia'

import { type fileListMap, useTaskUpload } from '@/hooks/useTaskUpload'

export type CustomFileItem = {
  file: File
  upload_id?: string
  status: SliceUploadStatus
  etags: string[]
  position: string
  errorMessage?: string
  progress: number
  realProgress: number
  params: { bucket_id: string; key: string }
}

export type DelCatalogItem = {
  space_name: string
  catalog: string
  params: {
    marker: string
    bucket_id: string
    prefix: string
    limit: number
    delimiter: string
  }
  status: 'ready' | 'deleteIng' | 'error' | 'success' | 'cancel'
}

const appName = getAppName(true)

export const useTaskCenterStore = defineStore(
  `__VCLOUD_ADMIN_${appName}_STORE_APP__TASK_CENTER_`,
  () => {
    // 最大同时上传文件数量
    const MAX_COUNT = 2
    // 文件chunk列表, 用于续传
    const fileListMap: fileListMap = new WeakMap()
    // drawer是否显示
    const visible = ref(false)
    // 外链域名
    const outDomain = ref('')
    // 当前上传的文件
    const currentFileList = reactive<(CustomFileItem | null)[]>([])

    const hasCurrent = computed(() => currentFileList.some(item => !!item))

    // 上传实例
    const uploadInstances = Array.from({ length: MAX_COUNT }, (_, index) =>
      useTaskUpload(currentFileList, index, fileListMap)
    )

    // 任务文件列表
    const taskFileList = ref<CustomFileItem[]>([])
    // 待删除的目录列表
    const delCatalogList = ref<DelCatalogItem[]>([])
    // 未完成的上传任务数量
    const uploadWaitCount = computed(
      () => taskFileList.value.filter(item => item.status !== 'success').length
    )
    // 待删除的目录数量
    const delWaitCount = computed(
      () =>
        delCatalogList.value.filter(item => item.status !== 'success').length
    )

    const waitCount = computed(() => uploadWaitCount.value + delWaitCount.value)

    // 是否全部完成
    const isAllFinish = computed(() => !uploadWaitCount.value)
    // 待上传的文件列表
    const waitUploadList = computed(() =>
      taskFileList.value.filter(item => ['ready'].includes(item.status))
    )
    const hasUploading = computed(() =>
      taskFileList.value.some(item => item.status === 'uploading')
    )

    const restCurrent = (item: CustomFileItem) => {
      const idx = currentFileList.indexOf(item)
      if (idx > -1) currentFileList[idx] = null
    }

    // 开始上传
    const start = () => {
      if (!waitUploadList.value.length || isAllFinish.value) return

      // push currentFileList & start
      for (let i = 0; i < MAX_COUNT; i++) {
        const list = waitUploadList.value.filter(
          v => !currentFileList.includes(v)
        )
        const item = list[0]
        if (item && !currentFileList[i]) {
          currentFileList[i] = item
        }
      }

      const list = currentFileList.filter(
        item => item && item.status === 'ready'
      )
      list.forEach(() => {
        try {
          _start()
        } catch (error) {
          console.error(error)
        }
      })
    }

    const _start = async () => {
      if (!hasCurrent.value || isAllFinish.value) return
      const list = currentFileList.filter(
        item => item && item.status === 'ready'
      )
      if (!list.length) return
      const item = list[0]!
      const index = currentFileList.indexOf(item)
      const instance = uploadInstances[index]
      instance.uploadFile = item?.file!

      item.status = 'uploading'
      // 上传进度全部完成, 只是合并出错
      const chunks = fileListMap.get(item) || []
      const isChunksFinish = chunks.length
        ? chunks.every(item => item.status === 'success')
        : false
      if (isChunksFinish && item.upload_id && item.realProgress === 100) {
        finishFn(index)
        return
      }
      // 获取upload_id
      try {
        if (!item.upload_id) {
          const { bucket_id, key } = item.params
          const size = String(item?.file.size)
          const params = { bucket_id, key, size }
          const { upload_id } = await postObjectsMultipartApi(params)
          item.upload_id = upload_id
        }
        await instance.start()
      } catch (error) {
        item.status = 'error'
        restCurrent(item)
        start()
      }
    }

    // 取消上传
    const cancel = (index: number) => {
      const item = taskFileList.value[index]
      if (!item || !hasUploading.value) return
      if (item.status !== 'uploading') return
      const idx = currentFileList.indexOf(item)
      const instance = uploadInstances[idx]
      instance.pause()
      item.progress = 0
      item.status = 'cancel'
      restCurrent(item)
      start()
    }

    // 暂停上传
    const allPause = () => {
      if (!hasCurrent.value || !hasUploading.value) return
      for (const item of currentFileList) {
        if (!item) continue
        const idx = currentFileList.indexOf(item)
        const instance = uploadInstances[idx]
        instance.pause()
        item.status = 'cancel'
      }
    }

    const finishFn = async (index: number) => {
      if (!hasCurrent.value) return
      const item = currentFileList[index]!
      // 合并切片
      try {
        const upload_id = item?.upload_id!
        const { bucket_id, key } = item.params
        const parts = item.etags.map((etag, index) => ({
          etag,
          part_number: index + 1
        }))
        await updateObjectsMultipartApi({
          key,
          parts,
          upload_id,
          bucket_id
        })
        item.progress = 100
        item.status = 'success'
      } catch (error) {
        item.status = 'error'
      }
      restCurrent(item)
      if (isAllFinish.value) {
        Message.success('全部上传完成')
        return
      }
      start()
    }

    uploadInstances.forEach((instance, index) => {
      instance.setOnFinish(() => finishFn(index))

      instance.setOnError(() => {
        if (hasCurrent.value) {
          const item = currentFileList[index]

          const noUploading = instance.chunks.every(
            v => v.status !== 'uploading'
          )
          if (item && noUploading) {
            item.status = 'error'
            Message.error('上传失败')
            restCurrent(item)
            start()
          }
        }
      })

      instance.setOnProgress(percent => {
        if (!hasCurrent.value) return
        const item = currentFileList[index]
        if (!item) return

        item.realProgress = percent
        // 防止进度回退
        if (item.progress >= percent) return
        if (percent >= 99)
          // 最多到99， 合并成功才是100
          percent = 99
        item.progress = percent
      })
    })

    // 全部重试
    const allRetry = () => {
      taskFileList.value.forEach(item => {
        if (!['ready', 'success', 'uploading'].includes(item.status)) {
          item.status = 'ready'
        }
      })

      if (!hasUploading.value) start()
    }

    // 全部停止
    const allStop = () => {
      if (hasCurrent.value && hasUploading.value) allPause()

      taskFileList.value.forEach(item => {
        if (!['uploading', 'success'].includes(item.status)) {
          item.status = 'cancel'
        }
      })
      currentFileList.forEach((_, index) => {
        currentFileList[index] = null
      })
    }

    // 清空
    const allClean = () => {
      uploadInstances.forEach(instance => instance.cancel())
      currentFileList.forEach((_, index) => {
        currentFileList[index] = null
      })
    }

    // 重试
    const retry = (index: number) => {
      const item = taskFileList.value[index]
      if (!item) return
      item.status = 'ready'
      start()
    }

    // 移除
    const remove = (index: number) => {
      const item = taskFileList.value[index]
      restCurrent(item)
      taskFileList.value.splice(index!, 1)
    }

    return {
      taskFileList,
      delCatalogList,
      uploadWaitCount,
      delWaitCount,
      waitCount,
      visible,
      outDomain,
      hasUploading,
      start,
      cancel,
      allPause,
      retry,
      remove,
      allRetry,
      allStop,
      allClean
    }
  },
  { persist: false }
)
