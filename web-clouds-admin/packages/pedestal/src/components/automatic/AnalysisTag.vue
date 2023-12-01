<template>
  <a-tag
    class="overview-tag"
    :class="value >= 0 ? 'is-danger' : 'is-success'"
    bordered
  >
    <template #icon>
      <icon-arrow-up v-if="value >= 0" class="text-danger!" />
      <icon-arrow-down v-else class="text-success!" />
    </template>
    {{ valueText }}%
  </a-tag>
</template>

<script setup lang="ts">
import { IconArrowDown, IconArrowUp } from '@arco-design/web-vue/es/icon'
const modelValue = defineModel<number | string>()
const value = computed(() => Number(modelValue.value ?? 0))
const valueText = computed(() => {
  if (!modelValue.value) return 0
  const res =
    Number(modelValue.value ?? 0) >= 0
      ? `+ ${modelValue.value}`
      : modelValue.value
  return res || 0
})
</script>

<style scoped lang="less">
.overview-tag {
  @apply min-h-18px! bg-transparent! text-xs!;
  &.is-success {
    @apply border-success!;
  }
  &.is-danger {
    @apply border-danger!;
  }
}
</style>
