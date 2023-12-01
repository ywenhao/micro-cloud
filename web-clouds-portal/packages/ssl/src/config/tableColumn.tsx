import { type TableColumnData, Tag, Tooltip } from '@arco-design/web-vue'
import { IconExclamationCircle } from '@arco-design/web-vue/es/icon'
import { emptyFormatterUnix, sortableSettings } from 'vc-material'

import {
  brandOptions,
  statusApplyOptions,
  statusOwnedOptions,
  verifyOptions
} from '@/config/options'
import type { ApplyListItem } from '@/types/applyList'
import { dealDisplay, dealDomain, dealStatusColor } from '@/utils/handleColumn'
/**
 * 列表单元格
 *
 */
export const tableColumn = (
  isApply: boolean,
  type?: number
): TableColumnData[] => {
  const statusOptions = ref<any[]>(
    isApply ? statusApplyOptions : statusOwnedOptions
  )
  let columns: TableColumnData[] = [
    {
      title: '证书备注名',
      dataIndex: 'desc',
      tooltip: true,
      ellipsis: true,
      slotName: 'remark'
    },
    {
      title: '绑定域名',
      dataIndex: 'domain',
      render({ record }) {
        return (
          <Tooltip
            background-color="white"
            position="bottom"
            contentClass="tool-content"
          >
            {{
              default: () => (
                <div class="flex flex-col items-start gap-y-1 ">
                  {dealDomain(record as ApplyListItem).map((item, index) => {
                    return (
                      <div
                        key={`${item}__${index}`}
                        class=" text-ct-1 text-truncate w-full"
                      >
                        {item || '-'}
                      </div>
                    )
                  })}
                </div>
              ),
              content: () => (
                <div class="flex flex-col items-start max-w-[400px] gap-y-1">
                  {dealDomain(record as ApplyListItem).map((item, index) => {
                    return (
                      <div
                        key={`${item}__${index}`}
                        class="w-full text-ct-1 break-words"
                      >
                        {item || '-'}
                      </div>
                    )
                  })}
                </div>
              )
            }}
          </Tooltip>
        )
      }
    },
    {
      title: '证书品牌',
      dataIndex: 'brand',
      cellStyle: { minWidth: '96px' },
      tooltip: true,
      ellipsis: true,
      render({ record }) {
        if (type === 1) {
          return <span>{record.own_brand}</span>
        }
        return <span>{dealDisplay(brandOptions, record.brand)}</span>
      }
    },
    // {
    //   title: '加密算法',
    //   dataIndex: 'algorithm',
    //   render({ record }) {
    //     return <span>{dealDisplay(algorithmOptions, record.algorithm)}</span>
    //   }
    // },
    {
      title: '域名验证方式',
      dataIndex: 'is_verify',
      cellStyle: { minWidth: '117px' },
      tooltip: true,
      ellipsis: true,
      render({ record }) {
        return <span>{dealDisplay(verifyOptions, record.is_verify)}</span>
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      cellStyle: { minWidth: '120px' },
      tooltip: true,
      ellipsis: true,
      render({ record }) {
        return (
          <Tag
            class={[
              'flex flex-row gap-x-1 items-center',
              { 'text-[#2253e6]!': record.status === 2 }
            ]}
            color={dealStatusColor(record.status, isApply)}
          >
            {dealDisplay(statusOptions.value, record.status)}
            <Tooltip
              backgroundColor={'white'}
              position="bottom"
              content={record.reason}
              content-class="tool-content"
            >
              {record.status === 4 && isApply
                ? h(IconExclamationCircle, {
                    size: '16',
                    style: 'color: rgb(var(--danger-6)); cursor: pointer'
                  })
                : ''}
            </Tooltip>
          </Tag>
        )
      }
    },
    {
      title: '申请时间',
      dataIndex: 'created_at',
      sortable: sortableSettings,
      cellStyle: { minWidth: '180px' },
      render: emptyFormatterUnix
    },
    {
      title: '签发时间',
      dataIndex: 'issued_date',
      sortable: sortableSettings,
      cellStyle: { minWidth: '180px' },
      render: emptyFormatterUnix
    },
    {
      title: '到期时间',
      dataIndex: 'expiration_time',
      sortable: sortableSettings,
      cellStyle: { minWidth: '180px' },
      render: emptyFormatterUnix
    },
    {
      title: '自动续期',
      dataIndex: 'is_renewal',
      slotName: 'autoRenew',
      ellipsis: true,
      tooltip: true,
      cellStyle: { minWidth: '88px' }
    },
    {
      title: '操作',
      slotName: 'optional',
      align: 'left',
      width: isApply ? 180 : 150
    }
  ]

  // 根据模块过滤表格列
  if (isApply) {
    const applyFilter = [
      'is_renewal',
      'expiration_time',
      'issued_date',
      'algorithm'
    ]
    columns = columns.filter(
      item => !applyFilter.includes(item.dataIndex ?? '')
    )
  } else {
    if (type === 2) {
      const issuedFilter = ['created_at', 'issued_date', 'algorithm']
      columns = columns.filter(
        item => !issuedFilter.includes(item.dataIndex ?? '')
      )
    } else {
      const ownFilter = ['created_at', 'is_verify', 'is_renewal']
      columns = columns.filter(
        item => !ownFilter.includes(item.dataIndex ?? '')
      )
    }
  }

  return columns
}
