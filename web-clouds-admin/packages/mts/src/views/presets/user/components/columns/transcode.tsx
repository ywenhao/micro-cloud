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
    title: '输出格式',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 120,
    slotName: 'actions'
  }
]
