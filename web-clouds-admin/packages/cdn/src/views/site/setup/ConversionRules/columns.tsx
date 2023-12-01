import type { TableColumnData } from '@arco-design/web-vue'
import { uts } from 'vc-material'
import { withDirectives } from 'vue'

import { generateMatchRuleDescription } from '@/utils/utils'
export const columns: TableColumnData[] = [
  { title: '优先级', dataIndex: 'priority' },
  { title: '规则名称', dataIndex: 'name' },
  {
    title: '说明',
    dataIndex: 'region_name',
    render: ({ record }) => (
      <span class="text-[14px]">
        {generateMatchRuleDescription(record.match_rule_template)}
      </span>
    )
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    render: ({ record }) =>
      withDirectives(h('span'), [[uts, record.created_at]])
  },
  { title: '状态', dataIndex: 'status', slotName: 'status' },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 146,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]
