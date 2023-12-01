<script setup lang="ts">
import TabCard from './components/TabCard.vue'
</script>

<template>
  <div class="flex flex-col gap-y-6 rounded-[12px]">
    <tab-card />
  </div>
</template>

<style scoped lang="less">
:deep(.el-descriptions__header) {
  @apply mb-2;
}
:deep(.el-descriptions__cell) {
  @apply pb-0;
}
</style>
