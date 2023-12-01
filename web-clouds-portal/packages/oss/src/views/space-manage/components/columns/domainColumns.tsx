import { type TableColumnData } from '@arco-design/web-vue'

const cossColumns: TableColumnData[] = [
  {
    dataIndex: 'allowed_origins',
    title: '来源',
    slotName: 'allowed_origins',
    cellStyle: { minWidth: '200px' },
    ellipsis: true
  },
  {
    dataIndex: 'allowed_methods',
    slotName: 'allowed_methods',
    title: '允许Methods',
    cellStyle: { minWidth: '180px' },
    ellipsis: true
  },
  {
    dataIndex: 'allowed_headers',
    title: '允许Headers',
    slotName: 'allowed_headers',
    cellStyle: { minWidth: '120px' },
    ellipsis: true
  },
  {
    dataIndex: 'expose_headers',
    slotName: 'expose_headers',
    title: '暴露Headers',
    cellStyle: { minWidth: '120px' },
    ellipsis: true
  },
  {
    dataIndex: 'max_age',
    title: '缓存时间（单位：s）',
    cellStyle: { minWidth: '180px' }
  },

  {
    dataIndex: 'actions',
    title: '操作',
    width: 120,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]
export default cossColumns
