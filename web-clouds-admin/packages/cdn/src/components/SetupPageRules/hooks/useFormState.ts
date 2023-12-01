import type { PageRuleModel } from '@vca/apis/cdn'
import { v4 as uuidV4 } from 'uuid'

import { ruleList } from '../RuleConfig/rules'
import type { RuleData, RuleType, RuleValue } from '../RuleConfig/types'
export const useFormState = (config: Ref<PageRuleModel>) => {
  const configs = ref<RuleData[]>([])

  const selectedRuleTypes = computed(() => {
    return configs.value.map(item => item.type)
  })

  // 首个类型是否是https和转发url
  const firstTypeIsHttpsOrForward = computed(() => {
    return (
      configs.value[0].type === 'always_https' ||
      configs.value[0].type === 'forwarding_url'
    )
  })

  // 添加规则
  const handleAdd = () => {
    const rule = ruleList.find(item => {
      if (
        !firstTypeIsHttpsOrForward.value &&
        (item.value === 'always_https' || item.value === 'forwarding_url')
      ) {
        return false
      }
      return !selectedRuleTypes.value.includes(item.value)
    })
    if (rule) {
      configs.value.push({
        uuid: uuidV4(),
        type: '',
        value: null
      })
    }
  }
  watchPostEffect(() => {
    configs.value = configs.value = Object.entries(config.value).map(
      ([key]) => {
        return {
          uuid: uuidV4(),
          type: key as RuleType,
          value: Reflect.get(config.value, key)
        }
      }
    )
  })

  // 生成规则
  const generateRule = () => {
    const rules: { [key in RuleType]?: RuleValue } = {}
    configs.value.forEach(rule => {
      // @ts-ignore
      rules[rule.type] = rule.value
    })
    return rules
  }

  return { configs, handleAdd, selectedRuleTypes, generateRule }
}
