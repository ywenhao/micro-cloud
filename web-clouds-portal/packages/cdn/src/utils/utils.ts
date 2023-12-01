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

/**
 * 生成匹配规则模板描述
 * @param template
 * @returns
 */
export const generateMatchRuleDescription = (template: string) => {
  if (!template) return
  const arr = JSON.parse(template)
  const sets = new Set()
  arr.forEach(item => {
    item.rules.forEach(rule => {
      sets.add(rule.field)
    })
  })
  const fields = Array.from(sets).map(filed => {
    const config = getFieldConfig(filed as string)
    return config ? config.label : ''
  })
  return fields.join(', ')
}
