import type { TableColumnData } from '@arco-design/web-vue'
import { emptyFormatter, emptyFormatterUnix } from 'vc-material'

export const columns: TableColumnData[] = [
  {
    dataIndex: 'login_at',
    title: '登录时间',
    render: emptyFormatterUnix
  },
  {
    dataIndex: 'login_ip',
    title: '登录IP',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'login_addr',
    title: '所在地',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '200px' },
    render: emptyFormatter
  },
  {
    dataIndex: 'system_info',
    title: '系统版本',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '200px' },
    render: emptyFormatter
  },
  {
    dataIndex: 'browser_info',
    title: '浏览器版本',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '200px' },
    render: emptyFormatter
  }
]
