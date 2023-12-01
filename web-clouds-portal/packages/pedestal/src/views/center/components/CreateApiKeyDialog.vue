<template>
  <vc-dialog
    :title="title"
    :width="400"
    :loading="loading"
    v-model="visible"
    @close="handleClose"
    :on-before-ok="handleSubmit"
  >
    <a-textarea
      v-model="remark"
      :max-length="20"
      :auto-size="{ minRows: 1, maxRows: 3 }"
      placeholder="请输入备注"
    />
  </vc-dialog>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  apiKeyAddApi,
  apiKeyEditApi,
  type AppKeyModel
} from '@vcp/apis/pedestal'

interface IProps {
  record?: AppKeyModel
  modelValue: boolean
}

interface IEmits {
  (event: 'close'): void
  (event: 'submit'): void
}

const loading = ref(false)
const props = defineProps<IProps>()
const emit = defineEmits<IEmits>()

const visible = useVModel(props, 'modelValue')

const title = computed(() =>
  !props.record ? '创建API Key' : '修改API Key备注'
)

const remark = ref('')

watchEffect(() => {
  if (visible.value && props.record) remark.value = props.record.remark!
  else if (!visible.value) remark.value = ''
})

async function handleSubmit() {
  try {
    loading.value = true
    if (props.record) {
      await apiKeyEditApi({ id: props.record.id!, remark: remark.value })
      Message.success('修改成功')
    } else {
      await apiKeyAddApi({ remark: remark.value })
      Message.success('创建成功')
    }
    emit('submit')
    visible.value = false
  } finally {
    loading.value = false
  }
}

function handleClose() {
  emit('close')
}
</script>

<style lang="less" scoped>
:deep(.arco-textarea) {
  resize: none;
}
</style>
