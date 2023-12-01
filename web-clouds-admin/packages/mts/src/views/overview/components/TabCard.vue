<template>
  <vca-card class="main-card">
    <a-tabs v-model:active-key="active">
      <a-tab-pane v-for="item in tabs" :key="item.label" :title="item.label">
        <component :is="item.component" v-if="item.label === active" />
      </a-tab-pane>
    </a-tabs>
  </vca-card>
</template>

<script setup lang="ts">
import VcaCard from '@/components/VcaCard.vue'

import VideoScreenshot from './VideoScreenshot.vue'
import VideoTranscoding from './VideoTranscoding.vue'

const tabs = [
  { label: '视频转码', component: VideoTranscoding },
  { label: '视频截图', component: VideoScreenshot }
] as const

type IActive = (typeof tabs)[number]['label']

const active = ref<IActive>('视频转码')
</script>

<style lang="less" scoped>
.main-card {
  padding-top: 16px;
}
</style>
