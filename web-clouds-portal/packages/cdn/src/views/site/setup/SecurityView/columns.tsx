import { type TableColumnData, Tag } from '@arco-design/web-vue'
import { uts } from 'vc-material'
import { withDirectives } from 'vue'

export const columns: TableColumnData[] = [
  { title: '优先级', dataIndex: 'priority' },
  { title: '规则名称', dataIndex: 'name' },
  {
    title: '执行策略',
    dataIndex: 'operation',
    render: ({ record }) => {
      if (record.operation === 0) {
        return <Tag color="green">允许</Tag>
      }
      if (record.operation === 1) {
        return <Tag color="orange">阻止</Tag>
      }
    }
  },
  {
    title: '添加时间',
    dataIndex: 'created_at',
    render: ({ record }) =>
      withDirectives(h('span'), [[uts, record.created_at]])
  },
  {
    title: '状态',
    dataIndex: 'is_enable',
    slotName: 'status'
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 146,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]

export const presetRulesCols: TableColumnData[] = [
  { title: '规则 ID', dataIndex: 'md5', slotName: 'md5' },
  { title: '描述', dataIndex: 'description', slotName: 'desc' },
  {
    title: '执行策略',
    dataIndex: 'operation',
    render({ record }) {
      if (record?.status === 1) {
        return <Tag class="is-success">允许</Tag>
      }
      return <Tag class="is-warning">阻止</Tag>
    }
  },
  {
    title: '部署状态',
    dataIndex: 'deploy',
    slotName: 'deploy',
    width: 100
  }
]
