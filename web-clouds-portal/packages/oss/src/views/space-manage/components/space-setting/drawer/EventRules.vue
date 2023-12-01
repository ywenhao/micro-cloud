<template>
  <a-drawer
    v-model:visible="modelValue"
    :title="title"
    :width="600"
    :esc-to-close="false"
    :mask-closable="false"
    :closable="!loading"
    @before-open="handleDrawerOpen"
    @before-cancel="handleBeforeClose"
    destroy-on-close
    cancel-text="取消"
    :ok-text="onText"
    class="vc-drawer"
    @before-ok="handleBeforeOk"
  >
    <a-form ref="formRef" :model="formState" layout="vertical" :rules="rules">
      <a-form-item
        field="name"
        label="规则名称"
        asterisk-position="end"
        validate-trigger="input"
        class="mb-8!"
      >
        <a-input
          v-model.trim="formState.name"
          placeholder="请输入名称"
          :max-length="20"
          show-word-limit
        />
      </a-form-item>
      <a-form-item
        field="tacticsRadio"
        asterisk-position="end"
        validate-trigger="change"
        label="规则策略"
        class="mb-8! radio-item-tactics"
      >
        <div class="flex flex-col flex-1">
          <a-radio-group
            v-model="formState.tacticsRadio"
            @change="handleChange"
          >
            <a-radio :value="0" class="mr-6!">对整个空间生效</a-radio>
            <a-radio :value="1">对前缀生效</a-radio>
            <a-radio :value="2">对后缀生效</a-radio>
          </a-radio-group>
          <a-input
            v-if="formState.tacticsRadio !== 0"
            v-model="formState.content"
            :placeholder="
              formState.tacticsRadio === 1 ? '请输入前缀' : '请输入后缀'
            "
            class="mt-2"
          />
        </div>
      </a-form-item>
      <a-form-item
        field="events"
        label="事件"
        asterisk-position="end"
        validate-trigger="change"
        class="mb-8!"
      >
        <a-select
          v-model="formState.events"
          :options="EVENT_LIST_DATA"
          placeholder="请选择事件"
        >
        </a-select>
      </a-form-item>
      <a-form-item
        label="回调地址"
        field="callback_urls"
        class="callback-url-item"
        asterisk-position="end"
        validate-trigger="change"
      >
        <template #label>
          <div class="flex items-center justify-between">
            <span>回调地址</span>
            <a-button
              type="text"
              class="absolute top-0 right-0"
              :disabled="formState.callback_urls.length >= 5"
              @click="handleAdd"
              ><template #icon> <icon-plus /> </template>添加</a-button
            >
          </div>
        </template>
        <div class="flex flex-col flex-1">
          <a-form-item
            v-for="(url, index) of formState.callback_urls"
            :field="`callback_urls[${index}]`"
            :hide-asterisk="true"
            :key="index"
            :rules="[{ required: true, validator: handleValidUlr }]"
            validate-trigger="change"
            class="mb-1! flex-1 url-item"
          >
            <a-input
              v-model.trim="formState.callback_urls[index]"
              class="flex-1"
              placeholder="请输入回调地址：http(s)://test.com"
            />
            <a-button
              @click="handleDelete(index)"
              class="ml-1 w-8 bg-white! url-delete-btn"
            >
              <template #icon>
                <vc-svg-icon
                  prefix="oss"
                  name="icon_delete"
                ></vc-svg-icon> </template
            ></a-button>
          </a-form-item>
        </div>

        <template #extra>
          <span>可设置多个回调用于失败后依次尝试</span>
        </template>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
import {
  type FieldRule,
  type FormInstance,
  Message
} from '@arco-design/web-vue'
import { IconPlus } from '@arco-design/web-vue/es/icon'
import { addEventApi, editEventApi, type EventListModel } from '@vcp/apis/oss'
import { useRoute } from 'vue-router'

import { EVENT_LIST_DATA } from '@/components/SelectData'

const record = defineModel<any>('record')

const list = defineModel<EventListModel[]>('list', { required: true })
const modelValue = defineModel<boolean>()
const loading = defineModel<boolean>('loading', { default: false })
const formRef = ref<FormInstance>()

const route = useRoute()

const formState = ref<any>({
  id: undefined,
  name: '',
  tacticsRadio: 0,
  prefix: undefined,
  suffix: undefined,
  content: '',
  events: undefined,
  callback_urls: ['']
})

const emit = defineEmits<{
  (event: 'reload'): void
}>()

const title = computed(() =>
  record?.value ? '编辑事件通知规则' : '创建事件通知规则'
)
const onText = computed(() => (record?.value ? '保存' : '创建'))

const rules = computed<Record<string, FieldRule[]>>(() => {
  const res: Record<string, FieldRule[]> = {
    name: [
      {
        required: true,
        validator(value, callback) {
          const reg = /^[A-Za-z0-9_]{1,20}$/
          if (!value) {
            return callback('请输入名称')
          }
          if (!reg.test(value)) {
            return callback('请输入字符，可包含英文字母、数字、下划线')
          }
          const isShowName = list.value.some(({ name }) => name === value)
          if (!record.value?.id && isShowName) {
            return callback('事件规则名称已存在')
          }

          return callback()
        }
      }
    ],
    tacticsRadio: [{ required: true, message: '请选择' }],
    callback_urls: [{ required: true, message: '请添加回调地址' }],
    events: [{ required: true, message: '请选择' }]
  }
  return res
})

const handleValidUlr = (value: any, callback: any) => {
  const reg =
    /^((https|http)?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i
  if (!value) {
    return callback('请输入回调地址')
  }
  if (!reg.test(value)) {
    return callback('回调地址格式不正确')
  }
  return callback()
}

const handleChange = () => {
  formState.value.content = ''
}

const handleAdd = () => {
  formState.value.callback_urls.push('')
}

const handleDelete = (index: number) => {
  formState.value.callback_urls.splice(index, 1)
}

const handleEditorSubmit = () => {
  return new Promise<boolean>((resolve, reject) => {
    const { tacticsRadio, content } = formState.value
    if (tacticsRadio === 0) {
      formState.value.prefix = undefined
      formState.value.suffix = undefined
    } else {
      tacticsRadio === 1
        ? (formState.value.prefix = content)
        : (formState.value.suffix = content)
    }
    loading.value = true
    const obj_data = {
      bucket_id: route.params.id as string,
      rule: {
        ...formState.value,
        tacticsRadio: undefined,
        content: undefined,
        events: [formState.value.events]
      }
    }
    const action = formState.value?.id ? editEventApi : addEventApi
    action(obj_data)
      .then(() => {
        Message.success(formState.value?.id ? '修改成功' : '添加成功')
        emit('reload')
        loading.value = false
        resolve(true)
      })
      .catch(() => {
        reject(false)
      })
  })
}

const handleBeforeOk = async () => {
  const validate = await formRef.value?.validate()
  if (validate) return false
  return handleEditorSubmit()
}

const handleBeforeClose = () => {
  formState.value.callback_urls = ['']
  modelValue.value = false
  return false
}

const handleDrawerOpen = () => {
  if (record.value?.id) {
    formState.value.id = record.value?.id
    formState.value.name = record.value?.name
    formState.value.events = record.value.events[0]
    formState.value.callback_urls = record.value.callback_urls
    if (!(record.value?.prefix || record.value?.suffix)) {
      formState.value.tacticsRadio = 0
    } else {
      record.value?.prefix
        ? (formState.value.tacticsRadio = 1)
        : (formState.value.tacticsRadio = 2)
      formState.value.content = record.value?.prefix || record.value?.suffix
    }
  } else {
    formState.value = { ...formState.value }
    formState.value.callback_urls = ['']
  }
}

watchEffect(() => {
  if (!modelValue.value) {
    formRef.value?.resetFields()
  }
})
</script>

<style scoped lang="less">
:deep(.radio-item-tactics) {
  .arco-form-item-wrapper-col,
  .arco-form-item-content {
    min-height: 20px !important;
  }
}
.callback-url-item {
  :deep(.arco-form-item-label) {
    @apply w-full relative;
  }
  :deep(.arco-form-item-label-required-symbol) {
    @apply absolute;
    top: 9px;
    left: 56px;
  }
  :deep(.url-item) {
    .arco-form-item-label-col {
      @apply mb-0!;
    }
  }
}
.url-delete-btn {
  border: 1px solid #e5e6eb;
  &:hover {
    border: 1px solid #e5e6eb;
  }
}
</style>
