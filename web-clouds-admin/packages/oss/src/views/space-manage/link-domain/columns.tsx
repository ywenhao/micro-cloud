import { type TableColumnData } from '@arco-design/web-vue'
import { emptyFormatterUnix, sortableSettings } from 'vc-material/utils'

const columns: TableColumnData[] = [
  {
    dataIndex: 'names',
    slotName: 'names',
    title: '空间外链域名',
    cellStyle: { minWidth: '200px' },
    sortable: sortableSettings,
    ellipsis: true
  },
  {
    dataIndex: 'bucket_name',
    title: '空间名称',
    cellStyle: { minWidth: '180px' },
    sortable: sortableSettings
  },
  {
    dataIndex: 'user_id',
    title: '所属用户',
    cellStyle: { minWidth: '120px' }
  },
  {
    dataIndex: 'cname_prefixes',
    title: '分配CNAME',
    slotName: 'cname_prefixes',
    cellStyle: { minWidth: '240px' },
    ellipsis: true
  },
  {
    dataIndex: 'region_id',
    slotName: 'region_id',
    title: '空间所属区域',
    cellStyle: { minWidth: '120px' }
  },
  {
    dataIndex: 'updated_at',
    title: '更新时间',
    width: 180,
    sortable: sortableSettings,
    render: emptyFormatterUnix
  },

  {
    dataIndex: 'actions',
    title: '操作',
    width: 80,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]
export default columns
