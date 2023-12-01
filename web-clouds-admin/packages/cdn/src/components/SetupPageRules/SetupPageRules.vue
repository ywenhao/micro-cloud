<template>
  <div class="setup-page-rules">
    <header class="setup-page-rules__header">
      <div class="field-match">匹配字段</div>
      <div class="field-value">值</div>
      <div class="field-action">操作</div>
    </header>
    <main class="setup-page-rules__main">
      <rule-config
        v-for="(rule, index) in configs"
        :key="rule.uuid"
        ref="ruleConfigRefs"
        v-model:type="rule.type"
        v-model:value="rule.value"
        :form-configs="configs"
        :disable-delete="configs.length === 1"
        @delete="configs.splice(index, 1)"
      ></rule-config>
    </main>
    <footer class="setup-page-rules__footer">
      <a-button @click="handleAdd" type="outline">
        <template #icon><icon-plus /></template>
        添加
      </a-button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import './style.less'

import { IconPlus } from '@arco-design/web-vue/es/icon'
import type { PageRuleModel } from '@vca/apis/cdn'

const ruleConfigRefs = ref<FormInstance[]>([])
import type { FormInstance } from '@arco-design/web-vue'

import { useFormState } from './hooks/useFormState'
import RuleConfig from './RuleConfig/RuleConfig.vue'

const config = defineModel<PageRuleModel>('config', { required: true })
const { configs, handleAdd, selectedRuleTypes, generateRule } =
  useFormState(config)
provide('selectedRuleTypes', selectedRuleTypes)

defineExpose({
  async validate() {
    const res = await Promise.all(
      ruleConfigRefs.value.map(item => item.validate())
    )
    return res.every(item => item) ? undefined : new Error('验证不通过')
  },
  generateRule
})
</script>
