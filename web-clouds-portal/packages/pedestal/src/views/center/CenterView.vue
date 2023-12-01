<template>
  <vc-container page-title="个人中心" class="has-tabs-table">
    <a-tabs
      :active-key="active"
      @tab-click="$router.push({ name: $event as IActive })"
    >
      <a-tab-pane title="基本信息" key="CenterBase">
        <base-item v-if="route.name === 'CenterBase'" />
      </a-tab-pane>
      <a-tab-pane title="安全设置" key="CenterSafe">
        <safe-item v-if="route.name === 'CenterSafe'" />
      </a-tab-pane>
      <!-- <a-tab-pane title="API Key管理" key="CenterApiKey">
        <api-key-item v-if="route.name === 'CenterApiKey'" />
      </a-tab-pane> -->
    </a-tabs>
  </vc-container>
</template>

<script setup lang="ts">
// import ApiKeyItem from './ApiKeyItem.vue'
import BaseItem from './BaseItem.vue'
import SafeItem from './SafeItem.vue'

export type IActive = 'CenterBase' | 'CenterSafe' | 'CenterApiKey'

const route = useRoute()

const active = computed(() => route.name as IActive)
</script>
