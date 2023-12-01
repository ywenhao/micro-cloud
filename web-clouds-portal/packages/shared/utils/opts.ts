import type { LabelValue } from 'vc-material'

/**
 * 查找label
 * @param options 列表
 * @param value 值
 * @returns
 */
export function getLabelByValue(options: LabelValue[], value: any) {
  const option = options.find(option => option.value === value)
  return option?.label || '-'
}
