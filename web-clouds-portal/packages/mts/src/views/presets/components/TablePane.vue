<template>
  <div class="table-pane">
    <vc-filter-bar
      ref="filterRef"
      @search="getList()"
      :loading="loading"
      v-model="filterData"
      :schemas="scheme"
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
        :page-data="pageData"
        :loading="loading"
      >
        <template #actions="{ record }">
          <a-link @click="handleView(record)">详情</a-link>
          <a-link @click="handleCopy(record)">复制</a-link>
          <a-link @click="handleEdit(record)" v-if="record.custom_type !== 2"
            >编辑</a-link
          >
          <a-link
            @click="handleDelete(record)"
            status="danger"
            v-if="record.custom_type !== 2"
            >删除</a-link
          >
        </template>
      </vc-table>
    </div>
    <transcode-detail-drawer
      is-preset
      v-model="detailDialogVisible"
      :record="detailDialogState"
      v-if="props.preset_type.label === '普通转码预设'"
    />
    <watermark-detail-drawer
      is-preset
      v-model="detailDialogVisible"
      :record="detailDialogState"
      v-else-if="props.preset_type.label === '水印预设'"
    />
    <screenshot-detail-drawer
      is-preset
      v-model="detailDialogVisible"
      :record="detailDialogState"
      v-else-if="props.preset_type.label === '截图预设'"
    />
    <video-splice-detail-drawer
      is-preset
      v-model="detailDialogVisible"
      :record="detailDialogState"
      v-else-if="props.preset_type.label === '视频拼接预设'"
    />
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  deleteMtsPresetApi,
  getMtsPresetListApi,
  type PresetItemModel,
  type PresetModel
} from '@vcp/apis/mts'
import { decPageByData, useListRequest, useTable, VcModal } from 'vc-material'

import ScreenshotDetailDrawer from '@/components/workflow/detail/ScreenshotDrawer.vue'
import TranscodeDetailDrawer from '@/components/workflow/detail/TranscodeDrawer.vue'
import VideoSpliceDetailDrawer from '@/components/workflow/detail/VideoSpliceDrawer.vue'
import WatermarkDetailDrawer from '@/components/workflow/detail/WatermarkDrawer.vue'

import { ADD_FORM_STATE_KEY } from '../constants'
import type { TabType } from '../IndexView.vue'
import { useColumns } from './columns'
import { useScheme } from './scheme'

const props = defineProps<{
  preset_type: TabType
  id: string
}>()

const columns = useColumns(props.preset_type.label)
const scheme = useScheme(props.preset_type.label)
const router = useRouter()
const filterRef = ref()

const filterData = ref({})
const state = computed(() => ({
  ...filterData.value,
  region_id: props.id,
  preset_type: props.preset_type.value
}))

const listKey = [
  'video_preset',
  'watermark_preset',
  'screenshot_preset',
  'splice_preset'
][+props.preset_type.value - 1] as keyof PresetModel

const apiFn = async (params: any) => {
  const data = listKey === 'video_preset' ? { ...params, limit: 0 } : params
  const res = await getMtsPresetListApi(data)
  return {
    ...res,
    list: res[`${listKey}_list`] || []
  }
}

const pageData = computed(() =>
  props.preset_type.label === '普通转码预设' ? undefined : pagination
)

const {
  loading,
  pagination,
  run: getList,
  data: tableData
} = useListRequest(apiFn, state)
loading.value = true

const isLoadOnce = ref(false)
watchEffect(() => {
  if (props.id && props.preset_type) {
    getList()
    isLoadOnce.value = true
  }
})

onActivated(() => {
  if (!isLoadOnce.value) return
  props.id && props.preset_type && getList()
})

const { tableRef, createSortChange } = useTable(tableData)
const handleSortChange = createSortChange(getList, filterData)

const detailDialogVisible = ref(false)
const detailDialogState = ref<PresetItemModel>()

async function handleView(row: PresetItemModel) {
  detailDialogState.value = { ...row }
  detailDialogVisible.value = true
}

async function handleDelete(row: PresetItemModel) {
  const request = () =>
    deleteMtsPresetApi({
      id: row.id,
      preset_type: props.preset_type.value
    }).then(() => {
      Message.success('删除成功')
      decPageByData(pagination, tableData)
      getList()
    })
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
  ref<PresetItemModel>({})
)

const toAddPage = () =>
  router.push({ name: `Presets${pathKey}Add`, params: { regionId: props.id } })

const pathKey = ['Transcode', 'Watermark', 'Screenshot', 'VideoSplice'][
  +props.preset_type.value - 1
] as string

function handleCopy(row: PresetItemModel) {
  editState.value = { ...row, id: undefined, name: undefined }
  toAddPage()
}

function handleEdit(row: PresetItemModel) {
  router.push({
    name: `Presets${pathKey}Edit`,
    params: { id: row?.id!, regionId: props.id }
  })
}
</script>
