export const videoFormatOpts = [
  { label: 'MP4', value: 1 },
  { label: 'FLV', value: 2 },
  { label: 'HLS', value: 3 }
]

/**截图封装格式 */
export const screenshotFormatOpts = [
  { label: 'jpg', value: 1 },
  { label: 'png', value: 2 }
]

/**视频编码格式 */
export const videoEncodingFormatOpts = [
  { label: 'H.264', value: 1 },
  { label: 'H.265', value: 2 }
]

/**视频分辨率 */
export const videoFenOpts = [
  { label: '自定义', value: '' },
  { label: '4K高清 3840*2160', value: '3840*2160' },
  { label: '2K高清 2560*1440', value: '2560*1440' },
  { label: '高清 1920*1080', value: '1920*1080' },
  { label: '标清 1280*720', value: '1280*720' },
  { label: '普清 640*480', value: '640*480' },
  { label: '低清 320*240', value: '320*240' }
]

/**音频编码格式 */
export const audioEncodingFormatOpts = [
  { label: '-', value: 0 },
  { label: 'MP3', value: 1 },
  { label: 'AAC', value: 2 },
  { label: 'ACC_HE', value: 3 }
]

/**水印位置 */
export const watermarkLocationOpts = [
  { label: '左上', value: 1 },
  { label: '中上', value: 2 },
  { label: '右上', value: 3 },
  { label: '左中', value: 4 },
  { label: '中', value: 5 },
  { label: '右中', value: 6 },
  { label: '左下', value: 7 },
  { label: '中下', value: 8 },
  { label: '右下', value: 9 }
]

/**水印时间线 */
export const watermarkTimeLineOpts = [
  { label: '从片头开始', value: 1 },
  { label: '从片尾开始（反向）', value: 2 }
]

/**水印类型 */
export const watermarkTypeOpts = [
  { label: '图片水印', value: 1 },
  { label: '文字水印', value: 2 }
]
