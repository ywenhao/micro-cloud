import type { TableColumnData } from '@arco-design/web-vue'
import { isNil } from 'lodash-es'
import { emptyFormatter } from 'vc-material'

import { watermarkLocationOpts, watermarkTypeOpts } from '@/utils/opts/preset'

export const columns: TableColumnData[] = [
  {
    dataIndex: 'name',
    title: '名称',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'type',
    title: '类型',
    ellipsis: true,
    tooltip: true,
    render: ({ record }) => getLabelByValue(watermarkTypeOpts, +record.type)
  },
  {
    dataIndex: 'location',
    title: '位置',
    render: ({ record }) =>
      getLabelByValue(watermarkLocationOpts, +record.location)
  },
  {
    dataIndex: 'margin_w',
    title: '横向边距',
    ellipsis: true,
    tooltip: true,
    render({ record }) {
      if (isNil(record.margin_w)) return '-'
      return `${record.margin_w} PX`
    }
  },
  {
    dataIndex: 'margin_h',
    title: '纵向边距',
    ellipsis: true,
    tooltip: true,
    render({ record }) {
      if (isNil(record.margin_h)) return '-'
      return `${record.margin_h} PX`
    }
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 200,
    slotName: 'actions'
  }
]
