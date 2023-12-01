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
    dataIndex: 'user_id',
    title: '所属用户',
    slotName: 'user_id'
  },
  {
    dataIndex: 'queue_name',
    title: '所属队列',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'created_at',
    title: '创建时间',
    width: 190,
    sortable: sortableSettings,
    render: emptyFormatterUnix
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 180,
    slotName: 'actions'
  }
]
