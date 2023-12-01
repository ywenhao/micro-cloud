<script setup lang="ts">
import TabCard from './components/TabCard.vue'
import TaskCard from './components/TaskCard.vue'
</script>

<template>
  <div class="flex flex-col gap-y-6">
    <task-card />
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
