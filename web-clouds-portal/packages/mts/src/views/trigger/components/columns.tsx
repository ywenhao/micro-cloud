import type { TableColumnData } from '@arco-design/web-vue'
import { emptyFormatter } from 'vc-material'

export const rulesMap = {
  1: '整个空间',
  2: '前缀',
  3: '后缀'
}
export const columns: TableColumnData[] = [
  {
    dataIndex: 'id',
    title: '任务触发器ID',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'name',
    title: '任务触发器名称',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'bucket_name',
    title: '空间',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'match_rule',
    title: '匹配规则',
    ellipsis: true,
    tooltip: true,
    render: ({ record }) => {
      const status = record.match_rule as keyof typeof rulesMap
      if (record.match_rule === 1) return rulesMap[status]
      return (
        <span>
          {rulesMap[status]}: {record.match_field}
        </span>
      )
    }
  },
  {
    dataIndex: 'queue_name',
    title: '所属队列',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'status',
    title: '状态',
    slotName: 'status'
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 180,
    slotName: 'actions'
  }
]
