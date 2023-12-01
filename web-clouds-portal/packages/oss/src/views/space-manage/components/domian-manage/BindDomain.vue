<template>
  <a-modal
    :width="480"
    modal-class="vc-modal message-box form-dialog"
    title-align="start"
    cancel-text="取消"
    :hideCancel="false"
    :simple="false"
    :ok-loading="loading"
    :cancelButtonProps="{ type: 'outline' }"
    ok-text="确定"
    v-model:visible="visible"
    title="绑定域名"
    @before-close="handleBeforeClose"
    @before-ok="handleBeforeOk"
  >
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item class="http-switch-item">
        <span class="text-[#86909C]">当前空间：{{ spaceName }}</span>
      </a-form-item>
      <a-form-item
        class="mb-0!"
        label="域名"
        field="name"
        asterisk-position="end"
      >
        <a-input v-model="formState.name" placeholder="请输入域名" />
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
import { addSpaceDomain } from '@vcp/apis/oss'
import { domainReg, domainSplitReg } from 'vc-material'
import { useRoute } from 'vue-router'

withDefaults(defineProps<{ spaceName: string }>(), {
  spaceName: ''
})

const route = useRoute()

const loading = ref(false)
const visible = defineModel<boolean>()
const formRef = ref<FormInstance>()
const formState = reactive({
  name: ''
})

const emit = defineEmits<{
  (event: 'reload'): void
}>()

const rules = computed<Record<string, FieldRule[]>>(() => {
  const res: Record<string, FieldRule[]> = {
    name: [
      { required: true, message: '请输入域名' },
      {
        validator(value: string, callback) {
          if (value.length > 253) {
            return callback('域名总长度不能超过253个字符')
          }

          if (value.includes('.')) {
            const split = value.split('.').filter(item => item) as string[]

            for (const item of split) {
              if (!domainSplitReg.test(item)) {
                return callback(
                  '每一级域名为字母、数字、“-”、“_”的组合且长度不能超过63字符'
                )
              }
            }
          }

          if (!domainReg.test(value)) {
            return callback('域名格式错误')
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
    addSpaceDomain({
      ...formState,
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
