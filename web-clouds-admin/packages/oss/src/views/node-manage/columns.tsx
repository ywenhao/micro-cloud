import { type TableColumnData, Tag } from '@arco-design/web-vue'
import { emptyFormatterUnix, sortableSettings } from 'vc-material/utils'

const columns: TableColumnData[] = [
  {
    dataIndex: 'region_id',
    slotName: 'region_id',
    title: '所属区域',
    cellStyle: { minWidth: '90px' },
    ellipsis: true,
    tooltip: true
  },
  {
    dataIndex: 'ip',
    title: 'IP',
    cellStyle: { minWidth: '150px' }
  },
  {
    dataIndex: 'total_kb',
    title: '磁盘总量',
    slotName: 'total_kb',
    cellStyle: { minWidth: '100px' }
  },
  {
    dataIndex: 'used_kb',
    title: '使用空间',
    slotName: 'used_kb',
    width: 185
  },
  {
    dataIndex: 'remaining_kb',
    slotName: 'remaining_kb',
    title: '剩余空间',
    width: 185
  },
  {
    dataIndex: 'created_at',
    title: '添加时间',
    width: 175,
    sortable: sortableSettings,
    render: emptyFormatterUnix
  },
  {
    dataIndex: 'status',
    title: '在线状态',
    width: 100,
    // 在线状态 1:在线 2:离线
    render: ({ record }) => (
      <Tag class={record?.status === 1 ? 'is-success' : 'is-info'}>
        {record?.status === 1 ? '在线' : '离线'}
      </Tag>
    )
  },
  {
    dataIndex: 'time',
    title: '使用时长',
    slotName: 'time',
    width: 120
  }
]
export default columns
