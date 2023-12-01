import type { ApplyListItem } from '@/types/applyList'
import type { LicenseItem } from '@/types/licenseList'
export const domainShow = computed(() => (row: ApplyListItem) => {
  if (row.domain) {
    return row.domain
  } else {
    return (row.domain ?? '').split(',')[0]
  }
})

/**
 * 处理列表品牌，验证方式显示
 * */
export const dealDisplay = (
  payload: { label: string; value: any }[],
  value?: number | string
): string => {
  if (value === 0 || value === '0') {
    return '-'
  }
  let temp = ''
  payload.find(item => {
    if (item.value === value) {
      temp = item.label
    }
  })
  return temp ?? '-'
}

/**
 * 处理域名显示
 * */
export const dealDomain = (row: ApplyListItem | LicenseItem): string[] => {
  const list = (row.domain ?? '')
    .split(',')
    .concat(row.primary_domain ?? '')
    .filter(Boolean)
  return list.length > 0 ? list : ['-']
}

/**
 * 处理证书申请状态显示
 */
export const dealStatusColor = (
  status: number,
  isApply: boolean = true
): string => {
  const apply = [
    {
      value: 1,
      color: 'green'
    },
    {
      value: 2,
      color: 'blue'
    },
    {
      value: 3,
      color: 'orange'
    },
    {
      value: 4,
      color: 'red'
    },
    {
      value: 5,
      color: 'gray'
    }
  ]
  const mine = [
    {
      value: 1,
      color: 'green'
    },
    {
      value: 2,
      color: 'blue'
    },
    {
      value: 3,
      color: 'gray'
    },
    {
      value: 4,
      color: 'gray'
    },
    {
      value: 5,
      color: 'orange'
    },
    {
      value: 6,
      color: 'red'
    }
  ]
  const data = isApply ? apply : mine
  return data.find(item => item.value === status)?.color ?? ''
}
