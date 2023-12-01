import { matchConfig } from '@/components/MatchingRule/config'

/** 单位常量 */
export const UNITS = {
  values: [1024 * 1024, 1024 * 1024 * 1024],
  labels: ['MB', 'GB']
}

/**
 * 获取字段配置
 * @param field
 * @returns
 */
export function getFieldConfig(field: string) {
  return matchConfig.find(config => config.value === field)
}

import dayjs from 'dayjs'

/**
 * 生成匹配规则模板描述
 * @param template
 * @returns
 */
export const generateMatchRuleDescription = (template: string) => {
  if (!template) return
  const arr = JSON.parse(template)
  const sets = new Set()
  arr.forEach((item: any) => {
    item.rules.forEach((rule: any) => {
      sets.add(rule.field)
    })
  })
  const fields = Array.from(sets).map(filed => {
    const config = getFieldConfig(filed as string)
    return config ? config.label : ''
  })
  return fields.join(', ')
}

/**
 * 日期禁用
 * @param current 当前时间
 * @returns
 */
export const disabledDate = (current: Date) => {
  if (dayjs(current).isAfter(dayjs())) return true
  if (dayjs(current).isBefore(dayjs().subtract(1, 'year'))) return true
  return false
}
