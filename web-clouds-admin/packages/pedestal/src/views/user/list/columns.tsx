import { type TableColumnData } from '@arco-design/web-vue'
import {
  emptyFormatter,
  emptyFormatterUnix,
  sortableSettings
} from 'vc-material'
const columns: TableColumnData[] = [
  {
    dataIndex: 'id',
    title: '用户ID',
    cellStyle: { minWidth: '120px' },
    slotName: 'id'
  },
  {
    dataIndex: 'username',
    title: '账号',
    cellStyle: { minWidth: '120px' },
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'email',
    title: '邮箱',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '180px' },
    render: emptyFormatter
  },
  { dataIndex: 'group_name', title: '分组', cellStyle: { minWidth: '120px' } },
  {
    dataIndex: 'created_at',
    title: '创建时间',
    cellStyle: { minWidth: '180px' },
    sortable: sortableSettings,
    render: emptyFormatterUnix
  },
  {
    dataIndex: 'status',
    title: '状态',
    width: 90,
    slotName: 'status'
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 195,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]
export default columns
