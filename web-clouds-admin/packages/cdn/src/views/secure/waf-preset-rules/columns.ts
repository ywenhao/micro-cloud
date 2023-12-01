import type { TableColumnData } from '@arco-design/web-vue'
import { emptyFormatter, emptyText } from 'vc-material'

import { OPERATION } from './state'

export const columns: TableColumnData[] = [
  { title: '规则ID', dataIndex: 'rule.md5', slotName: 'md5' },
  { title: '描述', dataIndex: 'rule.description', render: emptyFormatter },
  {
    title: '默认处理方式',
    dataIndex: 'rule.operation',
    render({ record }) {
      return emptyText(
        OPERATION[record.rule.operation as keyof typeof OPERATION]
      )
    }
  }
]
