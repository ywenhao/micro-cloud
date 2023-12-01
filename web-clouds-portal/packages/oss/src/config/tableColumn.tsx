import { type TableColumnData, Tag, Tooltip } from '@arco-design/web-vue'
import { IconExclamationCircle } from '@arco-design/web-vue/es/icon'
import dayjs from 'dayjs'

import {
  algorithmOptions,
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
      slotName: 'remark'
    },
    {
      title: '绑定域名',
      dataIndex: 'domain',
      render({ record }) {
        return (
          <div class="flex flex-col items-start gap-y-1">
            {dealDomain(record as ApplyListItem).map((item, index) => {
              return h('span', { key: `${item}__${index}` }, item || '-')
            })}
          </div>
        )
      }
    },
    {
      title: '证书品牌',
      dataIndex: 'brand',
      render({ record }) {
        if (type === 1 && !record.brand) {
          return <span>自有</span>
        }
        return <span>{dealDisplay(brandOptions, record.brand)}</span>
      }
    },
    {
      title: '加密算法',
      dataIndex: 'algorithm',
      render({ record }) {
        return <span>{dealDisplay(algorithmOptions, record.algorithm)}</span>
      }
    },
    {
      title: '域名验证方式',
      dataIndex: 'is_verify',
      render({ record }) {
        return <span>{dealDisplay(verifyOptions, record.is_verify)}</span>
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      render({ record }) {
        return (
          <Tag
            class="flex flex-row gap-x-1 items-center"
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
      sortable: {
        sortDirections: ['ascend', 'descend']
      },
      render({ record }) {
        return dayjs(Number(record?.created_at) * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      }
    },
    {
      title: '签发时间',
      dataIndex: 'issued_date',
      sortable: {
        sortDirections: ['ascend', 'descend']
      },
      render({ record }) {
        return dayjs(Number(record?.issued_date) * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      }
    },
    {
      title: '到期时间',
      dataIndex: 'expiration_time',
      sortable: {
        sortDirections: ['ascend', 'descend']
      },
      render({ record }) {
        return dayjs(Number(record?.expiration_time) * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      }
    },
    {
      title: '自动续期',
      dataIndex: 'is_renewal',
      slotName: 'autoRenew',
      width: 88
    },
    {
      title: '操作',
      slotName: 'optional',
      align: 'left',
      width: isApply ? 200 : 180
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
