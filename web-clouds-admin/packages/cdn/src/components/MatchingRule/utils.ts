import { matchConfig } from './config'
import type { Operator, OperatorOption } from './types'

/**
 * 获取运算符对应的模板
 * @param operator 运算符
 */
export function getOperatorTemplate(
  operatorOptions: OperatorOption[],
  operator: Operator
) {
  return operatorOptions.find(item => item.value === operator)!
    .template as string
}

/**
 * 处理规则值
 * @param operator
 * @param value
 */
export function handleRuleValue(
  operator: Operator,
  value: string | number | string[] | number[]
) {
  const format = (val: string) =>
    String(val).trim().replaceAll(`"`, `\\"`).replaceAll(`'`, `\\'`)

  let arr: string[] = []
  if (!Array.isArray(value)) {
    arr = [value.toString()]
  } else {
    arr = value.map(item => item.toString())
  }

  if (operator !== 'in' && operator !== 'not_in') {
    return `"${format(arr.join())}"`
  }

  return `{"${arr.join(`", "`)}"}`
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
export function generateMatchRuleDescription(template: string) {
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
