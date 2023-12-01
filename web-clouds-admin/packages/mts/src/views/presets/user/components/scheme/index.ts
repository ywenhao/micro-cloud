import type { VcFilterBarScheme } from 'vc-material'

import type { TabLabel } from '../../IndexView.vue'
import { scheme as screenshot } from './screenshot'
import { scheme as transcode } from './transcode'
import { scheme as videoSplice } from './video-splice'
import { scheme as watermark } from './watermark'

const schemeMap = new Map<TabLabel, VcFilterBarScheme>([
  ['普通转码预设', transcode],
  ['水印预设', watermark],
  ['截图预设', screenshot],
  ['视频拼接预设', videoSplice]
])

export function useScheme(type: TabLabel) {
  return schemeMap.get(type) ?? { widgets: [] }
}
