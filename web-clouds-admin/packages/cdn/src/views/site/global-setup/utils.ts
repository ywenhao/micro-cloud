/**
 * 将字节数转换为压缩后的字符串表示。
 *
 * @param bytes 字节数
 * @returns 压缩后的字符串表示
 */
export const byteConvertCompress = (bytes: string): string => {
  let byteNum = Number(bytes)
  // 判断输入是否合法
  if (isNaN(byteNum) || byteNum < 0) {
    return '0 B'
  }
  // 定义单位符号
  const symbols = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let exp = Math.floor(Math.log(byteNum) / Math.log(2))
  if (exp < 1) {
    exp = 0
  }
  const i = Math.floor(exp / 10)

  byteNum /= 2 ** (10 * i)
  if (byteNum.toString().length > byteNum.toFixed(2).toString().length) {
    byteNum = +byteNum.toFixed(0)
  }
  if (Number.isNaN(byteNum) && !symbols[i]) return '-'
  return `${byteNum} ${symbols[i]}`
}
