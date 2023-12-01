import type { TableColumnData } from '@arco-design/web-vue'
import { get } from 'lodash-es'
import {
  emptyFormatter,
  emptyFormatterUnix,
  sortableSettings
} from 'vc-material'

export const columns: Record<string, TableColumnData[]> = {
  domain: [
    { title: '解析域名', dataIndex: 'domain', render: emptyFormatter },
    { title: '关联站点数', dataIndex: 'site_count', slotName: 'site_count' },
    { title: '备注', dataIndex: 'remark' },
    {
      title: '添加时间',
      dataIndex: 'created_at',
      sortable: sortableSettings,
      render: emptyFormatterUnix
    },
    {
      dataIndex: 'actions',
      title: '操作',
      width: 130,
      slotName: 'actions',
      cellClass: 'table-actions'
    }
  ],
  region: [
    { title: '区域名称', dataIndex: 'name', render: emptyFormatter },
    { title: '区域域名', dataIndex: 'dns_domain', render: emptyFormatter },
    { title: '区域CNAME', dataIndex: 'cname', render: emptyFormatter },
    { title: '关联节点', dataIndex: 'node_count', slotName: 'node_count' },
    { title: '关联站点', dataIndex: 'site_count', slotName: 'site_count' },
    {
      title: '添加时间',
      dataIndex: 'created_at',
      sortable: sortableSettings,
      render: emptyFormatterUnix
    },
    {
      dataIndex: 'actions',
      title: '操作',
      width: 130,
      slotName: 'actions',
      cellClass: 'table-actions'
    }
  ]
}

interface DetailColumns {
  [k: string]: TableColumnData[] | DetailColumns
}

export const detailsCols = (
  module: string,
  type: string
): TableColumnData[] => {
  const cols: DetailColumns = {
    domain: {
      site: [
        {
          title: '分配时间',
          ellipsis: true,
          tooltip: true,
          dataIndex: 'created_at',
          sortable: sortableSettings
        },
        {
          title: 'CNAME域名',
          ellipsis: true,
          tooltip: true,
          dataIndex: 'cname'
        },
        {
          title: '站点域名',
          ellipsis: true,
          tooltip: true,
          dataIndex: 'site_domain'
        },
        {
          title: '所属用户',
          ellipsis: true,
          tooltip: true,
          dataIndex: 'user_id'
        }
      ]
    },
    region: {
      site: [
        {
          title: '站点名称',
          ellipsis: true,
          tooltip: true,
          dataIndex: 'domain'
        },
        {
          title: 'CNAME域名',
          ellipsis: true,
          tooltip: true,
          dataIndex: 'cname_domain'
        },
        {
          title: '所属用户',
          ellipsis: true,
          tooltip: true,
          dataIndex: 'user_id'
        },
        {
          title: '解析状态',
          ellipsis: true,
          tooltip: true,
          dataIndex: 'attach.resolve_status',
          slotName: 'resolve_status'
        }
      ],
      node: [
        {
          title: '节点名称',
          ellipsis: true,
          tooltip: true,
          dataIndex: 'name'
        },
        { title: '节点IP', ellipsis: true, tooltip: true, dataIndex: 'ip' },
        {
          title: '解析状态',
          ellipsis: true,
          tooltip: true,
          dataIndex: 'rr_status',
          slotName: 'rr_status'
        }
      ]
    }
  }
  return get(cols, [module, type], [])
}
