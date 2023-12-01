import type { TableColumnData } from '@arco-design/web-vue'
import { emptyFormatterUnix, emptyText, sortableSettings } from 'vc-material'

export const useColumns = (onClick: (row: any) => void) =>
  [
    {
      dataIndex: 'title',
      title: '公告标题',
      width: 220,
      tooltip: true,
      ellipsis: true,
      render({ record }) {
        return (
          <span class="td-link" onClick={() => onClick(record)}>
            {emptyText(record.title)}
          </span>
        )
      }
    },
    {
      dataIndex: 'content',
      title: '公告内容',
      tooltip: true,
      ellipsis: true,
      render({ record }) {
        return (
          <span class="td-link" onClick={() => onClick(record)}>
            {emptyText(record.content)}
          </span>
        )
      }
    },
    {
      dataIndex: 'created_at',
      title: '发布时间',
      width: 180,
      sortable: sortableSettings,
      render: emptyFormatterUnix
    }
  ] satisfies TableColumnData[]
