import { type TableColumnData } from '@arco-design/web-vue'

const eventColumns: TableColumnData[] = [
  {
    dataIndex: 'name',
    title: '规则名称',
    cellStyle: { minWidth: '200px' },
    ellipsis: true,
    tooltip: true
  },
  {
    dataIndex: 'prefix',
    slotName: 'prefix',
    title: '规则策略',
    cellStyle: { minWidth: '180px' }
  },
  {
    dataIndex: 'events',
    title: '事件',
    cellStyle: { minWidth: '120px' }
  },
  {
    dataIndex: 'callback_urls',
    slotName: 'url',
    title: '回调地址',
    cellStyle: { minWidth: '240px' },
    ellipsis: true,
    tooltip: true
  },

  {
    dataIndex: 'actions',
    title: '操作',
    width: 120,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]
export default eventColumns
