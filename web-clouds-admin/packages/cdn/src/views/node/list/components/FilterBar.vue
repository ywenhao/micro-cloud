<template>
  <vc-filter-bar
    @search="handleSearch"
    class="mb-4"
    v-model="state"
    :schemas="filterBarScheme"
  >
    <template #prefix>
      <a-button type="primary" @click="visible = true"> 获取安装脚本 </a-button>
    </template>
  </vc-filter-bar>
  <install-command :regions="regions" v-model="visible" />
</template>

<script setup lang="ts">
import { getCdnResolvRegionsListApi } from '@vca/apis/cdn'
import {
  useSelectRemote,
  type VcFilterBarScheme,
  type VcFilterBarState
} from 'vc-material'

import InstallCommand from './InstallCommand.vue'

const visible = ref(false)
const props = defineProps({
  search: { type: Function, required: true }
})
const state = defineModel<VcFilterBarState>('state', { required: true })

const handleSearch = () => {
  props.search()
}

const { remoteMethod: getResolves, opts: regions } = useSelectRemote(
  getCdnResolvRegionsListApi,
  { immediate: false }
)

const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'region_id',
      widget: 'select',
      defaultValue: 0,
      attrs: {
        placeholder: '请选择',
        options: [{ label: '全部区域', value: 0 }]
      }
    },
    {
      field: 'status',
      widget: 'select',
      defaultValue: 0,
      attrs: {
        placeholder: '请选择',
        options: [{ label: '全部运行状态', value: 0 }]
      }
    },
    {
      field: 'async',
      widget: 'select',
      defaultValue: 0,
      attrs: {
        placeholder: '请选择',
        options: [{ label: '全部同步状态', value: 0 }]
      }
    },
    {
      field: 'keywords',
      widget: 'combo-input',
      attrs: {
        defaultSelected: 'user_id',
        options: [
          { label: '节点名称', value: 'user_id' },
          { label: 'IP地址', value: 'ip' }
        ]
      }
    }
  ]
}
onMounted(() => {
  getResolves()
})
</script>
