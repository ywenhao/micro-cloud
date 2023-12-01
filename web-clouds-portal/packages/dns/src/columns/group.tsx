import type { TableColumnData } from '@arco-design/web-vue'
import { emptyFormatter } from 'vc-material'

export const columns: TableColumnData[] = [
  {
    dataIndex: 'name',
    title: '分组名称',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'domain_count',
    title: '已关联域名数',
    slotName: 'domain_count'
  },
  {
    dataIndex: 'remark',
    title: '备注',
    slotName: 'remark'
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 132,
    slotName: 'actions'
  }
]
