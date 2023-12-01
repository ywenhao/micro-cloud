import { type TableColumnData } from '@arco-design/web-vue'

const columns: TableColumnData[] = [
  {
    dataIndex: 'title',
    title: '公告标题',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '180px' }
  },
  {
    dataIndex: 'content',
    title: '公告内容',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '180px' }
  },
  {
    dataIndex: 'read_count',
    title: '浏览人数',
    width: 100,
    render: ({ record }) => (
      <span>
        {record?.read_count ? Number(record.read_count).toLocaleString() : '0'}
      </span>
    )
  },
  {
    dataIndex: 'alert_type',
    title: '弹窗方式',
    width: 100,
    render: ({ record }) => (
      <span>{Number(record.alert_type) === 1 ? '仅弹一次' : '每次都弹'}</span>
    )
  },
  {
    dataIndex: 'created_at',
    title: '创建时间',
    cellStyle: { minWidth: '200px' },

    sortable: {
      sorter: true,
      sortDirections: ['ascend', 'descend']
    },
    render: ({ record }) => <span v-uts={record.created_at}></span>
  },
  {
    dataIndex: 'create_account',
    title: '创建人',
    cellStyle: { minWidth: '146px' },
    render: ({ record }) => <span v-table-cell={record.create_account}></span>
  },
  {
    dataIndex: 'status',
    title: '状态',
    width: 90,
    slotName: 'status'
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
