import type { TableColumnData } from '@arco-design/web-vue'
import { emptyFormatterUnix, sortableSettings } from 'vc-material'

export const columns: TableColumnData[] = [
  {
    title: '协议类型',
    dataIndex: 'scheme',
    render({ record }) {
      return record?.scheme === 1 ? 'HTTP' : 'HTTPS'
    }
  },
  { title: '端口值', dataIndex: 'port_range' },
  { title: '分配用户数', dataIndex: 'user_count', slotName: 'user_count' },
  {
    title: '添加时间',
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
