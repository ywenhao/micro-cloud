import type { TableColumnData } from '@arco-design/web-vue'
import {
  emptyFormatter,
  emptyFormatterUnix,
  sortableSettings
} from 'vc-material'

export const columns: TableColumnData[] = [
  {
    dataIndex: 'id',
    title: '工作流ID',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'name',
    title: '工作流名称',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'queue_name',
    title: '队列',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'created_at',
    title: '创建时间',
    width: 180,
    sortable: sortableSettings,
    render: emptyFormatterUnix
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 200,
    slotName: 'actions'
  }
]
