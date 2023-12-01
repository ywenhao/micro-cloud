import type { RuleValue } from '../MatchingRule'
import type { RuleType } from './RuleConfig/types'
import SetupPageRules from './SetupPageRules.vue'

export * from './RuleConfig/rules'
export * from './RuleConfig/types'

// 生成规则
export function generateRule(configs: any[]) {
  const rules: { [key in RuleType]?: RuleValue } = {}
  configs.forEach(rule => {
    // @ts-ignore
    rules[rule.type] = rule.value
  })
  return rules
}

export default SetupPageRules
