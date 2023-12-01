import type { TableColumnData } from '@arco-design/web-vue'
import { emptyFormatter } from 'vc-material'

export const columns: TableColumnData[] = [
  { title: '优先级', dataIndex: 'priority' },
  { title: '规则名称', dataIndex: 'name', render: emptyFormatter },
  { title: '执行策略', dataIndex: 'operation', slotName: 'operation' },
  {
    title: '描述',
    dataIndex: 'expression_template',
    slotName: 'expression_template',
    tooltip: true,
    ellipsis: true
  },
  {
    title: '部署节点',
    dataIndex: 'node_ids',
    tooltip: true,
    ellipsis: true,
    slotName: 'node_ids'
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 120,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]

export const nodeListColumns: TableColumnData[] = [
  { title: '节点名称', dataIndex: 'name' },
  { title: '节点IP', dataIndex: 'ip' }
]
