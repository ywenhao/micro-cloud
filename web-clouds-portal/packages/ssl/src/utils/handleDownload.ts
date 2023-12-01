import { Message } from '@arco-design/web-vue'

import { useDownloadByBase64 } from '@/hooks/useDownload'
/**
 * 下载证书
 * @param res 接口返回的数据
 * @param fileName 文件名
 */
export function downloadPem(res: { zip?: string }, fileName: string) {
  if (res) {
    const files = Object.entries(res).filter(v => !!v[1])
    if (!files.length) {
      Message.error('文件不存在')
    } else {
      files.forEach(file =>
        useDownloadByBase64(file[1], `${fileName}.${file[0]}`)
      )
    }
  }
}
