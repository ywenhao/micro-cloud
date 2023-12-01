import type { TableColumnData } from '@arco-design/web-vue'
import {
  emptyFormatter,
  emptyFormatterUnix,
  sortableSettings
} from 'vc-material'

export const columns: TableColumnData[] = [
  {
    dataIndex: 'code',
    title: '版本号',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'size',
    title: '安装包大小',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'remark',
    title: '版本说明',
    ellipsis: true,
    tooltip: true,
    slotName: 'remark'
  },
  {
    dataIndex: 'created_at',
    title: '上传时间',
    sortable: sortableSettings,
    ellipsis: true,
    tooltip: true,
    render: emptyFormatterUnix
  },
  {
    dataIndex: 'actions',
    title: '操作',
    slotName: 'actions',
    width: 150
  }
]
