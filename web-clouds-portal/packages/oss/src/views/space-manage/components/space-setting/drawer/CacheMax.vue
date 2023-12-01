<template>
  <a-drawer
    v-model:visible="modelValue"
    title="文件客户端缓存MaxAge"
    :width="600"
    :esc-to-close="false"
    :mask-closable="false"
    :closable="!loading"
    :ok-loading="loading"
    @before-open="handleDrawerOpen"
    @before-cancel="handleBeforeClose"
    destroy-on-close
    cancel-text="取消"
    ok-text="保存"
    class="vc-drawer"
    @before-ok="handleBeforeOk"
  >
    <a-form class="w-full" ref="formRef" :model="formState">
      <div class="flex flex-row">
        <a-input-number
          v-model="formState.max_age"
          class="time-input w-160px!"
          :min="1"
          :precision="0"
          :max="31536000"
        />
        <a-tag color="gray" class="input-des">秒</a-tag>
      </div>
    </a-form>
  </a-drawer>
</template>
<script lang="ts" setup>
import { Message } from '@arco-design/web-vue'
import { updateSpaceMaxAgeApi } from '@vcp/apis/oss'

const modelValue = defineModel<boolean>({ default: false })
const maxAge = defineModel<number>('maxAge', { required: true, default: 0 })
const id = defineModel<string>('id', { required: true, default: '' })

const emit = defineEmits<{
  (event: 'update'): void
}>()
const loading = ref(false)

const formState = reactive({
  max_age: 0
})
const handleDrawerOpen = () => {
  formState.max_age = maxAge.value
}
const handleBeforeClose = () => {
  modelValue.value = false
  return false
}
const handleBeforeOk = () => {
  loading.value = true
  return updateSpaceMaxAgeApi({
    bucket_id: id.value,
    max_age: formState.max_age
  })
    .then(() => {
      Message.success('操作成功')
      modelValue.value = false
      emit('update')
    })
    .finally(() => {
      loading.value = false
    })
}
</script>
<style lang="less" scoped>
.time-input {
  border-radius: 6px 0 0 6px;
  .arco-input-suffix {
    border-radius: 6px 0 0 6px;
    .arco-input-number-step-button,
    .arco-input-number-step {
      border-radius: 0;
    }
    visibility: hidden;
  }
  &:hover .arco-input-suffix {
    visibility: visible;
  }
}
.input-des {
  width: 38px;
  height: 32px;
  border-radius: 0 6px 6px 0;
  flex-shrink: 0;
}
</style>
