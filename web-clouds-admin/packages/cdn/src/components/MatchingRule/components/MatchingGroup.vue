<template>
  <div class="matching-group">
    <div class="matching-group__container">
      <matching-rule
        v-for="(rule, index) in rules"
        ref="matchingRuleRefs"
        :key="rule.uuid"
        :rule="rule"
        :disable-delete="groups.length === 1 && rules.length === 1"
        :disabledAll="disabledAll"
        @add="handleAddRule"
        @delete="handleDeleteRule(index)"
      ></matching-rule>
    </div>
    <div v-if="!last" class="or-hr"></div>
  </div>
</template>

<script setup lang="ts">
import { generateUUID as uuidV4 } from 'vc-material'

import type { IMatchingGroup, IMatchingRule } from '../types'
import MatchingRule from './MatchingRule.vue'

interface IEmit {
  (event: 'update:rules', value: IMatchingRule[]): void
  (event: 'change', value: IMatchingRule[]): void
  (event: 'delete'): void
}

interface IProps {
  last?: boolean
  rules: IMatchingRule[]
  disabledAll?: boolean
}

const emit = defineEmits<IEmit>()
const props = withDefaults(defineProps<IProps>(), {
  last: false,
  disabledAll: false
})

const matchingRuleRefs = ref<InstanceType<typeof MatchingRule>[]>([])

// const matchConfig = inject('matchConfig') as IMatchConfig[]

/**
 * 组列表
 */
const groups = inject('groups') as IMatchingGroup[]

/**
 * 此组的规则列表
 */
const rules = useVModel(props, 'rules', emit)

/**
 * 此组已选择的字段列表
 */
const selectedFields = computed(() => {
  return rules.value.map(rule => rule.field)
})

/**
 * 添加规则，每个字段仅能出现一次
 */
function handleAddRule() {
  // const fields = matchConfig.map(item => item.value)
  rules.value.push({
    uuid: uuidV4(),
    field: '',
    operator: '',
    value: ''
  })
  // const field = fields.find(id => {
  //   return !selectedFields.value.includes(id)
  // })
  // if (field) {
  //   const isSwitch = getFieldConfig(field).field.type === 'switch'
  //   rules.value.push({
  //     uuid: uuidV4(),
  //     field,
  //     operator: 'eq',
  //     value: isSwitch ? 2 : ''
  //   })
  // }
}

/**
 * 删除规则，如果此组只有一个规则了，则直接删除该组
 */
function handleDeleteRule(index: number) {
  if (rules.value.length > 1) {
    rules.value.splice(index, 1)
    return
  }
  emit('delete')
}

provide('selectedFields', selectedFields)

defineExpose({
  validate() {
    return Promise.all(
      matchingRuleRefs.value.map(ruleComp => ruleComp.validate())
    )
  }
})
</script>
