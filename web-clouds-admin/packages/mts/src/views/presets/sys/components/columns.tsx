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
    dataIndex: 'format',
    title: '输出格式',
    ellipsis: true,
    tooltip: true,
    render({ record }) {
      return getLabelByValue(videoFormatOpts, record.format)
    }
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 200,
    slotName: 'actions'
  }
]
