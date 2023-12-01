<script setup lang="ts">
import AssetOverview from './components/AssetOverview.vue'
import DataTrends from './components/DataTrends.vue'
import ResourceAlarm from './components/ResourceAlarm.vue'
import UserInfoCard from './components/UserInfoCard.vue'
</script>

<template>
  <div class="flex flex-col gap-y-6">
    <user-info-card />
    <asset-overview />
    <div class="flex items-center gap-4">
      <data-trends class="w-5/9" />
      <resource-alarm class="w-4/9" />
    </div>
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
