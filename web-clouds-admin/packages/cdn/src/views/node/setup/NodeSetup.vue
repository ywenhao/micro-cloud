<template>
  <vc-container
    admin
    page-title="节点配置"
    :back="() => $router.push({ name: 'NodeList' })"
  >
    <a-tabs default-active-key="waf" class="mt-2">
      <a-tab-pane key="cache" title="缓存配置">
        <cache-template-panel :node_id="String(route.params?.id || '')" />
      </a-tab-pane>
      <a-tab-pane key="waf" title="WAF配置">
        <waf-table-panel />
      </a-tab-pane>
    </a-tabs>
  </vc-container>
</template>

<script setup lang="ts">
import CacheTemplatePanel from '../cache-template-panel'
import WafTablePanel from './WafTablePanel.vue'
const route = useRoute()
</script>
