import { type TableColumnData } from '@arco-design/web-vue'
import { emptyFormatterUnix, sortableSettings } from 'vc-material/utils'

const columns: TableColumnData[] = [
  {
    dataIndex: 'name',
    title: '调度域名',
    cellStyle: { minWidth: '220px' },
    ellipsis: true,
    tooltip: true
  },
  {
    dataIndex: 'usage_type',
    title: '作用范围',
    slotName: 'usage_type',
    cellStyle: { minWidth: '120px' },
    ellipsis: true,
    tooltip: true
  },
  {
    dataIndex: 'remark',
    title: '备注',
    cellStyle: { minWidth: '240px' },
    ellipsis: true,
    tooltip: true,
    render: ({ record }) => <span v-table-cell={record.remark || '-'}></span>
  },
  {
    dataIndex: 'updated_at',
    title: '更新时间',
    width: 180,
    sortable: sortableSettings,
    render: emptyFormatterUnix
  }
]
export default columns
