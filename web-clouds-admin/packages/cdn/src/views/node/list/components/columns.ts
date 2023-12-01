import type { TableColumnData } from '@arco-design/web-vue'
import { emptyFormatterUnix } from 'vc-material'

// const NODE_RUN_STATUS_MAP: Record<string, string> = {
//   // 1: 运行 2: 停止 3: 异常
//   1: '运行',
//   2: '停止',
//   3: '异常'
// }

export const columns: TableColumnData[] = [
  {
    title: '节点名称',
    dataIndex: 'name',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '120px' }
  },
  {
    title: 'IP',
    dataIndex: 'ips',
    cellStyle: { minWidth: '120px' },
    ellipsis: true,
    tooltip: true
  },
  {
    title: '所属区域',
    dataIndex: 'region_name',
    cellStyle: { minWidth: '100px' },
    ellipsis: true,
    tooltip: true
  },
  {
    title: '运行状态',
    dataIndex: 'run_status',
    cellStyle: { minWidth: '120px' },
    slotName: 'run_status'
  },
  {
    title: '解析状态',
    dataIndex: 'resolve_status',
    cellStyle: { minWidth: '120px' },
    titleSlotName: 'resolve_status_title',
    slotName: 'resolve_status'
  },
  {
    title: '同步配置',
    dataIndex: 'sync_status',
    cellStyle: { minWidth: '120px' },
    slotName: 'sync_status'
  },
  {
    title: '上次同步时间',
    cellStyle: { minWidth: '200px' },
    ellipsis: true,
    tooltip: true,
    dataIndex: 'sync_last_time',
    render: emptyFormatterUnix
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 146,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]
