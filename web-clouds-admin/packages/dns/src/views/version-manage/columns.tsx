import type { TableColumnData } from '@arco-design/web-vue'
import {
  emptyFormatter,
  emptyFormatterUnix,
  sortableSettings
} from 'vc-material'

export const columns: TableColumnData[] = [
  {
    dataIndex: 'version_name',
    title: '版本号',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'file_size',
    title: '安装包大小',
    render({ record }) {
      if (!record.file_size) return '-'
      return `${(record.file_size / 1024 / 1024).toFixed(2)}MB`
    }
  },
  {
    dataIndex: 'remark',
    title: '版本说明',
    slotName: 'remark'
  },
  {
    dataIndex: 'created_at',
    title: '创建时间',
    width: 180,
    sortable: sortableSettings,
    render: emptyFormatterUnix
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 150,
    slotName: 'actions'
  }
]
