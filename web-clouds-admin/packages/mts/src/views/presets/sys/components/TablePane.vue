<template>
  <div class="table-pane">
    <vc-filter-bar
      @search="getList()"
      :loading="loading"
      v-model="filterData"
      :schemas="filterBarScheme"
      v-model:page="pagination.page"
    >
      <template #prefix>
        <a-button type="primary" @click="toAddPage">新建预设</a-button>
      </template>
    </vc-filter-bar>
    <div table-box>
      <vc-table
        row-key="id"
        ref="tableRef"
        :data="tableData"
        :columns="columns"
        :bordered="false"
        @sorter-change="handleSortChange"
        @get-list="getList()"
        :page-data="pagination"
        :loading="loading"
      >
        <template #actions="{ record }">
          <a-link @click="handleView(record)">详情</a-link>
          <a-link @click="handleCopy(record)">复制</a-link>
          <a-link @click="handleEdit(record)">编辑</a-link>
          <a-link @click="handleDelete(record)" status="danger">删除</a-link>
        </template>
      </vc-table>
    </div>
    <transcode-detail-drawer
      is-preset
      v-model="detailDialogVisible"
      :record="detailDialogState"
    />
  </div>
</template>

<script setup lang="ts">
import {
  deleteMtsPresetApi,
  getMtsPresetListApi,
  type VideoPresetModel
} from '@vca/apis/mts'
import { decPageByData, useListRequest, useTable, VcModal } from 'vc-material'

import TranscodeDetailDrawer from '@/components/workflow/detail/TranscodeDrawer.vue'

import { ADD_FORM_STATE_KEY } from '../constants'
import { columns } from './columns'
import { filterBarScheme } from './scheme'

const props = defineProps<{
  preset_type: string
}>()

const router = useRouter()
const filterData = ref({
  preset_type: props.preset_type,
  custom_type: 2
})

const apiFn = (...args: any[]) =>
  // @ts-ignore
  getMtsPresetListApi(...args).then(res => ({
    ...res,
    list: res.video_preset_list || []
  }))

const {
  loading,
  pagination,
  run: getList,
  data: tableData
} = useListRequest(apiFn, filterData)

onActivated(() => {
  getList()
})

const { tableRef, createSortChange } = useTable(tableData)
const handleSortChange = createSortChange(getList, filterData)

const detailDialogVisible = ref(false)
const detailDialogState = ref<VideoPresetModel>()
async function handleView(row: VideoPresetModel) {
  detailDialogState.value = { ...row }
  detailDialogVisible.value = true
}

const toAddPage = () => router.push({ name: 'PresetsSysTranscodeAdd' })

async function handleDelete(row: VideoPresetModel) {
  const request = () =>
    // @ts-ignore
    deleteMtsPresetApi({ id: row.id, preset_type: props.preset_type }).then(
      () => {
        decPageByData(pagination, tableData)
        getList()
      }
    )
  VcModal.error(
    {
      title: '删除预设',
      content: '删除后不可恢复，是否确认删除？'
    },
    request
  )
}

const editState = useSessionStorage(
  ADD_FORM_STATE_KEY,
  ref<VideoPresetModel>({})
)

function handleCopy(row: VideoPresetModel) {
  editState.value = { ...row, id: undefined, name: undefined }
  toAddPage()
}

function handleEdit(row: VideoPresetModel) {
  router.push({
    name: 'PresetsSysTranscodeEdit',
    params: { id: row?.id! }
  })
}
</script>
