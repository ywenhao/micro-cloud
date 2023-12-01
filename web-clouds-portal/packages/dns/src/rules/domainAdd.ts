import type { FieldRule } from '@arco-design/web-vue'

import { domainRules } from './domain'

type ChildError = {
  index: number
  key: string
}

export const useDomainAddRules = (
  props: Record<string, any>,
  fromRef: Ref<any>
) => {
  const childError = ref<ChildError[]>([])
  const rules = computed(
    () =>
      ({
        domains: [...domainRules]
      } as Record<string, FieldRule[]>)
  )

  provide('formRef', fromRef)
  provide('childError', childError)
  return { rules, childError }
}
