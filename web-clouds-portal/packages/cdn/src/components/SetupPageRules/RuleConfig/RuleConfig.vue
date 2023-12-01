<template>
  <div class="rule-config-row">
    <a-form
      class="field-match"
      ref="formRef"
      :model="formData"
      :rules="formRules"
    >
      <a-form-item
        validate-trigger="change"
        field="type"
        hide-label
        class="w-full mb-0!"
      >
        <a-select
          v-model="formData.type"
          :options="options"
          placeholder="请选择"
        />
      </a-form-item>
    </a-form>
    <div class="field-value">
      <component :is="componentName" ref="ruleRef" v-model="value" />
      <empty-rule v-show="!componentName"></empty-rule>
    </div>

    <div class="field-action">
      <a-button
        type="outline"
        :disabled="disableDelete"
        @click="emit('delete')"
      >
        <template #icon>
          <icon-close />
        </template>
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, SelectOptionData } from '@arco-design/web-vue'
import { IconClose } from '@arco-design/web-vue/es/icon'
import type { ComputedRef } from 'vue'
import type { Component } from 'vue'

import EmptyRule from './EmptyRule.vue'
import RuleBrowserCacheTtl from './RuleBrowserCacheTtl.vue'
import RuleCacheLevel from './RuleCacheLevel.vue'
import RuleDisablePerformance from './RuleDisablePerformance.vue'
import RuleDisableSecurity from './RuleDisableSecurity.vue'
import RuleForwardUrl from './RuleForwardUrl.vue'
import RuleHttps from './RuleHttps.vue'
import RuleIpAddressHeader from './RuleIpAddressHeader.vue'
import RuleNodeCacheTtl from './RuleNodeCacheTtl.vue'
import RulePerformanceOptimization from './RulePerformanceOptimization.vue'
import RuleRealClientIp from './RuleRealClientIp.vue'
import { ruleList } from './rules'
import type { RuleData, RuleType, RuleValue } from './types'
const isRepeat = (type: string) =>
  props.formConfigs?.some(item => item.type === type)

const selectedRuleTypes = inject('selectedRuleTypes') as ComputedRef<RuleType[]>

const options = computed(() => {
  return ruleList.map(({ label, value }) => {
    const disabled =
      ((value === 'always_https' || value === 'forwarding_url') &&
        selectedRuleTypes.value?.length) ||
      isRepeat(value)
    return { label, value, disabled } as SelectOptionData
  })
})

interface IEmit {
  (event: 'delete'): void
  (event: 'update:type', value: RuleData['value']): void
  (event: 'update:value', value: RuleValue): void
}

interface IProps {
  type: RuleData['type']
  value: RuleValue
  disableDelete?: boolean
  formConfigs?: RuleData[]
}

const emit = defineEmits<IEmit>()
const props = withDefaults(defineProps<IProps>(), {
  disableDelete: false
})

const ruleRef = ref()

const formRef = ref<FormInstance>()
const formData = reactive({
  // 规则类型
  type: useVModel(props, 'type', emit)
})
const formRules = computed<Rules>(() => {
  return {
    type: [{ required: true, message: '请选择操作' }]
  }
})

// 规则值
const value = useVModel(props, 'value', emit)

watch(
  () => formData.type,
  async () => {
    value.value = null
    await nextTick()
    formRef.value?.validate()
  },
  { deep: true }
)
const ruleMap: Record<RuleType, Component> = {
  '': EmptyRule,
  edge_cache_ttl: RuleNodeCacheTtl,
  cache_level: RuleCacheLevel,
  disable_security: RuleDisableSecurity,
  disable_perf: RuleDisablePerformance,
  browser_ttl: RuleBrowserCacheTtl,
  forwarding_url: RuleForwardUrl,
  auto_minify: RulePerformanceOptimization,
  ip_geolocation_header: RuleIpAddressHeader,
  true_client_ip: RuleRealClientIp,
  always_https: RuleHttps
}
const componentName = computed(() => {
  return ruleMap[formData.type]
})

defineExpose({
  async validate() {
    const arr: any[] = [formRef.value?.validate()]
    if (ruleRef.value.validate) {
      arr.push(ruleRef.value.validate())
    }
    return (await Promise.all(arr)).every(item => !item)
  }
})
</script>
