import type { TableColumnData } from '@arco-design/web-vue'
import {
  emptyFormatter,
  emptyFormatterUnix,
  sortableSettings
} from 'vc-material'

export const columns: TableColumnData[] = [
  {
    dataIndex: 'name',
    title: '域名',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'user_id',
    title: '所属用户',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'rr_count',
    title: '记录数',
    ellipsis: true,
    tooltip: true,
    width: 200,
    render: emptyFormatter
  },
  {
    dataIndex: 'ns_status',
    title: 'NS服务器状态',
    slotName: 'ns_status'
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
    dataIndex: 'actions',
    title: '操作',
    width: 140,
    slotName: 'actions'
  }
]
