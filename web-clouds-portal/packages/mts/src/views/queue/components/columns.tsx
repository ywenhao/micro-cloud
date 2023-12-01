import type { TableColumnData } from '@arco-design/web-vue'
import { emptyFormatter } from 'vc-material'

export const columns: TableColumnData[] = [
  {
    dataIndex: 'index',
    title: '优先级',
    ellipsis: true,
    tooltip: true,
    align: 'center',
    width: 80,
    render({ rowIndex }) {
      return rowIndex + 1
    }
  },
  {
    dataIndex: 'name',
    title: '名称',
    slotName: 'name'
  },
  {
    dataIndex: 'queue_count',
    title: '待处理任务数',
    render: emptyFormatter
  },
  {
    dataIndex: 'process_count',
    title: '正在处理任务数',
    render: emptyFormatter
  },

  {
    dataIndex: 'actions',
    title: '操作',
    width: 70,
    slotName: 'actions'
  }
]
