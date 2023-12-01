import { type TableColumnData } from '@arco-design/web-vue'
import { emptyFormatterUnix } from 'vc-material/utils'

const lifeColumns: TableColumnData[] = [
  {
    dataIndex: 'name',
    title: '名称',
    cellStyle: { minWidth: '200px' },
    ellipsis: true,
    tooltip: true
  },
  {
    dataIndex: 'prefix',
    slotName: 'prefix',
    title: '策略',
    cellStyle: { minWidth: '180px' },
    ellipsis: true,
    tooltip: true
  },
  {
    dataIndex: 'expire_days',
    title: '动作',
    slotName: 'expire_days',
    cellStyle: { minWidth: '120px' }
  },
  {
    dataIndex: 'created_at',
    title: '创建时间',
    cellStyle: { minWidth: '180px' },
    render: emptyFormatterUnix
  },

  {
    dataIndex: 'actions',
    title: '操作',
    width: 120,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]
export default lifeColumns
