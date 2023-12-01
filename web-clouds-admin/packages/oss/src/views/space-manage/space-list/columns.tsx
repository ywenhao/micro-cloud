import { type TableColumnData } from '@arco-design/web-vue'
import { emptyFormatterUnix, sortableSettings } from 'vc-material/utils'

const columns: TableColumnData[] = [
  {
    dataIndex: 'name',
    title: '空间名称',
    cellStyle: { minWidth: '160px' },
    ellipsis: true,
    tooltip: true,
    sortable: sortableSettings
  },
  {
    dataIndex: 'user_id',
    title: '所属用户',
    slotName: 'user_id',
    width: 130
  },
  {
    dataIndex: 'stroage_bytes',
    slotName: 'stroage_bytes',
    title: '存储量',
    width: 120,
    ellipsis: true,
    tooltip: true
  },
  {
    dataIndex: 'storage_num',
    title: '对象数',
    width: 90
  },
  {
    dataIndex: 'label',
    slotName: 'label',
    title: '空间标签',
    width: 100
  },
  {
    dataIndex: 'region_id',
    slotName: 'region_id',
    title: '存储区域',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '120px' }
  },
  {
    dataIndex: 'acl',
    slotName: 'acl',
    title: '访问权限',
    cellStyle: { minWidth: '120px' }
  },
  {
    dataIndex: 'remark',
    title: '备注',
    cellStyle: { minWidth: '120px' },
    ellipsis: true,
    tooltip: true,
    slotName: 'remark'
  },
  {
    dataIndex: 'created_at',
    title: '创建时间',
    width: 180,
    ellipsis: true,
    tooltip: true,
    sortable: sortableSettings,
    render: emptyFormatterUnix
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 200,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]
export default columns
