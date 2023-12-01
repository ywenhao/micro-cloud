import { type TableColumnData } from '@arco-design/web-vue'
import { emptyFormatterUnix, sortableSettings } from 'vc-material/utils'

const columns: TableColumnData[] = [
  {
    dataIndex: 'name',
    title: '域名',
    cellStyle: { minWidth: '200px' },
    ellipsis: true
  },

  {
    dataIndex: 'agreement',
    slotName: 'agreement',
    title: '协议',
    cellStyle: { minWidth: '180px' }
  },

  {
    dataIndex: 'ssl_status',
    slotName: 'ssl_status',
    title: '证书状态',
    cellStyle: { minWidth: '180px' }
  },

  {
    dataIndex: 'created_at',
    title: '创建时间',
    cellStyle: { minWidth: '180px' },
    sortable: sortableSettings,
    render: emptyFormatterUnix
  },
  {
    dataIndex: 'updated_at',
    title: '修改时间',
    cellStyle: { minWidth: '180px' },
    sortable: sortableSettings,
    render: emptyFormatterUnix
  },

  {
    dataIndex: 'actions',
    title: '操作',
    width: 260,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]
export default columns
