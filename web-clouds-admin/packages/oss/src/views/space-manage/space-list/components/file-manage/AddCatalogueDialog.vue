<template>
  <a-modal
    :width="480"
    modal-class="vc-modal message-box"
    title-align="start"
    cancel-text="取消"
    :hideCancel="false"
    :simple="false"
    :ok-loading="loading"
    :ok-button-props="{ disabled: !formState.key }"
    :cancelButtonProps="{ type: 'outline' }"
    ok-text="确定"
    v-model:visible="visible"
    title="创建目录"
    @before-close="handleBeforeClose"
    @before-ok="handleBeforeOk"
  >
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item
        class="mb-0!"
        label="目录名"
        field="key"
        asterisk-position="end"
        validate-trigger="input"
        :hide-asterisk="true"
      >
        <a-input
          v-model.trim="formState.key"
          placeholder="请输入目录"
          :max-length="254"
        />
        <template #help>
          <span
            >不支持仅由英文句号
            <span class="color-ct-2 font-500">.</span> 组成的名称； 不支持以
            <span class="color-ct-2 font-500">/</span> 开头，不能包含连续的
            <span class="color-ct-2 font-500">/</span>。</span
          >
        </template>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {
  type FieldRule,
  type FormInstance,
  Message
} from '@arco-design/web-vue'
import { addCatalogApi } from '@vca/apis/oss'
import { useRoute } from 'vue-router'

withDefaults(defineProps<{ spaceName?: string }>(), {
  spaceName: ''
})

const route = useRoute()

const loading = ref(false)

const catalogUrl = defineModel<string>('catalogUrl', {
  required: true
})
const visible = defineModel<boolean>()
const formRef = ref<FormInstance>()
const formState = reactive({
  key: ''
})

const emit = defineEmits<{
  (event: 'reload'): void
}>()

const rules = computed<Record<string, FieldRule[]>>(() => {
  const res: Record<string, FieldRule[]> = {
    key: [
      {
        required: true,
        validator(value, callback) {
          if (!value) {
            return callback('请输入目录')
          }
          if (value === '.' || value.startsWith('/') || value.includes('//')) {
            return callback('请输入正确的目录')
          }
          return true
        }
      }
    ]
  }
  return res
})

const handleBeforeClose = () => {
  formRef.value?.resetFields()
  visible.value = false
}

const handleEditorSubmit = () => {
  return new Promise<boolean>((resolve, reject) => {
    loading.value = true
    addCatalogApi({
      ...formState,
      key: catalogUrl.value.concat(formState.key),
      bucket_id: route.params?.id as string
    })
      .then(() => {
        Message.success('添加成功')
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
        return handleEditorSubmit()
      }
      done(false)
    })
    .then(() => done(true))
    .catch(() => done(false))
}
</script>

<style scoped lang="less">
:deep(.http-switch-item) {
  .arco-form-item-label-col {
    @apply mb-0!;
  }
  .arco-form-item-wrapper-col {
    min-height: 22px;
  }
}
</style>
