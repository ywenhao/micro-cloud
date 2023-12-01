<template>
  <a-modal
    :width="480"
    modal-class="vc-modal message-box"
    title-align="start"
    cancel-text="取消"
    :hideCancel="false"
    :simple="false"
    :cancelButtonProps="{ type: 'outline' }"
    ok-text="确定"
    :visible="visible"
    title="加入分组"
    @before-close="handleBeforeClose"
    @before-ok="handleBeforeOk"
    @before-open="handleBeforeOpen"
  >
    <a-form ref="formRef" :model="formState">
      <a-form-item
        hide-asterisk
        label="选择分组"
        validate-trigger="change"
        :rules="[{ required: true, message: ' 请选择分组' }]"
        field="group_id"
      >
        <a-select
          v-model="formState.group_id"
          placeholder="请选择分组"
          :options="groups"
        >
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import {
  type FormInstance,
  Message,
  type SelectOptionData
} from '@arco-design/web-vue'
import { updateUsersGroupApi } from '@vca/apis/pedestal'
const visible = defineModel<boolean>()
const formRef = ref<FormInstance>()
const groups = defineModel<SelectOptionData[]>('groups', { required: true })
const ids = defineModel<string[]>('ids', { required: true })
const emit = defineEmits(['reload'])
const formState = reactive({
  group_id: ''
})

const handleBeforeClose = () => {
  visible.value = false
}
const handleBeforeOk = async () => {
  const validate = await formRef.value?.validate()
  if (validate) return false
  return new Promise<boolean>((resolve, reject) => {
    updateUsersGroupApi({ ids: ids.value, group_id: formState.group_id })
      .then(() => {
        emit('reload')
        Message.success('操作成功')
        resolve(true)
      })
      .catch(() => {
        reject(false)
      })
  })
}
const handleBeforeOpen = () => {
  formState.group_id = ''
}
</script>
