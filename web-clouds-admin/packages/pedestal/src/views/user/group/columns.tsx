import type { TableColumnData } from '@arco-design/web-vue'
import { emptyFormatter, sortableSettings } from 'vc-material'

const columns: TableColumnData[] = [
  {
    dataIndex: 'name',
    title: '分组名称',
    ellipsis: true,
    tooltip: true,
    cellStyle: { minWidth: '160px' }
  },
  {
    dataIndex: 'user_count',
    title: '关联用户数量',
    cellStyle: { minWidth: '120px' },
    slotName: 'userCount'
  },
  {
    dataIndex: 'equity',
    title: '查看权益',
    cellStyle: { minWidth: '100px' },
    slotName: 'equity'
  },
  {
    dataIndex: 'remark',
    title: '备注',
    cellStyle: { minWidth: '160px' },
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'max_certificate_count',
    title: '可申请证书数量',
    cellStyle: { minWidth: '140px' },
    render: ({ record }) => (
      <span>
        {Number(record.ssl_privilege.max_certificate_count) === 0
          ? '无限制'
          : String(record.ssl_privilege.max_certificate_count)}
      </span>
    )
  },
  {
    dataIndex: 'max_domain_count',
    title: '可申请域名数量',
    cellStyle: { minWidth: '140px' },
    render: ({ record }) => (
      <span>
        {Number(record.ssl_privilege.max_domain_count) === 0
          ? '无限制'
          : String(record.ssl_privilege.max_domain_count)}
      </span>
    )
  },
  { dataIndex: 'sort_number', title: '排序', width: 80 },
  {
    dataIndex: 'create_at',
    title: '创建时间',
    sortable: sortableSettings,
    width: 180,
    render: ({ record }) => <span v-uts={record.created_at}></span>
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 120,
    slotName: 'actions'
  }
]
export default columns
