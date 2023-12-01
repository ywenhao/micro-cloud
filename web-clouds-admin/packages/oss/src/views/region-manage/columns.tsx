import { type TableColumnData } from '@arco-design/web-vue'
const columns: TableColumnData[] = [
  {
    dataIndex: 'name',
    title: '区域名称',
    cellStyle: { minWidth: '120px' }
  },
  {
    dataIndex: 'node_num',
    title: '已关联节点',
    cellStyle: { minWidth: '120px' }
  },
  {
    dataIndex: 'ip',
    title: '区域IP',
    cellStyle: { minWidth: '180px' }
  },
  {
    dataIndex: 'domain_id',
    slotName: 'domain_id',
    title: '区域外链域名',
    cellStyle: { minWidth: '120px' }
  },
  {
    dataIndex: 'total_kb',
    slotName: 'total_kb',
    title: '区域空间大小',
    cellStyle: { minWidth: '120px' }
  },
  {
    dataIndex: 'bucket_num',
    title: '空间数',
    cellStyle: { minWidth: '120px' }
  },
  {
    dataIndex: 'remark',
    slotName: 'remark',
    title: '备注',
    width: 240,
    ellipsis: true,
    tooltip: true
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 110,
    slotName: 'actions',
    cellClass: 'table-actions'
  }
]
export default columns
