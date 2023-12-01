import type { TableColumnData } from '@arco-design/web-vue'
import {
  emptyFormatter,
  emptyFormatterUnix,
  emptyText,
  sortableSettings
} from 'vc-material'

export const useColumns = (onClick: (row: any) => void) =>
  [
    {
      dataIndex: 'title',
      title: '消息标题',
      ellipsis: true,
      tooltip: true,
      render({ record, column }) {
        const isRead = +record.read === 1
        return (
          <span
            onClick={() => onClick(record)}
            style={{
              color: `var(${isRead ? '--color-text-3' : '--color-text-1'})`
            }}
            class="cursor-pointer hover:color-primary-5!"
          >
            {emptyText(record[column.dataIndex!])}
          </span>
        )
      }
    },
    {
      dataIndex: 'type_name',
      title: '消息类型',
      // width: 196,
      render: emptyFormatter
    },
    {
      dataIndex: 'release_time',
      title: '发布时间',
      width: 180,
      render: emptyFormatterUnix,
      sortable: sortableSettings
    }
  ] satisfies TableColumnData[]
