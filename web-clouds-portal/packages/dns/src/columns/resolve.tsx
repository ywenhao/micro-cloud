import type { TableColumnData } from '@arco-design/web-vue'
import type { DomainModel } from '@vcp/apis/dns'
import {
  emptyFormatter,
  emptyFormatterUnix,
  sortableSettings,
  VcSvgIcon
} from 'vc-material'

import DnsStatus from '@/components/DnsStatus.vue'

export const columns: TableColumnData[] = [
  {
    dataIndex: 'name',
    title: '域名',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'group_name',
    title: '分组',
    ellipsis: true,
    tooltip: true,
    width: 200,
    render: emptyFormatter
  },
  {
    dataIndex: 'rr_count',
    title: '记录数',
    ellipsis: true,
    tooltip: true,
    width: 200,
    render: emptyFormatter
  },
  {
    dataIndex: 'ns_status',
    title: 'NS服务器状态',
    ellipsis: true,
    tooltip: true,
    render({ record, column }) {
      record = record as DomainModel
      const item = record[column.dataIndex!] as DomainModel['ns_status']
      if (!item) return '-'

      return (
        <DnsStatus status={item}>
          <div class="break-all">
            <div class="flex items-center whitespace-nowrap leading-[20px] color-$color-text-1 font-500">
              <VcSvgIcon prefix="dns" size={18} name="warning" class="mr-6px" />
              请到域名注册商处修改DNS服务器为：
            </div>
            <div class="pt-8px color-$color-text-2">
              {record.assign_ns_list![0]}
            </div>
            <div class="pt-4px  color-$color-text-2">
              {record.assign_ns_list![1]}
            </div>
          </div>
        </DnsStatus>
      )
    }
  },
  {
    dataIndex: 'remark',
    title: '备注',
    slotName: 'remark'
  },
  {
    dataIndex: 'created_at',
    title: '添加时间',
    width: 200,
    sortable: sortableSettings,
    render: emptyFormatterUnix
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 140,
    slotName: 'actions'
  }
]
