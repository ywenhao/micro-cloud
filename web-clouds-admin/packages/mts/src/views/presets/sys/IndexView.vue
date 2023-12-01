<template>
  <vc-container class="has-tabs-table" admin page-title="系统预设">
    <a-tabs v-model:active-key="active">
      <a-tab-pane v-for="item in tabs" :key="item.value" :title="item.label">
        <table-pane :preset_type="active" v-if="active === item.value" />
      </a-tab-pane>
    </a-tabs>
  </vc-container>
</template>

<script setup lang="ts">
import TablePane from './components/TablePane.vue'

const tabs = [{ value: '1', label: '普通转码预设' }] as const
export type TabType = (typeof tabs)[number]

const active = ref<TabType['value']>(tabs[0].value)
</script>
