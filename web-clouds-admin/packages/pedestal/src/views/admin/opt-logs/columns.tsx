import { type TableColumnData } from '@arco-design/web-vue'
import { emptyFormatterUnix } from 'vc-material'

import { operationLogModuleMap, operationLogTypeMap } from './enum'
const columns: TableColumnData[] = [
  {
    dataIndex: 'index',
    title: '序号',
    width: 90,
    render: ({ rowIndex }) => rowIndex + 1
  },
  {
    dataIndex: 'created_at',
    title: '操作时间',
    width: 180,
    render: emptyFormatterUnix
  },
  {
    dataIndex: 'username',
    title: '操作用户',
    ellipsis: true,
    tooltip: true,
    width: 130
  },
  {
    dataIndex: 'type',
    title: '操作类型',
    width: 120,
    // @ts-ignore
    render: ({ record }) => operationLogTypeMap[record.type]
  },

  {
    dataIndex: 'module',
    title: '所属模块',
    width: 120,
    // @ts-ignore
    render: ({ record }) => operationLogModuleMap[record.module]
  },
  {
    dataIndex: 'content',
    title: '操作内容',
    ellipsis: true,
    tooltip: {
      contentStyle: { maxWidth: '672px' },
      contentClass: 'whitespace-pre-wrap	'
    },
    // width: 120
    cellStyle: { minWidth: '90px' }
  },
  {
    dataIndex: 'ip',
    title: 'IP',
    width: 180
  }
]
export default columns
