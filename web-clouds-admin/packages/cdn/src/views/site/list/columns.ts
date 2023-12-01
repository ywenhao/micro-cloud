import type { TableColumnData } from '@arco-design/web-vue'
import { emptyFormatterUnix, sortableSettings } from 'vc-material'

const columns: TableColumnData[] = [
  { dataIndex: 'domain', title: '站点', cellStyle: { minWidth: '164px' } },
  {
    dataIndex: 'user_name',
    title: '所属用户',
    cellStyle: { minWidth: '148px' }
  },
  {
    dataIndex: 'attach.region_name',
    title: '所属区域',
    cellStyle: { minWidth: '120px' }
  },
  // {
  //   dataIndex: 'status',
  //   title: '站点状态',
  //   cellStyle: { minWidth: '96px' },
  //   render: ({ record }) => (record?.status === 1 ? '开启' : '关闭')
  // },
  {
    title: '解析状态',
    dataIndex: 'resolve_status',
    titleSlotName: 'resolve_status_title',
    slotName: 'resolve_status',
    cellStyle: { minWidth: '96px' }
  },
  {
    dataIndex: 'https_status',
    title: 'HTTPS',
    cellStyle: { minWidth: '96px' },
    render: ({ record }) => (record?.https_status === 1 ? '已开启' : '未开启')
  },
  {
    dataIndex: 'created_at',
    title: '站点添加时间',
    sortable: sortableSettings,
    render: emptyFormatterUnix,
    cellStyle: { minWidth: '148px' }
  },
  {
    dataIndex: 'status',
    title: '站点启/禁用',
    slotName: 'status',
    cellStyle: { minWidth: '104px' }
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 132,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]

export default columns
