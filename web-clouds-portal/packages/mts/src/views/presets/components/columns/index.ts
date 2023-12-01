import type { TableColumnData } from '@arco-design/web-vue'

import type { TabLabel } from '../../IndexView.vue'
import { columns as screenshot } from './screenshot'
import { columns as transcode } from './transcode'
import { columns as videoSplice } from './video-splice'
import { columns as watermark } from './watermark'

const columnsMap = new Map<TabLabel, TableColumnData[]>([
  ['普通转码预设', transcode],
  ['水印预设', watermark],
  ['截图预设', screenshot],
  ['视频拼接预设', videoSplice]
])

export function useColumns(type: TabLabel) {
  return columnsMap.get(type) ?? []
}
