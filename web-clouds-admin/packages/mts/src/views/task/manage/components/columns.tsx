import type { TableColumnData } from '@arco-design/web-vue'
import { Tag } from '@arco-design/web-vue'
import {
  emptyFormatter,
  emptyFormatterUnix,
  sortableSettings
} from 'vc-material'

export const statusMap = {
  1: { label: '排队中', color: 'warning' },
  2: { label: '排队中', color: 'warning' },
  3: { label: '处理中', color: 'primary' },
  4: { label: '成功', color: 'success' },
  5: { label: '失败', color: 'danger' }
}

export const columns: TableColumnData[] = [
  {
    dataIndex: 'id',
    title: '任务ID',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'name',
    title: '任务名称',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'user_id',
    title: '所属用户',
    slotName: 'user_id'
  },
  {
    dataIndex: 'file_name',
    title: '资源名称',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'consuming_time',
    title: '处理时长',
    width: 160,
    sortable: sortableSettings,
    render({ record, column }) {
      const unix = record[column.dataIndex!] as number
      return getStrBySecond(unix || 0)
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
    render({ record }) {
      const status = record.status as keyof typeof statusMap
      if (statusMap[status]) {
        return (
          <Tag class={`is-${statusMap[status]['color']}`}>
            {statusMap[status].label}
          </Tag>
        )
      }
      return '-'
    }
  },
  {
    dataIndex: 'submit_time',
    title: '提交时间',
    width: 180,
    sortable: sortableSettings,
    render: emptyFormatterUnix
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 120,
    slotName: 'actions'
  }
]
