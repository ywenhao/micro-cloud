import type { TableColumnData } from '@arco-design/web-vue'
import { emptyFormatter } from 'vc-material'

export const columns: TableColumnData[] = [
  {
    dataIndex: 'name',
    title: '名称',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'user_id',
    title: '所属用户',
    slotName: 'user_id'
  },
  {
    dataIndex: 'format',
    title: '目标视频格式',
    render: ({ record }) => getLabelByValue(videoFormatOpts, +record.format)
  },
  {
    dataIndex: 'resolution_w',
    title: '目标视频分辨率',
    render({ record }) {
      const w = record.resolution_w as number
      const h = record.resolution_h as number
      if (!w && !h) return '与源视频相同'
      return `${w} * ${h}`
    }
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 120,
    slotName: 'actions'
  }
]
