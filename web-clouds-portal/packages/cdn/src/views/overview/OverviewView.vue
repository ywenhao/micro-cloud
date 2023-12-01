<script setup lang="ts">
import CommonConfCard from './components/CommonConfCard.vue'
import OverviewCard from './components/OverviewCard.vue'
import TodayTrends from './components/TodayTrends.vue'
</script>

<template>
  <div class="flex flex-col gap-y-6">
    <div class="grid grid-cols-2 gap-x-4">
      <common-conf-card></common-conf-card>
      <overview-card></overview-card>
    </div>
    <today-trends></today-trends>
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
