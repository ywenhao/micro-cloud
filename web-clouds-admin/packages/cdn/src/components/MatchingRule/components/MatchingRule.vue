<template>
  <a-form
    ref="formRef"
    layout="inline"
    :model="formData"
    :rules="formRules"
    class="matching-rule"
  >
    <!-- 字段 -->
    <a-form-item
      hide-asterisk
      hide-label
      class="matching-rule__item fields"
      field="field"
    >
      <a-select
        v-model="formData.field"
        :disabled="disabledAll"
        :options="matchConfig"
        placeholder="请选择"
        class="field-select"
      >
        <!-- <a-options
          v-for="item in matchConfig"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></a-options> -->
      </a-select>
    </a-form-item>

    <!-- 运算符 -->
    <a-form-item
      hide-asterisk
      hide-label
      class="matching-rule__item operator"
      field="operator"
    >
      <a-select
        v-model="formData.operator"
        placeholder="请选择"
        :options="fieldOption?.operatorOptions || []"
        :disabled="
          !fieldOption ||
          fieldOption?.field.valueType === 'boolean' ||
          disabledAll
        "
      >
      </a-select>
    </a-form-item>

    <!-- 值 -->
    <a-form-item
      :rules="modelValueRules"
      class="matching-rule__item value"
      hide-asterisk
      hide-label
      field="value"
      required
    >
      <div class="w-full flex items-center min-h-[30px]">
        <template v-if="fieldOption?.field.type === 'select'">
          <!-- 单独判断multiple，用两个select是因为placeholder在动态切换multiple后有不显示的bug -->
          <template v-if="multiple">
            <a-select
              v-model="formData.value"
              :multiple="true"
              :disabled="!fieldOption || !formData.operator || disabledAll"
              filterable
              suffix-icon=""
            >
              <a-option
                v-for="item in valueOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></a-option>
            </a-select>
          </template>
          <template v-else>
            <a-select
              v-model="formData.value"
              :disabled="!fieldOption || !formData.operator || disabledAll"
              filterable
            >
              <a-option
                v-for="item in valueOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></a-option>
            </a-select>
          </template>
        </template>
        <template v-if="!fieldOption || fieldOption.field.type === 'input'">
          <a-input
            v-if="
              (formData.field !== 'ip.src' || !multiple) &&
              typeof formData.value === 'string'
            "
            v-model="formData.value"
            :disabled="!fieldOption || !formData.operator || disabledAll"
            :placeholder="
              fieldOption ? fieldOption?.field.placeholder : '请选择匹配字段'
            "
          ></a-input>
          <a-input-number
            v-else-if="
              (formData.field !== 'ip.src' || !multiple) &&
              typeof formData.value === 'number'
            "
            v-model="formData.value"
            :disabled="!fieldOption || !formData.operator || disabledAll"
            :placeholder="
              fieldOption ? fieldOption?.field.placeholder : '请选择匹配字段'
            "
          ></a-input-number>
          <a-select
            v-else
            v-model="formData.value"
            :disabled="!fieldOption || !formData.operator || disabledAll"
            :placeholder="fieldOption?.field.placeholder"
            multiple
            allow-create
            filterable
            no-data-text="请输入并选择"
            suffix-icon=""
            default-first-option
          >
          </a-select>
        </template>

        <template
          v-if="
            fieldOption?.field.type === 'switch' &&
            !Array.isArray(formData.value)
          "
        >
          <a-switch
            :unchecked-value="2"
            :checked-value="1"
            v-model="formData.value"
            :disabled="disabledAll"
          ></a-switch>
        </template>
      </div>
    </a-form-item>
    <a-form-item
      class="matching-rule__item actions"
      hide-label
      v-if="!disabledAll"
    >
      <a-space>
        <a-button type="outline" v-if="!disableAdd" @click="emit('add')">
          <template #icon><icon-plus /></template>
        </a-button>
        <a-button type="outline" v-if="!disableDelete" @click="emit('delete')">
          <template #icon><icon-close /></template>
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import type { FieldRule, FormInstance } from '@arco-design/web-vue'
import { IconClose, IconPlus } from '@arco-design/web-vue/es/icon'
import type { LabelValue } from 'vc-material'

import type { IMatchConfig, Operator } from '../types'
import { getFieldConfig } from '../utils'

interface IEmit {
  (event: 'add'): void
  (event: 'delete'): void
}

interface IProps {
  disableDelete?: boolean
  disableAdd?: boolean
  disabledAll?: boolean
  rule: {
    field: string
    operator: Operator
    value: string | number | string[] | number[]
  }
}

const emit = defineEmits<IEmit>()
const props = withDefaults(defineProps<IProps>(), {
  disableDelete: false,
  disableAdd: false,
  disabledAll: false
})

/**
 * 字段配置列表
 */
const matchConfig = inject('matchConfig') as IMatchConfig[]

/**
 * 已选择的字段列表
 */
// const selectedFields = inject('selectedFields') as ComputedRef<string[]>

// const field = useVModel(props, 'field', emit)
// const operator = useVModel(props, 'operator', emit)
// const modelValue = useVModel(props, 'value', emit)

const formRef = ref<FormInstance>()

const formData = computed(() => props.rule)

// watch(
//   () => formData.field,
//   () => {
//     console.log(formData.field)
//   }
// )
const formRules = computed<Rules>(() => {
  return {
    field: [{ required: true, message: '请选择匹配字段' }],
    operator: [{ required: true, message: '请选择运算符' }]
  }
})
const modelValueRules = computed<FieldRule[]>(() => {
  const rules: FieldRule[] = [{ required: true, message: '字段必填' }]
  if (!fieldOption.value || !fieldOption.value.field.validator) {
    return rules
  }
  if (multiple.value && fieldOption.value.value !== 'ip.src') {
    return rules
  }
  const validator = fieldOption.value.field.validator
  if (Array.isArray(validator)) {
    rules.push(...validator.map(item => ({ validator: item })))
  } else {
    rules.push({ validator })
  }
  return rules
})

/**
 * 当前所选择的字段配置项
 */
const fieldOption = computed(() => {
  return getFieldConfig(formData.value.field)
})

/**
 * 是否可以多选
 */
const multiple = computed(() => {
  const arr: Operator[] = ['contains', 'not_contains', 'in', 'not_in']
  return arr.includes(formData.value.operator)
})

/**
 * 针对动态select options
 */
const valueOptions = ref<LabelValue[]>([])
watchEffect(() => {
  if (!fieldOption.value) {
    return
  }
  if (typeof fieldOption.value.field.options === 'function') {
    fieldOption.value.field.options().then(res => {
      valueOptions.value = res
    })
  } else {
    valueOptions.value = fieldOption.value.field.options!
  }
})

watch(
  () => formData.value.field,
  () => {
    if (!fieldOption.value) {
      return
    }
    formData.value.value = ''
    formData.value.operator = ''
    // 处理规则值为boolean值的情况，禁用
    if (fieldOption.value.field.valueType === 'boolean') {
      formData.value.value = 2
      formData.value.operator = 'eq'
    }
    nextTick(() => {
      formRef.value?.clearValidate(['operator', 'modelValue'])
    })
  }
)

watch(
  () => formData.value.operator,
  (newVal, oldVal) => {
    // formRef.value?.clearValidate(['modelValue'])
    const single = ['eq', 'ne']
    const multiple = ['contains', 'not_contains']
    if (
      (single.includes(newVal) && single.includes(oldVal)) ||
      (multiple.includes(newVal) && multiple.includes(oldVal))
    ) {
      return
    }
    formData.value.value = ''
  }
)

defineExpose({
  validate() {
    return formRef.value?.validate()
  }
})
</script>
