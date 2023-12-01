import type { TableColumnData } from '@arco-design/web-vue'
import { sortableSettings } from 'vc-material'

const columns: TableColumnData[] = [
  {
    dataIndex: 'title',
    title: '消息标题',
    cellStyle: { minWidth: '200px' },
    ellipsis: true,
    tooltip: true
  },
  {
    dataIndex: 'type_name',
    title: '消息类型',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '120px' }
  },
  {
    dataIndex: 'read_count',
    title: '浏览人数',
    width: 146,
    render: ({ record }) => (
      <span>
        {record?.read_count ? Number(record.read_count).toLocaleString() : '0'}
      </span>
    )
  },
  {
    dataIndex: 'created_at',
    title: '创建时间',
    cellStyle: { minWidth: '180px' },
    sortable: sortableSettings,
    render: ({ record }) => <span v-uts={record.created_at}></span>
  },
  {
    dataIndex: 'release_time',
    title: '发布时间',
    cellStyle: { minWidth: '180px' },
    sortable: sortableSettings,
    render: ({ record }) => <span v-uts={record.release_time}></span>
  },
  {
    dataIndex: 'create_account',
    title: '创建人',
    cellStyle: { minWidth: '140px' }
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 155,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]
export default columns
