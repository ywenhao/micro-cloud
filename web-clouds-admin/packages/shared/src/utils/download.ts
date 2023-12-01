import { Message } from '@arco-design/web-vue'
import { saveFile } from '@vca/shared/src/lib/slice-upload-utils'
import { mergeBaseURL } from 'vc-material'

import { baseURL } from './url'

let messageInstance: any = null

/**
 * 保存文件
 * @param path 地址
 * @returns
 */
export async function saveFileByURL(path: string, filename?: string) {
  if (!path) {
    messageInstance && messageInstance.close()
    messageInstance = Message.error('下载链接错误')
    return
  }
  const url = mergeBaseURL(path, baseURL)
  filename ??= url.split('/').pop()
  try {
    const blob = await fetch(url).then(res =>
      res.status === 200 ? res.blob() : Promise.reject(res.statusText)
    )
    saveFile(blob, filename!)
    messageInstance && messageInstance.close()
    messageInstance = Message.success('下载成功')
  } catch (error) {
    messageInstance && messageInstance.close()
    messageInstance = Message.error('下载失败')
  }
}
