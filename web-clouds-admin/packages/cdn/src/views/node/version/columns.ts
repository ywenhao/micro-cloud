import type { TableColumnData } from '@arco-design/web-vue'
import { emptyFormatterUnix, sortableSettings } from 'vc-material'

export const columns: TableColumnData[] = [
  { title: '版本号', dataIndex: 'version' },
  { title: '安装包大小', dataIndex: 'file_size' },
  { title: '版本说明', dataIndex: 'desc', slotName: 'desc' },
  {
    title: '上传时间',
    dataIndex: 'created_at',
    render: emptyFormatterUnix,
    sortable: sortableSettings
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 150,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]
