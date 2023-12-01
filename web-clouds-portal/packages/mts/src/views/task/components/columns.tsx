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
    cellStyle: { minWidth: '276px' },
    render: emptyFormatter
  },
  {
    dataIndex: 'name',
    title: '任务名称',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '145px' },
    render: emptyFormatter
  },
  {
    dataIndex: 'file_name',
    title: '资源名称',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '145px' },

    render: emptyFormatter
  },

  {
    dataIndex: 'queue_name',
    title: '所属队列',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '145px' },

    render: emptyFormatter
  },
  {
    dataIndex: 'status',
    title: '状态',
    cellStyle: { minWidth: '119px' },
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
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '180px' },
    sortable: sortableSettings,
    render: emptyFormatterUnix
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 132,
    slotName: 'actions'
  }
]
