<template>
  <div class="matching-rules">
    <div class="matching-rules__header">
      <div class="fields">匹配字段</div>
      <div class="operator">运算符</div>
      <div class="value">值</div>
      <div class="actions">操作</div>
    </div>
    <div class="matching-rules__body">
      <matching-group
        v-for="(group, index) in matchingGroups"
        ref="groupRefs"
        :key="group.uuid"
        v-model:rules="group.rules"
        :last="index === matchingGroups.length - 1"
        :disabledAll="disabledAll"
        @delete="matchingGroups.splice(index, 1)"
        @change="handleGroupRuleChange(group.uuid, $event)"
      ></matching-group>
      <div style="padding: 16px 0 0 4px">
        <a-button
          v-if="!disabledAll"
          type="outline"
          @click="handleAddGroup"
          class="and-or"
        >
          <template #icon><icon-plus /></template>
          <span>或者</span>
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import './style.less'

import { IconPlus } from '@arco-design/web-vue/es/icon'
import { useVModel } from '@vueuse/core'
import { generateUUID as uuidV4 } from 'vc-material'

import MatchingGroup from './components/MatchingGroup.vue'
import { matchConfig } from './config'
import type { IMatchingGroup, IMatchingRule } from './types'
import { getFieldConfig, getOperatorTemplate, handleRuleValue } from './utils'

interface IEmit {
  (event: 'update:modelValue', value: IMatchingGroup[]): void
}

interface IProps {
  modelValue: IMatchingGroup[]
  disabledAll?: boolean
}

const emit = defineEmits<IEmit>()
const props = defineProps<IProps>()

const groupRefs = ref<(typeof MatchingGroup)[]>([])
const matchingGroups = useVModel(props, 'modelValue', emit)

/**
 * 组规则改变
 */
function handleGroupRuleChange(uuid: string, rules: IMatchingRule[]) {
  const group = matchingGroups.value.find(item => item.uuid === uuid)
  if (group) {
    group.rules = rules
  }
}

/**
 * 新增组（或者）
 */
function handleAddGroup() {
  matchingGroups.value.push({
    uuid: uuidV4(),
    rules: [
      {
        uuid: uuidV4(),
        field: '',
        operator: '',
        value: ''
      }
    ]
  })
}

/**
 * 生成规则模板数据，外部调用
 */
function generateTemplate() {
  const ruleList: string[] = []

  matchingGroups.value.forEach(group => {
    const groupRules: string[] = []
    group.rules.forEach(item => {
      const config = getFieldConfig(item.field)
      if (!config || !item.operator) {
        return
      }

      const operatorTemplate = getOperatorTemplate(
        config.operatorOptions,
        item.operator
      )
      const value = handleRuleValue(item.operator, item.value)
      if (config.field.valueType === 'boolean') {
        groupRules.push(`${item.value === 2 ? 'not ' : ''}${item.field}`)
      } else {
        groupRules.push(
          operatorTemplate
            .replace('$field', item.field)
            .replace('$value', value)
        )
      }
    })
    ruleList.push(groupRules.join(' and '))
  })

  let template: string = ''
  if (ruleList.length === 1) {
    template = `(${ruleList[0]})`
  } else {
    template = ruleList.map(item => `(${item})`).join(' or ')
  }

  return template
}

/**
 * 重置
 */
function reset() {
  matchingGroups.value = [
    {
      uuid: uuidV4(),
      rules: [
        {
          uuid: uuidV4(),
          field: '',
          operator: '',
          value: ''
        }
      ]
    }
  ]
}

// 验证数据
function validate() {
  return Promise.all(groupRefs.value.map(groupComp => groupComp.validate()))
}

provide('groups', matchingGroups)
provide('matchConfig', matchConfig)

defineExpose({
  generateTemplate,
  reset,
  validate
})
</script>
