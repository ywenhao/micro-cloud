import type { TableColumnData } from '@arco-design/web-vue'
import {
  emptyFormatter,
  emptyFormatterUnix,
  sortableSettings
} from 'vc-material'

export const columns: TableColumnData[] = [
  {
    dataIndex: 'name',
    title: '域名',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'sub_product_type',
    title: '所属子产品',
    ellipsis: true,
    tooltip: true,
    render({ record }) {
      const obj = { 1: 'CDN', 2: 'OSS' }
      return obj[record.sub_product_type as keyof typeof obj] || '-'
    }
  },
  {
    dataIndex: 'usage_type',
    title: '用途',
    ellipsis: true,
    tooltip: true,
    render({ record }) {
      const obj = { 1: '区域调度', 2: '系统域名解析', 3: '用户空间' }
      return obj[record.usage_type as keyof typeof obj] || '-'
    }
  },
  {
    dataIndex: 'rr_count',
    title: '记录数',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'usage_status',
    title: '使用状态',
    render({ record }) {
      return record.usage_status === 2 ? '使用中' : '未使用'
    }
  },
  {
    dataIndex: 'ns_status',
    title: 'NS服务器状态',
    slotName: 'ns_status'
  },
  {
    dataIndex: 'remark',
    title: '备注',
    slotName: 'remark'
  },
  {
    dataIndex: 'created_at',
    title: '添加时间',
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
