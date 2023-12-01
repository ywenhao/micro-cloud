<template>
  <vc-container page-title="我的工单" class="has-tabs-table">
    <a-tabs v-model:active-key="active">
      <a-tab-pane title="全部工单" key="全部工单">
        <my-all-item v-if="active === '全部工单'" />
      </a-tab-pane>
      <a-tab-pane title="处理中" key="处理中">
        <my-all-item v-if="active === '处理中'" />
      </a-tab-pane>
      <a-tab-pane title="已结单" key="已结单">
        <my-all-item v-if="active === '已结单'" />
      </a-tab-pane>
    </a-tabs>
  </vc-container>
</template>

<script setup lang="ts">
import MyAllItem from './my/MyAllItem.vue'

export type IActive = '全部工单' | '处理中' | '已结单'
const active = ref<IActive>('全部工单')

provide('active', active)
</script>
