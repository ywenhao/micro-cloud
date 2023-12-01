<template>
  <a-form-item
    class="rrs-main form-main-title"
    field="rrsMain"
    hide-asterisk
    :label="label"
    :rules="rrsMainRule"
    :label-col-style="{ marginBottom: '16px' }"
    content-class="flex-col"
  >
    <form-table rule-prop="rrs" :rule="rrsRule" :data="state.rrs">
      <template #default="{ row, $index }">
        <form-table-column prop="name" label="主机记录" width="18%">
          <a-input
            v-model="row.name"
            :class="getErrorClass($index, 'name') || `no-need-error`"
            placeholder="请输入主机记录"
          />
        </form-table-column>
        <form-table-column prop="type" label="记录类型" width="30%">
          <a-select
            v-model="row.type"
            class="w-full no-need-error"
            placeholder="请选择记录类型"
          >
            <a-option
              v-for="item in logOpts"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </a-select>
        </form-table-column>
        <form-table-column prop="value" label="记录值" width="30%">
          <a-input
            v-model="row.value"
            :disabled="isDisabledValue"
            :class="getErrorClass($index, 'value')"
            :placeholder="getValuePlaceHolder(row.type)"
          />
        </form-table-column>
        <form-table-column prop="TTL" label="TTL" class="flex-1">
          <a-select v-model="row.ttl" class="w-full no-need-error">
            <a-option
              v-for="item in ttlOpts"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </a-select>
        </form-table-column>
        <form-table-column prop="action" label="操作" width="48px">
          <a-button
            :disabled="!$index && state.rrs.length <= 1"
            type="outline"
            @click="state.rrs.splice($index, 1)"
          >
            <template #icon><icon-close /></template>
          </a-button>
        </form-table-column>
      </template>
    </form-table>
    <div class="add-btn-box">
      <a-button type="outline" @click="state.rrs.push(initMoreItem())">
        <template #icon>
          <icon-plus />
        </template>
        添加一行
      </a-button>
    </div>
  </a-form-item>
</template>

<script setup lang="ts">
import type { FieldRule, FormInstance } from '@arco-design/web-vue'
import { IconClose } from '@arco-design/web-vue/es/icon'
import { IconPlus } from '@arco-design/web-vue/es/icon'
import type { RrsItem } from '@vcp/apis/dns'
import {
  getValuePlaceHolder,
  hostValidate,
  logOpts,
  logValueValidate,
  ttlOpts
} from 'vc-material'
import type { Ref } from 'vue'

import FormTable from './FormTable/FormTable.vue'
import FormTableColumn from './FormTable/FormTableColumn.vue'

interface IProps {
  label?: string
  isDisabledValue?: boolean
  formState: {
    domains?: string
    rrs: RrsItem[]
  }
}

const props = withDefaults(defineProps<IProps>(), {
  label: '记录'
})
const state = computed(() => props.formState)

const formRef = inject('formRef', ref()) as Ref<FormInstance>

type ChildError = {
  index: number
  key: string
}

const childError = inject('childError', ref([])) as Ref<ChildError[]>

const addChildError = (index: number, key: string) => {
  if (childError.value.some(v => v.index === index && v.key === key)) return
  childError.value.push({ index, key })
}

const delChildError = (index: number, key: string) => {
  const delIdx = childError.value.findIndex(
    v => v.index === index && v.key === key
  )
  delIdx > -1 && childError.value.splice(delIdx, 1)
}

const getErrorClass = (index: number, key: string) => {
  return childError.value.some(v => v.index === index && v.key === key)
    ? 'is-child-error'
    : ''
}

const validatorFn = (
  validator: any,
  value: string,
  callback: ValidateCallback
) => validator(value, callback)

const rrsRule: FieldRule = {
  // 服务器IP、CDN域名、邮件服务域名
  validator(value: RrsItem, callback) {
    formRef.value?.clearValidate('rrsMain')
    const index = state.value.rrs.findIndex(v => v === value)
    let flag: boolean | Error = true

    // 主机记录
    if (value.name) {
      flag = validatorFn(
        hostValidate(() => state.value?.domains ?? ''),
        value.name!,
        callback
      )
      if (flag !== true) {
        delChildError(index, 'value')
        addChildError(index, 'name')
        return flag
      }
    }

    if (!props.isDisabledValue) {
      if (!value.name && value.type === 'NS') {
        delChildError(index, 'value')
        addChildError(index, 'name')
        return callback('请输入主机记录')
      }

      // 记录值
      if (!!value.name && !value.value) {
        delChildError(index, 'name')
        addChildError(index, 'value')
        return callback('请输入记录值')
      }

      if (value.value) {
        flag = validatorFn(
          logValueValidate(() => value.type!),
          value.value!,
          callback
        )

        if (flag !== true) {
          delChildError(index, 'name')
          addChildError(index, 'value')
          return flag
        }
      }
    }

    delChildError(index, 'name')
    delChildError(index, 'value')
    return flag
  }
}

const initMoreItem = (): RrsItem => ({
  name: '',
  value: '',
  type: 'A',
  ttl: 600
})

const rrsMainRule: FieldRule[] = [
  {
    required: true,
    validator: (value, callback) => {
      const rrs = state.value.rrs

      if (rrs.length) {
        // 整体部分
        if (!rrs.some(v => v.value)) {
          childError.value = []
          return callback('请填写解析记录')
        }
      }
      return true
    }
  }
]

// 保证至少有一行
watchEffect(() => {
  if (!state.value.rrs.length) {
    state.value.rrs.push(initMoreItem())
  }
})
</script>

<style lang="less">
.rrs-main.arco-form-item {
  margin-bottom: 0;
  --custom-error-color: var(--danger-6);
  --a-border-color: 229, 230, 235;
  &.arco-form-item-error {
    margin-bottom: -20px;
    .form-table__tr.arco-form-item-error {
      .form-table__td {
        --danger-6: var(--custom-error-color);
      }
    }
    .no-need-error {
      --danger-6: var(--a-border-color);
    }
  }
  .form-table__tr.arco-form-item-error {
    .form-table__td {
      --danger-6: var(--a-border-color);
    }
    .is-child-error {
      --danger-6: var(--custom-error-color);
    }
  }
  .a-button--danger {
    --danger-6: var(--custom-error-color);
  }

  .arco-input-error.arco-input-disabled {
    background-color: var(--color-fill-2);
    &:hover {
      background-color: var(--color-fill-2);
    }
  }
  .arco-link.arco-link-status-danger {
    --danger-6: var(--custom-error-color);
  }

  .add-btn-box {
    display: flex;
    align-items: center;
    padding: 0 0 16px 16px;
    width: 100%;
    border: 1px solid var(--color-border-1);
    user-select: none;
    border-top: none;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    .arco-btn {
      .arco-btn-icon {
        margin-right: 2px;
      }
    }
  }
}
</style>
