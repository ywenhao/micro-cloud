/**
 * base64下载
 * @param text 文件内容
 * @param fileName 文件名
 * @param type 文件类型
 */
export function useDownloadByBase64(
  text: string,
  fileName: string,
  type = 'application/zip'
) {
  const at = `data:${type};base64,${text}`
  const blob = dataURLtoBlob(at)

  const href = window.URL.createObjectURL(blob)
  const aLink = document.createElement('a')
  aLink.href = href
  aLink.download = fileName
  aLink.style.display = 'none'
  document.body.appendChild(aLink)
  aLink.click()
  document.body.removeChild(aLink)
  window.URL.revokeObjectURL(href)
}

/**
 * dataURLtoBlob
 * @param dataUrl 文件流string
 * @returns
 */
function dataURLtoBlob(dataUrl: string) {
  const arr = (dataUrl ?? '').split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const str = window.atob(arr[1])
  let n = str.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = str.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}
