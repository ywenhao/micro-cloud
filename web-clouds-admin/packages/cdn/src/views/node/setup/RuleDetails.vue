<template>
  <a-drawer
    :esc-to-close="false"
    :mask-closable="false"
    :model-value="visible"
    width="600px"
    class="is-admin rule-details"
    v-model:visible="visible"
    title="查看规则"
    hide-cancel
    ok-text="关闭"
    :ok-button-props="{
      type: 'outline'
    }"
    :cancel-button-props="{ type: 'outline' }"
  >
    <a-descriptions bordered class="mb-6" :column="1">
      <a-descriptions-item label="规则名称">
        {{ record?.name || '-' }}
      </a-descriptions-item>
      <a-descriptions-item label="规则名称">
        {{ record?.operation === 0 ? '允许' : '阻止' }}
      </a-descriptions-item>
    </a-descriptions>
    <a-form :model="{}" layout="vertical">
      <a-form-item label="匹配规则">
        <matching-rule
          ref="matchingRef"
          :model-value="ruleGroups"
          disabled-all
        ></matching-rule>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>
<script setup lang="ts">
import type { IMatchingGroup } from '@/components/MatchingRule'
import MatchingRule from '@/components/MatchingRule/MatchingRule.vue'
const visible = defineModel<boolean>()
const record = defineModel<any>('record')

const matchingRef = ref()
const ruleGroups = computed<IMatchingGroup[]>(() => {
  if (!record.value?.id) return []
  try {
    return JSON.parse(record?.value?.expression_template)
  } catch (_) {
    return []
  }
})
</script>

<style lang="less">
.rule-details {
  .arco-descriptions-item-label-block {
    background: #fff !important;
  }

  .arco-form-item-content {
    * {
      color: var(--color-text-2) !important;
      -webkit-text-fill-color: var(--color-text-2) !important;
    }
    .arco-input {
      color: var(--color-text-2) !important;
      -webkit-text-fill-color: var(--color-text-2) !important;
    }
  }
}
</style>
