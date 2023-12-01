import type { TableColumnData } from '@arco-design/web-vue'
import {
  emptyFormatter,
  emptyFormatterUnix,
  sortableSettings
} from 'vc-material'

export const columns: TableColumnData[] = [
  {
    dataIndex: 'addr',
    title: 'DNS服务器地址',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'ip',
    title: 'IP地址',
    slotName: 'ip'
  },
  {
    width: 120,
    title: '程序版本',
    dataIndex: 'current_version',
    slotName: 'current_version'
  },
  {
    dataIndex: 'online_status',
    title: '节点状态',
    render({ record }) {
      if (!record.online_status) return '-'
      return +record.online_status === 1 ? '在线' : '离线'
    }
  },
  {
    dataIndex: 'domain_count',
    title: '解析域名数',
    ellipsis: true,
    tooltip: true,
    render({ record }) {
      return (+record.domain_count || 0) + (+record.system_domain_count || 0)
    }
  },

  {
    dataIndex: 'remark',
    title: '备注',
    slotName: 'remark'
  },
  {
    dataIndex: 'assign_status',
    title: '自动分配',
    slotName: 'assign_status',
    titleSlotName: 'assign_status_title'
  },
  {
    dataIndex: 'last_report_at',
    title: '最近上报时间',
    width: 180,
    sortable: sortableSettings,
    render: emptyFormatterUnix
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 186,
    slotName: 'actions'
  }
]
