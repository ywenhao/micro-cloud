<template>
  <a-drawer
    class="is-admin form-dialog"
    v-model:visible="modelValue"
    :title="title"
    :width="600"
    @open="handleDrawerOpen"
    @before-close="handleBeforeClose"
    :esc-to-close="false"
    :mask-closable="false"
    :closable="!loading"
    cancel-text="取消"
    ok-text="确定"
    @before-ok="handleBeforeOk"
  >
    <a-spin :loading="loading" class="w-full">
      <a-form :rules="rules" ref="formRef" layout="vertical" :model="formState">
        <a-form-item
          validate-trigger="input"
          asterisk-position="end"
          field="title"
          label="公告标题"
        >
          <a-input
            show-word-limit
            :max-length="100"
            v-model="formState.title"
            placeholder="请输入标题"
          ></a-input>
        </a-form-item>
        <a-form-item
          validate-trigger="input"
          asterisk-position="end"
          field="content"
          label="公告内容"
        >
          <!-- http://192.168.2.253:777/view.php?id=9309 -->
          <a-textarea
            v-model="formState.content"
            :auto-size="{
              minRows: 6,
              maxRows: 6
            }"
            show-word-limit
            :max-length="500"
            placeholder="请输入内容"
          />
        </a-form-item>
        <a-form-item
          validate-trigger="input"
          asterisk-position="end"
          field="alert_type"
          class="mb-8!"
          label="弹窗方式"
        >
          <a-radio-group
            class="flex items-start"
            v-model="formState.alert_type"
          >
            <a-radio class="m-0!" :value="1">仅弹窗一次</a-radio>
            <a-radio class="m-0! ml-6!" :value="2">每次弹窗</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          class="mb-0!"
          validate-trigger="input"
          asterisk-position="end"
          field="status"
          hide-label
        >
          <span>状态</span>
          <vc-required-symbol />
          <a-switch
            class="ml-2"
            :checked-value="1"
            :unchecked-value="2"
            v-model="formState.status"
          ></a-switch>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-drawer>
</template>

<script setup lang="ts">
import {
  type FieldRule,
  type FormInstance,
  Message
} from '@arco-design/web-vue'
import {
  announcementCreateApi,
  type AnnouncementModel,
  announcementUpdateApi
} from '@vca/apis/pedestal'
import { pick } from 'lodash-es'
import { computed } from 'vue'

const formRef = ref<FormInstance>()
const modelValue = defineModel()
const record = defineModel<AnnouncementModel>('record', { default: undefined })
const loading = defineModel<boolean>('loading', { default: true })
const emit = defineEmits<{
  (event: 'reload'): void
}>()
const title = computed(() => (record?.value ? '编辑公告' : '新建公告'))

const formState = ref<Required<AnnouncementModel>>({
  id: '',
  title: '',
  content: '',
  create_account: '',
  // 发布状态{1:开启，2：关闭}
  status: 1,
  // 类型{1:只弹一次，2：重复弹窗}
  alert_type: 1,
  read_count: 0,
  created_at: ''
})

const handleDrawerOpen = () => {
  loading.value = true
  formState.value = { ...formState.value, ...(record.value || {}) }
  loading.value = false
}

const handleBeforeClose = (done: any) => {
  formState.value.id = ''
  formRef.value?.resetFields()
  nextTick(done)
}

const rules = computed<Record<string, FieldRule[]>>(() => {
  const res: Record<string, FieldRule[]> = {
    id: [],
    create_account: [],
    read_count: [],
    created_at: [],
    title: [{ required: true, message: '请输入标题' }],
    content: [{ required: true, message: '请输入内容' }],
    alert_type: [{ required: true, message: '请选择弹窗方式' }],
    status: [{ required: true, message: '请选择状态' }]
  }
  return res
})

const handleEditorSubmit = (
  value: Pick<
    Required<AnnouncementModel>,
    'id' | 'title' | 'content' | 'alert_type' | 'status'
  >
) => {
  return new Promise<boolean>((resolve, reject) => {
    loading.value = true
    const action = value?.id ? announcementUpdateApi : announcementCreateApi
    action(value)
      .then(() => {
        Message.success(value?.id ? '修改成功' : '新建成功')
        emit('reload')
        resolve(true)
      })
      .catch(() => reject())
      .finally(() => {
        loading.value = false
      })
  })
}

const handleBeforeOk = (done: (closed: boolean) => void) => {
  formRef.value
    ?.validate()
    .then(res => {
      if (!res) {
        const state = pick(formState.value, [
          'id',
          'title',
          'content',
          'alert_type',
          'status'
        ])
        return handleEditorSubmit(state)
      }
      done(false)
    })
    .then(() => done(true))
    .catch(() => done(false))
}
</script>
