<template>
  <vc-container header-bordered page-title="任务管理">
    <template #header-extra>
      <region-select
        v-model:active="active"
        :options="tabs"
        :loading="loading"
      />
    </template>
    <table-pane :key="active + 'table'" :id="active" v-if="active" />
  </vc-container>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { regionListApi } from '@vcp/apis/oss'

import RegionSelect from '@/components/RegionSelect.vue'

import TablePane from './components/TablePane.vue'

const active = useLocalStorage('region_id', '')

const tabs = ref<{ value: string; label: string }[]>([])
const loading = ref(false)

async function getTabs() {
  loading.value = true
  try {
    const res = await regionListApi({})
    tabs.value = (res.list || []).map(v => ({ value: v.id!, label: v.name! }))

    if (!tabs.value.length) Message.error('区域列表为空')
    const item = tabs.value.find(v => v.value === active.value)
    active.value = item ? item.value : tabs.value[0].value
  } finally {
    loading.value = false
  }
}

onMounted(() => getTabs())
</script>
