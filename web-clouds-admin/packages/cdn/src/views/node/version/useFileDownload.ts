import { type Ref, ref } from 'vue'

interface DownloadProgress {
  loaded: number
  total: number
  progress: number
}

/**
 * useFileDownload，返回downloadFile和progress的对象
 * downloadFile是一个异步函数，它接受一个URL作为参数，用于下载文件。在下载过程中，函数会通过progress引用值更新下载进度。一旦下载完成或出现错误，progress引用值将被重置为初始值。
 * progress是一个响应式引用值，包含了一个包含已下载字节数、文件总字节数和下载进度的对象。通过监听progress引用值的变化，可以显示下载进度。
 */
export default function useFileDownload(): {
  downloadFile(url: string): Promise<void>
  progress: Ref<DownloadProgress>
} {
  const progress = ref<DownloadProgress>({
    loaded: 0,
    total: 0,
    progress: 0
  })

  const downloadFile = async (downloadUrl: string) => {
    progress.value = {
      loaded: 0,
      total: 0,
      progress: 0
    }
    try {
      if (!downloadUrl.trim()) {
        throw new Error('缺少下载地址')
      }
      const response = await fetch(downloadUrl)
      const contentLengthHeader = response.headers.get('content-length')
      if (!contentLengthHeader) {
        throw new Error('缺少Content-Length标头')
      }
      const totalBytes = parseInt(contentLengthHeader)
      const reader = response.body!.getReader()
      let receivedBytes = 0

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }
        receivedBytes += value!.length
        const receivedProgress = receivedBytes / totalBytes
        progress.value = {
          loaded: receivedBytes,
          total: totalBytes,
          progress: receivedProgress
        }
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = url.substring(url.lastIndexOf('/') + 1)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
    } finally {
      progress.value = {
        loaded: 0,
        total: 0,
        progress: 0
      }
    }
  }

  return { downloadFile, progress }
}
