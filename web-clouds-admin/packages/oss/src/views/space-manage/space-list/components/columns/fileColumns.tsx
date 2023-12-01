import { type TableColumnData } from '@arco-design/web-vue'
import { emptyFormatterUnix, sortableSettings } from 'vc-material/utils'

const columns: TableColumnData[] = [
  {
    dataIndex: 'key',
    title: '文件名/目录名',
    slotName: 'file_key',
    cellStyle: { minWidth: '200px' },
    ellipsis: true,
    tooltip: true
  },
  {
    dataIndex: 'size',
    slotName: 'size',
    title: '文件大小',
    cellStyle: { minWidth: '180px' }
  },
  {
    dataIndex: 'content_type',
    title: '文件类型',
    slotName: 'content_type',
    cellStyle: { minWidth: '120px' }
  },
  {
    dataIndex: 'last_modified',
    title: '上传时间',
    cellStyle: { minWidth: '180px' },
    sortable: sortableSettings,
    render: emptyFormatterUnix
  },

  {
    dataIndex: 'actions',
    title: '操作',
    width: 100,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]
export default columns
