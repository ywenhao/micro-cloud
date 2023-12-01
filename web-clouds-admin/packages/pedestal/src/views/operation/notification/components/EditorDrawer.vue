<template>
  <a-drawer
    v-model:visible="modelValue"
    :title="title"
    :width="600"
    class="is-admin"
    :esc-to-close="false"
    :mask-closable="false"
    :closable="!loading"
    @before-open="handleDrawerOpen"
    @before-cancel="handleBeforeClose"
    destroy-on-close
    cancel-text="取消"
    ok-text="发布"
    @before-ok="handleBeforeOk"
  >
    <a-form ref="formRef" :model="formState" layout="vertical" :rules="rules">
      <a-form-item
        :help="
          typeRef?.isError ? undefined : '用户控制台消息模块展示的消息类型'
        "
        class="mb-10!"
        ref="typeRef"
        field="type_id"
        hide-asterisk
        validate-trigger="change"
        :label-attrs="{
          style: 'display: flex; align-items: center; width: 100%'
        }"
      >
        <template #label>
          <div class="flex items-center flex-1">
            <span>消息类型</span>
            <vc-required-symbol />
            <i class="flex-1"></i>
            <a-dropdown
              popup-container="body"
              v-model:popup-visible="typePopupVisible"
              class="vc-dropdown select-none types-dropdown"
              :hide-on-select="false"
            >
              <a-link :hoverable="false">类型管理</a-link>
              <template #content>
                <message-type
                  :types="types"
                  @reload="handleReloadTypes"
                  @cancel="typePopupVisible = false"
                ></message-type>
              </template>
            </a-dropdown>
          </div>
        </template>
        <a-select
          v-model="formState.type_id"
          class="w-full"
          default-active-first-option
          :options="types"
          placeholder="请选择类型"
          :ref-names="{ value: 'id', label: 'type_name' }"
          :field-names="{ value: 'id', label: 'type_name' }"
          :fallbackOption="
            formState?.id
              ? () => ({
                  id: formState.type_id,
                  type_name: formState.type_name
                })
              : undefined
          "
        >
        </a-select>
      </a-form-item>
      <a-form-item
        asterisk-position="end"
        class="mb-10!"
        label="消息标题"
        :help="
          titleRef?.isError ? undefined : '消息标题在用户控制台，消息列表展示'
        "
        ref="titleRef"
        field="title"
      >
        <a-input
          show-word-limit
          :max-length="100"
          v-model="formState.title"
          placeholder="请输入消息标题"
        ></a-input>
      </a-form-item>
      <a-form-item
        asterisk-position="end"
        class="mb-10!"
        :help="
          contentRef?.isError ? undefined : '消息内容在用户控制台，消息详情展示'
        "
        label="消息内容"
        ref="contentRef"
        field="content"
      >
        <div class="notification-wrapper">
          <vc-rich-text-editor
            ref="richEditorRef"
            v-model="formState.content"
            bordered
            height="300px"
            :max-length="2000"
          ></vc-rich-text-editor>
        </div>
      </a-form-item>
      <a-form-item
        asterisk-position="end"
        class="mb-0!"
        label="发布设置"
        field="release_type"
      >
        <a-radio-group
          :disabled="formState.status == 1"
          direction="vertical"
          v-model="formState.release_type"
        >
          <a-radio class="m-0!" :value="1">立即发布</a-radio>
          <a-radio class="m-0!" :value="2">定时发布</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        asterisk-position="end"
        v-if="formState.release_type === 2"
        class="mb-0!"
        hide-label
        field="release_time"
      >
        <a-date-picker
          :disabled="formState.status == 1"
          showTime
          disabled-input
          v-model="formState.release_time"
          value-format="X"
          :show-now-btn="false"
          :timePickerProps="{ hideDisabledOptions: true, disableConfirm: true }"
          :disabled-date="disabledCurrentAfter.date"
          :disabledTime="disabledCurrentAfter.time"
          placeholder="请选择日期时间"
        />
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
import {
  type FieldRule,
  type FormInstance,
  type FormItemInstance,
  Message
} from '@arco-design/web-vue'
import {
  messageCreateApi,
  messageInfoApi,
  type MessageModel,
  type MessageTypeModel,
  messageUpdateApi
} from '@vca/apis/pedestal'
import { pick } from 'lodash-es'
import { disabledCurrentAfter } from 'vc-material'
import { computed } from 'vue'

import MessageType from './MessageType.vue'
const typePopupVisible = ref(false)
const props = defineProps<{
  types: MessageTypeModel[]
}>()
// const fallbackOption = (value: string | number | Record<string, unknown>) => {
//   return {
//     id: value,
//     type_name: formState.type_name
//   }
// }

const typeRef = ref<FormItemInstance>()
const titleRef = ref<FormItemInstance>()
const contentRef = ref<FormItemInstance>()

watchPostEffect(() => {
  const index = props.types.findIndex(
    item => item.id === formState.value.type_id
  )
  if (index == -1) {
    formState.value.type_id = props.types.length > 0 ? props.types[0].value : ''
  }
})
const modelValue = defineModel<boolean>()
const formState = ref<any>({
  id: '',
  title: '',
  type_id: '',
  release_time: undefined,
  content: '',
  create_account: '',
  read_count: 0,
  created_at: '',
  type_name: '',
  release_type: 1
})
const record = defineModel<Required<MessageModel>>('record', {
  default: undefined
})
const handleReloadTypes = async () => {
  emit('reload-types')
}

const richEditorRef = ref()
const formRef = ref<FormInstance>()
const loading = defineModel<boolean>('loading', { default: false })
const title = computed(() => (record?.value ? '编辑消息' : '新建消息'))
const emit = defineEmits<{
  (event: 'reload'): void
  (event: 'reload-types'): void
}>()

const handleBeforeClose = (): boolean => {
  formRef.value?.resetFields()
  formState!.value!.id = ''
  formState!.value!.content = ''
  formState!.value!.release_type = 1
  formState!.value!.status = undefined
  return true
}

const rules = computed<Record<string, FieldRule[]>>(() => {
  const res: Record<string, FieldRule[]> = {
    title: [{ required: true, message: '请选择消息类型' }],
    type_id: [{ required: true, message: '请选择消息类型' }],
    release_time: [
      {
        required: formState.value.release_type === 2,
        message: '请选择发布时间'
      }
    ],
    content: [
      {
        required: true,
        message: '请输入消息内容',
        validator(_, callback) {
          const text = richEditorRef.value?.instance?.getText()
          callback(!text?.trim() ? '请输入消息内容' : '')
        }
      }
    ],
    created_at: [],
    type_name: [],
    release_type: [{ required: true, message: '请输入消息内容' }]
  }
  return res
})

const handleBeforeOk = async (done: (closed: boolean) => void) => {
  const data = pick(
    {
      ...formState.value,
      release_time:
        formState.value.release_type === 2
          ? formState.value.release_time
          : undefined
    },
    ['id', 'title', 'content', 'type_id', 'release_type', 'release_time']
  )
  const res = await formRef.value?.validate()
  if (res) {
    done(false)
    return
  }
  loading.value = true
  const action = data?.id ? messageUpdateApi : messageCreateApi
  action(data)
    .then(() => {
      Message.success(data?.id ? '修改成功' : '新建成功')
      handleBeforeClose()
      done(true)
      emit('reload')
    })
    .catch(() => done(false))
    .finally(() => {
      loading.value = false
    })
}

const handleDrawerOpen = () => {
  if (record.value?.id) {
    loading.value = true
    messageInfoApi({ message_id: record.value.id! })
      .then(res => {
        console.log(res)
        formState.value = {
          ...formState.value,
          ...(record.value || {})
        }
        formState.value.content = res.content || ''
      })
      .finally(() => {
        loading.value = false
      })
  }
}
</script>
