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
    dataIndex: 'stroage_bytes',
    slotName: 'stroage_bytes',
    title: '存储量',
    cellStyle: { minWidth: '120px' }
  },
  {
    dataIndex: 'storage_num',
    title: '对象数',
    cellStyle: { minWidth: '120px' }
  },
  {
    dataIndex: 'label',
    slotName: 'label',
    title: '空间标签',
    cellStyle: { minWidth: '120px' }
  },
  {
    dataIndex: 'region_id',
    slotName: 'region_id',
    title: '存储区域',
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
    width: 200,
    ellipsis: true,
    tooltip: true,
    slotName: 'remark'
  },
  {
    dataIndex: 'created_at',
    title: '创建时间',
    width: 180,
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
