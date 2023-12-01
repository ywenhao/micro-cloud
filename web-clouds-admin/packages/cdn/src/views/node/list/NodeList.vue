<template>
  <vc-container admin header-bordered page-title="节点列表">
    <!-- <vca-card secondary title="节点安装命令">
      <div class="flex items-center">
        <div
          class="bg-fill-3 h-8 leading-8 mr-2 px-10px rounded-md break-all truncate"
        >
          {{ installCommand }}
        </div>
        <div
          @click="copy(installCommand)"
          class="w-8 h-8 p-2 bg-fill-3 rounded-md cursor-pointer"
        >
          <vc-svg-icon name="copy" prefix="cdn" :size="16"></vc-svg-icon>
        </div>
      </div>
    </vca-card> -->
    <filter-bar
      v-model:state="filterState"
      class="mb-4"
      :search="tableRef?.getTableList"
    >
    </filter-bar>
    <node-table ref="tableRef" v-model:state="filterState" />
  </vc-container>
</template>

<script setup lang="ts">
import {
  // useClipboard,
  type VcFilterBarState
} from 'vc-material'

import FilterBar from './components/FilterBar.vue'
import NodeTable from './components/NodeTable.vue'
const filterState = ref<VcFilterBarState>({})
// const installCommand = ref('')
// const { copy } = useClipboard()
const tableRef = ref()

// const getInstallCommand = () => {
//   getCdnnodeNodesInstallCommandApi().then(res => {
//     installCommand.value = res.command || ''
//   })
// }
</script>
