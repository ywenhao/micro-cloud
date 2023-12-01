import type { TableColumnData } from '@arco-design/web-vue'
import { isNil } from 'lodash-es'
import { emptyFormatter } from 'vc-material'

export const columns: TableColumnData[] = [
  {
    dataIndex: 'name',
    title: '任务名称',
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
    dataIndex: 'type',
    title: '类型',
    ellipsis: true,
    tooltip: true,
    render: ({ record }) => getLabelByValue(watermarkTypeOpts, +record.type)
  },
  {
    dataIndex: 'position',
    title: '位置',
    render: emptyFormatter
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
    width: 120,
    slotName: 'actions'
  }
]
