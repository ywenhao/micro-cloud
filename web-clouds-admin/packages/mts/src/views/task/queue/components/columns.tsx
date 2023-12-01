import type { TableColumnData } from '@arco-design/web-vue'
import { emptyFormatter, sortableSettings } from 'vc-material'

export const columns: TableColumnData[] = [
  {
    dataIndex: 'name',
    title: '名称',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '216px' },
    slotName: 'name'
  },
  {
    dataIndex: 'user_id',
    title: '所属用户',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '216px' },

    slotName: 'user_id'
  },
  {
    dataIndex: 'index',
    title: '优先级',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '216px' },
    render: emptyFormatter
  },
  {
    dataIndex: 'queue_count',
    title: '待处理任务数',
    cellStyle: { minWidth: '216px' },
    sortable: sortableSettings,
    render: emptyFormatter
  },
  {
    dataIndex: 'process_count',
    title: '正在处理任务数',
    cellStyle: { minWidth: '216px' },
    sortable: sortableSettings,
    render: emptyFormatter
  },

  {
    dataIndex: 'actions',
    title: '操作',
    width: 70,
    slotName: 'actions'
  }
]
