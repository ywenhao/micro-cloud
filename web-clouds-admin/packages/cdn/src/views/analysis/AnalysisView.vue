<template>
  <vc-container admin :page-title="PageTitle">
    <analysis-header
      @command="commandEvent"
      v-model:state="state"
      :module="module"
    />
    <analysis-table
      ref="tableRef"
      :filter-state="state"
      @command="commandEvent"
      :module="module"
    />
    <analysis-editor-domain
      v-model:record="editorState.record"
      v-model="editorState.visible"
      v-if="module === 'domain'"
      @reload="tableRef?.refresh"
    ></analysis-editor-domain>
    <analysis-editor-region
      v-model:record="editorState.record"
      v-model="editorState.visible"
      v-if="module === 'region'"
      @reload="tableRef?.refresh"
    ></analysis-editor-region>
    <analysis-details
      :module="module"
      v-model="detailState.visible"
      :recordId="detailState.record"
      :type="detailState.type"
    ></analysis-details>
  </vc-container>
</template>

<script setup lang="ts">
import type { VcFilterBarState } from 'vc-material'

import AnalysisDetails from './AnalysisDetails.vue'
import AnalysisHeader from './AnalysisHeader.vue'
import AnalysisTable from './AnalysisTable.vue'
import { type AnalysisTableInstance, useCommand } from './hooks/useCommand'
const tableRef = ref<AnalysisTableInstance>()
const state = ref<VcFilterBarState>({})

const AnalysisEditorDomain = defineAsyncComponent(
  () => import('./domain/EditorDomain.vue')
)

const AnalysisEditorRegion = defineAsyncComponent(
  () => import('./region/EditorRegion.vue')
)
const props = defineProps<{ module: 'domain' | 'region' }>()
const PageTitle = computed(() =>
  props.module === 'domain' ? '域名解析' : '解析区域'
)
const { commandEvent, editorState, detailState } = useCommand({
  module: props.module,
  tableRef
})
</script>
