<template>
  <div class="overview-page">
    <user-info-card />
    <asset-overview />
    <div class="grid grid-cols-3 gap-4">
      <div class="col-span-2">
        <data-trends />
      </div>
      <div class="flex flex-col">
        <resource-alarm />
        <newbie-guide />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AssetOverview from './components/AssetOverview.vue'
import DataTrends from './components/DataTrends.vue'
import NewbieGuide from './components/NewbieGuide.vue'
import ResourceAlarm from './components/ResourceAlarm.vue'
import UserInfoCard from './components/UserInfoCard.vue'
</script>

<style lang="less" scoped>
.overview-page {
  @apply flex flex-col gap-y-4 h-full;
  :deep(.vc-card) {
    border-radius: 12px !important;
    .arco-card-header {
      @apply px-6!;
    }
    .arco-card-body {
      @apply px-6! pb-6!;
    }
  }
}
</style>
