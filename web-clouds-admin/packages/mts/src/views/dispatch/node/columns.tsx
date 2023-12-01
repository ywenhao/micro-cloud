import { type TableColumnData, Tag } from '@arco-design/web-vue'
import {
  emptyFormatter,
  emptyFormatterUnix,
  sortableSettings
} from 'vc-material'
export const columns: TableColumnData[] = [
  {
    dataIndex: 'name',
    title: '节点名称',
    cellStyle: { minWidth: '120px' },
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'region_name',
    cellStyle: { minWidth: '120px' },
    title: '区域',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'address',
    title: 'IP地址',
    cellStyle: { minWidth: '160px' },
    slotName: 'address'
  },
  {
    dataIndex: 'version',
    title: '程序版本',
    cellStyle: { minWidth: '120px' },
    ellipsis: true,
    tooltip: true,
    slotName: 'version'
  },
  {
    dataIndex: 'status',
    title: '状态',
    cellStyle: { minWidth: '76px' },
    ellipsis: true,
    tooltip: true,
    render: ({ record }) => {
      if (record.status === 1) {
        return <Tag color="green">在线</Tag>
      }
      return <Tag color="gray">离线</Tag>
    }
  },
  {
    dataIndex: 'cpu',
    title: 'CPU',
    cellStyle: { minWidth: '64px' },

    ellipsis: true,
    tooltip: true,
    render: ({ record }) => <span>{`${Math.floor(record.cpu)}%`}</span>
  },
  {
    dataIndex: 'mem',
    title: '内存',
    cellStyle: { minWidth: '64px' },

    ellipsis: true,
    tooltip: true,
    render: ({ record }) => <span>{`${Math.floor(record.mem)}%`}</span>
  },
  {
    dataIndex: 'disk',
    title: '磁盘',
    cellStyle: { minWidth: '64px' },

    ellipsis: true,
    tooltip: true,
    render: ({ record }) => <span>{`${Math.floor(record.disk)}%`}</span>
  },
  {
    dataIndex: 'remark',
    title: '备注',
    cellStyle: { minWidth: '117px' },
    ellipsis: true,
    tooltip: true,
    slotName: 'remark'
  },
  {
    dataIndex: 'report_time',
    title: '最近上报时间',
    cellStyle: { minWidth: '180px' },
    width: 180,
    ellipsis: true,
    tooltip: true,
    sortable: sortableSettings,
    render: emptyFormatterUnix
  },
  {
    dataIndex: 'actions',
    slotName: 'action',
    width: 170
  }
]
