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
    title="设置用户空间调度域名"
    @before-close="handleBeforeClose"
    @before-ok="handleBeforeOk"
    @before-open="handleBeforeOpen"
  >
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item
        class="mb-0!"
        label="选择域名"
        field="ns_id"
        asterisk-position="end"
      >
        <a-select
          v-model="formState.ns_id"
          placeholder="请选择域名"
          :options="options"
          :field-names="{ value: 'id', label: 'name' }"
        ></a-select>
        <template #extra
          >从DNS添加给OSS作用于用户空间的系统域名里，选择1个域名作为用户空间域名修改用户空间调度域名，会重新给用户的外链域名生成CNAME，这会导致所有用户现有的外链域名失效，直到重新添加CNAME记录，请谨慎操作，若非必要请不要修改用户空间调度域名。</template
        >
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
import {
  addDomainApi,
  chainDomainListApi,
  type UserDomainModel
} from '@vca/apis/oss'

withDefaults(defineProps<{ spaceName?: string }>(), {
  spaceName: ''
})

const loading = ref(false)
const visible = defineModel<boolean>()
const formRef = ref<FormInstance>()
const formState = reactive({
  ns_id: ''
})

const emit = defineEmits<{
  (event: 'reload'): void
}>()

const record = defineModel<UserDomainModel>('record')

const rules = computed<Record<string, FieldRule[]>>(() => {
  const res: Record<string, FieldRule[]> = {
    ns_id: [{ required: true, message: '请选择域名' }]
  }
  return res
})

const options = ref()

const handleBeforeOpen = async () => {
  const { list } = await chainDomainListApi({
    sub_product_type: 2,
    usage_type: 3,
    usage_status: 1
  })
  options.value = list
  if (record.value) {
    options.value.unshift(record.value)
    formState.ns_id = record.value?.id || ''
  }
}

const handleBeforeClose = () => {
  formRef.value?.resetFields()
  visible.value = false
}

const handleEditorSubmit = () => {
  return new Promise<boolean>((resolve, reject) => {
    loading.value = true
    addDomainApi({
      domain_id: formState.ns_id,
      // @ts-ignore
      id: '0'
    })
      .then(() => {
        Message.success('设置成功')
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
