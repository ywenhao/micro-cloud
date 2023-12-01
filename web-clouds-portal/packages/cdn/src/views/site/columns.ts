import type { TableColumnData } from '@arco-design/web-vue'
import { emptyFormatterUnix, sortableSettings } from 'vc-material'

const columns: TableColumnData[] = [
  { dataIndex: 'domain', title: '站点', cellStyle: { minWidth: '164px' } },
  {
    dataIndex: 'cname_domain',
    title: 'CNAME域名',
    cellStyle: { minWidth: '148px' },
    titleSlotName: 'cname_domain_title'
  },
  {
    dataIndex: 'status',
    title: '站点状态',
    cellStyle: { minWidth: '96px' },
    slotName: 'status'
  },

  {
    title: '解析状态',
    dataIndex: 'resolve_status',
    titleSlotName: 'resolve_status_title',
    slotName: 'resolve_status',
    cellStyle: { minWidth: '96px' }
  },
  {
    dataIndex: 'origin_site_num',
    title: '源站数',
    cellStyle: { minWidth: '120px' }
  },
  {
    dataIndex: 'https_status',
    title: 'HTTPS',
    cellStyle: { minWidth: '96px' },
    render: ({ record }) => (record?.https_status === 1 ? '已开启' : '未开启')
  },
  {
    dataIndex: 'updated_at',
    title: '更新时间',
    sortable: sortableSettings,
    render: emptyFormatterUnix,
    cellStyle: { minWidth: '148px' }
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 100,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]

export default columns
