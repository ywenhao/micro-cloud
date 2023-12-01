<template>
  <div class="des-box">
    <vc-text-ell class="des-text">{{ emptyText(content) }}</vc-text-ell>
    <edit-icon class="cell-hide edit-icon" @click="visible = true" />
  </div>
  <vc-dialog
    v-model="visible"
    title="编辑版本说明"
    :loading="loading"
    popupContainer="#app"
    :on-before-ok="handleSubmit"
  >
    <a-textarea
      class="version-input"
      v-model="value"
      placeholder="请输入版本说明"
      :maxLength="200"
      showWordLimit
    />
  </vc-dialog>
</template>

<script setup lang="ts">
import { emptyText } from 'vc-material'
import { ref, watch } from 'vue'

import EditIcon from './icon/EditIcon.vue'

const props = defineProps<{
  content: string
  maxLength?: number
  onSubmit: (e: string) => Promise<void>
}>()

const loading = ref(false)
const visible = ref(false)
const value = ref(props.content)

watch(
  () => props.content,
  val => {
    value.value = val
  }
)

watch(visible, val => {
  if (val) value.value = props.content
})

async function handleSubmit() {
  loading.value = true
  try {
    await props.onSubmit(value.value.trim())
    visible.value = false
  } finally {
    loading.value = false
  }
}
</script>

<style lang="less" scoped>
.des-box {
  display: flex;
  align-items: center;
  :deep(.des-text) {
    max-width: max-content;
    font-size: 14px;
    color: var(--color-text-1);
    font-weight: 400;
    flex: initial;
  }
}

.edit-icon {
  margin-left: 4px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.version-input {
  :deep(.arco-textarea) {
    width: 100%;
    height: 72px;
    min-height: 72px;
    max-height: 130px;
  }
}
</style>
