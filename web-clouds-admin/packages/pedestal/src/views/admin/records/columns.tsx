import { Switch, type TableColumnData } from '@arco-design/web-vue'
import { sortableSettings } from 'vc-material'

const columns: TableColumnData[] = [
  { dataIndex: 'username', title: '账号', width: 120 },
  {
    dataIndex: 'login_at',
    title: '最近登录时间',
    sortable: sortableSettings,
    width: 180,
    render: ({ record }) => <span v-uts={record.created_at}></span>
  },
  {
    dataIndex: 'ip',
    title: '最近登录IP',
    width: 180,
    render: ({ record }) => <span v-table-cell={record.email}></span>
  },
  {
    dataIndex: 'group_name',
    title: '所在地',
    width: 120,
    render: ({ record }) => <span v-table-cell={record.email}></span>
  },
  {
    dataIndex: 'created_at',
    title: '创建时间',
    width: 180,
    render: ({ record }) => <span v-uts={record.created_at}></span>
  },
  {
    dataIndex: 'status',
    title: '状态',
    width: 120,
    render({ record }) {
      return (
        <Switch
          modelValue={record.status}
          checkedValue={1}
          uncheckedValue={2}
        ></Switch>
      )
    }
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 156,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]
export default columns
