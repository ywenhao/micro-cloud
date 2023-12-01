import { type TableColumnData } from '@arco-design/web-vue'
import {
  emptyFormatter,
  emptyFormatterUnix,
  secToTime,
  sortableSettings
} from 'vc-material'

export const columns: TableColumnData[] = [
  {
    dataIndex: 'name',
    title: '主机记录',
    ellipsis: true,
    tooltip: true,
    width: 200,
    render: emptyFormatter
  },
  {
    dataIndex: 'type',
    title: '记录类型',
    ellipsis: true,
    tooltip: true,
    width: 120,
    render: emptyFormatter
  },
  {
    dataIndex: 'value',
    title: '记录值',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'ttl',
    title: 'TTL',
    ellipsis: true,
    tooltip: true,
    width: 100,
    render({ record, column }) {
      const item = record[column.dataIndex!]
      return secToTime(item)
    }
  },
  {
    dataIndex: 'remark',
    title: '备注',
    slotName: 'remark'
  },
  {
    dataIndex: 'created_at',
    title: '添加时间',
    width: 200,
    sortable: sortableSettings,
    render: emptyFormatterUnix
  },
  {
    dataIndex: 'status',
    title: '状态',
    slotName: 'status',
    width: 100
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 120,
    slotName: 'actions'
  }
]
