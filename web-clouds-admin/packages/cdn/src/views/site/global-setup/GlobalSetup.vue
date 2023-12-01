<template>
  <vc-container admin page-title="全局配置">
    <a-tabs v-model:active-key="active" class="mt-2">
      <a-tab-pane key="compress" title="压缩配置">
        <compress-pane v-if="active === 'compress'" />
      </a-tab-pane>
      <a-tab-pane key="cache" title="缓存规则">
        <cache-pane v-if="active === 'cache'" />
      </a-tab-pane>
    </a-tabs>
  </vc-container>
</template>

<script setup lang="ts">
import CachePane from './components/CachePane.vue'
import CompressPane from './components/CompressPane.vue'

const active = ref<'compress' | 'cache'>('compress')
</script>
