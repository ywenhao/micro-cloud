import type { TableColumnData } from '@arco-design/web-vue'
import { emptyFormatter, sortableSettings } from 'vc-material'
export const columns: TableColumnData[] = [
  {
    dataIndex: 'node_name',
    title: '节点名称',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'total_task',
    title: '任务总数',
    ellipsis: true,
    sortable: sortableSettings,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'success_task',
    title: '已成功',
    ellipsis: true,
    sortable: sortableSettings,
    tooltip: true,
    render: ({ record }) => {
      const num = calcFun(+record.success_task, +record.total_task)
      return (
        <div class="flex flex-row gap-x-2">
          <span>{Number(record.success_task).toLocaleString()}</span>
          {num && <span class="color-ct-3">{num}%</span>}
        </div>
      )
    }
  },
  {
    dataIndex: 'fail_task',
    title: '已失败',
    sortable: sortableSettings,
    ellipsis: true,
    tooltip: true,
    render: ({ record }) => {
      const num = calcFun(+record.success_task, +record.total_task)
      return (
        <div class="flex flex-row gap-x-2">
          <span>{Number(record.fail_task).toLocaleString()}</span>
          {num && (
            <span class="color-ct-3">{(100 * 100 - +num * 100) / 100}%</span>
          )}
        </div>
      )
    }
  }
]

const calcFun = (num: number, total: number) => {
  if (num && total > 0) {
    return ((num / total) * 100).toFixed(2)
  } else {
    return null
  }
}
