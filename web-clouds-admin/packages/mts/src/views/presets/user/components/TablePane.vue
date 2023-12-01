<template>
  <div class="table-pane">
    <vc-filter-bar
      ref="filterRef"
      @search="getList()"
      :loading="loading"
      v-model="filterData"
      :schemas="scheme"
      v-model:page="pagination.page"
    />
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
        <template #user_id="{ record }">
          <div class="flex items-center">
            <vc-text-ell
              class="sub-title font-400! max-w-[max-content]"
              :content="record.user_id"
            />
            <vc-svg-icon
              prefix="mts"
              name="filter"
              :size="16"
              @click="handleFilter(record)"
              class="ml-4px cursor-pointer cell-hide"
            />
          </div>
        </template>
        <template #actions="{ record }">
          <a-link @click="handleView(record)">详情</a-link>
          <a-link @click="handleDelete(record)" status="danger">删除</a-link>
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
} from '@vca/apis/mts'
import { regionListApi } from '@vca/apis/oss'
import { decPageByData, useListRequest, useTable, VcModal } from 'vc-material'

import ScreenshotDetailDrawer from '@/components/workflow/detail/ScreenshotDrawer.vue'
import TranscodeDetailDrawer from '@/components/workflow/detail/TranscodeDrawer.vue'
import VideoSpliceDetailDrawer from '@/components/workflow/detail/VideoSpliceDrawer.vue'
import WatermarkDetailDrawer from '@/components/workflow/detail/WatermarkDrawer.vue'

import type { TabType } from '../IndexView.vue'
import { useColumns } from './columns'
import { useScheme } from './scheme'

const props = defineProps<{
  preset_type: TabType
}>()

const columns = useColumns(props.preset_type.label)
const scheme = useScheme(props.preset_type.label)

const filterRef = ref()
const filterData = ref({
  region_id: ''
})
const state = computed(() => ({
  ...filterData.value,
  preset_type: props.preset_type.value
}))

const listKey = [
  'video_preset',
  'watermark_preset',
  'screenshot_preset',
  'splice_preset'
][+props.preset_type.value - 1] as keyof PresetModel

const apiFn = (...args: any[]) =>
  // @ts-ignore
  getMtsPresetListApi(...args).then(res => ({
    ...res,
    // @ts-ignore
    list: res[`${listKey}_list`] || []
  }))

const {
  loading,
  pagination,
  run: getList,
  data: tableData
} = useListRequest(apiFn, state)
loading.value = true

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

async function handleFilter(row: PresetItemModel) {
  filterRef.value?.setFieldAttrs('keywords', {
    defaultSelected: ''
  })
  await nextTick()
  filterRef.value?.setFieldAttrs('keywords', {
    defaultSelected: 'user_id'
  })
  filterRef.value?.setFieldValue('user_id', row?.user_id)
  getList()
}

async function getRegions() {
  filterRef.value?.setFieldAttrs('region_id', { loading: true })
  try {
    const res = await regionListApi({})
    const list = (res.list || []).map(v => ({ value: v.id!, label: v.name! }))
    if (!list.length) {
      return Message.error('区域列表为空')
    }
    filterData.value.region_id = list[0].value
    filterRef.value?.setFieldAttrs('region_id', { options: list })
    filterRef.value?.setFieldValue('region_id', list[0].value)
  } finally {
    filterRef.value?.setFieldAttrs('region_id', { loading: false })
  }
}

watch(
  () => props.preset_type.value,
  async () => {
    await getRegions()
    if (!filterData.value.region_id) return
    await getList()
  },
  {
    immediate: true
  }
)
</script>
