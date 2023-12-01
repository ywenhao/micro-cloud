<template>
  <a-drawer
    v-model:visible="modelValue"
    title="空间备注"
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
    <span class="space-table-sub-title">
      可以为空间添加描述说明，便于区分每个空间的用途。为空则不启用空间备注功能。
    </span>
    <a-textarea
      placeholder="支持中文、大小写英文字母、数字等，不超过100个字符
"
      v-model="remark"
      :rows="5"
      class="mt-4"
      :max-length="100"
      show-word-limit
    />
  </a-drawer>
</template>
<script lang="ts" setup>
import { Message } from '@arco-design/web-vue'
import { updateSpaceRemarkApi } from '@vcp/apis/oss'

interface IEmits {
  (event: 'update'): void
}
const emit = defineEmits<IEmits>()
const modelValue = defineModel<boolean>({ default: false })
const remarkData = defineModel<string>('remark', { default: '' })
const remark = ref('')
const loading = ref(false)
const route = useRoute()

const handleDrawerOpen = () => {
  remark.value = remarkData.value
}
const handleBeforeClose = () => {
  modelValue.value = false
  return false
}
const handleBeforeOk = () => {
  loading.value = true
  return updateSpaceRemarkApi({
    bucket_id: route.params?.id as string,
    remark: remark.value
  })
    .then(() => {
      Message.success('操作成功')
      emit('update')
      modelValue.value = false
    })
    .finally(() => {
      loading.value = false
    })
}
/**保存空间备注 */
</script>
<style lang="less" scoped>
:deep(.arco-textarea) {
  height: 160px !important;
  resize: none !important;
}
</style>
