import type { TableColumnData } from '@arco-design/web-vue'
import { emptyFormatter } from 'vc-material'

import { videoFormatOpts } from '@/utils/opts/preset'

export const columns: TableColumnData[] = [
  {
    dataIndex: 'name',
    title: '名称',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'custom_type',
    title: '类型',
    render({ record }) {
      const type = record.custom_type as number
      if (!type) return '-'
      return +type === 1 ? '自定义预设' : '系统预设'
    }
  },
  {
    dataIndex: 'format',
    title: '输出格式',
    ellipsis: true,
    tooltip: true,
    render: ({ record }) => getLabelByValue(videoFormatOpts, +record.format)
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 200,
    slotName: 'actions'
  }
]
