import type { TableColumnData, TableData } from '@arco-design/web-vue'
import dayjs from 'dayjs'
import type { VNodeChild } from 'vue'

export const useRetainedDetailTable = () => {
  // 'keep': 留存数 'keep_rate': 留存率
  const tableType = ref('keep')
  const getTitle = (title: string) =>
    tableType.value === 'keep' ? title : `${title}率`

  const getDataIndex = (key: number) => `${tableType.value}${key}`
  const columns = computed<TableColumnData[]>(() => {
    const formatValue = (data: {
      record: TableData
      column: TableColumnData
      rowIndex: number
    }): VNodeChild => {
      // @ts-ignore
      const value = data.record[data.column?.dataIndex] || '0'
      return tableType.value === 'keep' ? value : `${value}%`
    }
    return [
      {
        title: '时间',
        width: 180,
        dataIndex: 'tm',
        render: ({ record }) => dayjs(record.tm * 1000).format('YYYY-MM-DD')
      },
      { title: '新增注册用户数', width: 180, dataIndex: 'nuv' },
      {
        title: getTitle('次日留存'),
        width: 180,
        dataIndex: getDataIndex(1),
        render: formatValue
      },
      {
        title: getTitle('7日留存'),
        width: 180,
        dataIndex: getDataIndex(7),
        render: formatValue
      },
      {
        title: getTitle('15日留存'),
        width: 180,
        dataIndex: getDataIndex(1),
        render: formatValue
      }
    ]
  })

  return { columns, tableType }
}
