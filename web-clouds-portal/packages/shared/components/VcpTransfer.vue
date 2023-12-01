<template>
  <a-spin :loading="loading">
    <a-transfer
      ref="transferRef"
      show-search
      :title="title"
      v-model="value"
      :data="data"
    >
    </a-transfer>
  </a-spin>
</template>

<script setup lang="ts">
import type { TransferInstance } from '@arco-design/web-vue'
import type { TransferItem } from '@arco-design/web-vue/es/transfer/interface'

const props = defineProps<{
  title: [string, string]
  modelValue: string[]
  request: (...args: any[]) => Promise<TransferItem[]>
}>()

defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const transferRef = ref<TransferInstance>()
const loading = ref(false)
const value = useVModel(props, 'modelValue')
const data = ref<TransferItem[]>([])

async function getData(params?: Record<string, any>) {
  loading.value = true
  try {
    const res = await props.request(params)
    data.value = res
  } finally {
    loading.value = false
  }
}

getData()

function setPlaceholder() {
  const el = transferRef.value?.$el! as HTMLDivElement
  const inputsDoms = el.querySelectorAll('.arco-transfer-view-search input')
  Array.from(inputsDoms).forEach(input => {
    input.setAttribute('placeholder', '请输入')
  })
}

onMounted(() => {
  setPlaceholder()
})

defineExpose({ getData })
</script>

<style scoped lang="less">
.arco-transfer {
  justify-content: space-between;
  :deep(.arco-transfer-view) {
    width: 235px;
    height: 260px;
    border-radius: 4px;
    .arco-transfer-view-header {
      line-height: 38px;
      height: 38px;
    }
    .arco-input-wrapper {
      background: var(--color-fill-1);
      border-color: transparent;
      border-radius: 2px;
      &.arco-input-focus {
        border-color: rgb(var(--primary-6));
      }
      .arco-icon-hover {
        color: var(--color-border-4);
      }
    }
  }
  :deep(.arco-transfer-operations) {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    width: 70px;
    flex-direction: column;
    .arco-btn {
      margin-left: 0;
      color: rgb(var(--primary-6));
      &:not(.arco-btn-disabled):hover {
        background-color: rgb(var(--primary-1));
      }
      &.arco-btn-disabled {
        color: #d9d9d9;
      }
    }
  }
}
</style>
