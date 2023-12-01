<template>
  <vc-container class="space-list-page">
    <template #header>
      <span class="text-ct-1 text-base font-medium">空间管理</span>
      <a-divider direction="vertical"></a-divider>
      <span class="text-ct-3 text-sm">区域：</span>
      <a-dropdown
        v-if="REGION_LIST_DATA.length > 1"
        trigger="hover"
        @select="v => handleChange(v as string)"
        class="region-dropdown"
      >
        <div class="flex flex-row gap-x-1 items-center cursor-pointer">
          <span class="text-primary">{{
            regionName(queryData.region_id)
          }}</span>
          <icon-down size="12" class="text-ct-3!" />
        </div>
        <template #content>
          <a-doption
            v-for="item in REGION_LIST_DATA"
            :key="item.value"
            :value="item.value"
            >{{ item.label }}
          </a-doption>
        </template>
      </a-dropdown>
      <span v-else class="text-primary">{{
        regionName(queryData.region_id)
      }}</span>
    </template>

    <a-spin :loading="summaryLoading" class="w-full">
      <div class="grid grid-cols-2 gap-x-4 mt-2 mb-4">
        <div class="p-4 storage_space_contain rounded-md">
          <div class="flex items-center justify-between mb-6px">
            <span class="text-sm text-ct-1"
              >存储空间<span class="pl-2 text-primary font-medium"
                >{{ emptyText(spaceSummary?.max_space_bytes) }}
                {{
                  getStorageUnit(
                    Number(spaceSummary?.max_space_bytes_unit) as BytesUnit
                  )?.unit
                }}</span
              ></span
            >
            <span class="text-sm text-ct-1"
              >剩余<span
                class="pl-2 text-primary font-medium"
                :class="{ 'text-[#FF7D00]': remainPercent * 100 > 80 }"
                >{{
                  +remainData ? convertByte(remainData.toFixed(2)) : '-'
                }}</span
              ></span
            >
          </div>
          <a-progress
            :percent="remainPercent"
            :stroke-width="8"
            :show-text="false"
            class="vc-oss-progress"
            :color="remainPercent * 100 > 80 ? '#FF7D00' : '#2253E6'"
            track-color="
        rgba(78, 89, 105, 0.20)"
          />
        </div>
        <div class="p-4 space_count_container rounded-md">
          <div class="flex items-center justify-between mb-6px">
            <span class="text-sm text-ct-1"
              >空间数量<span class="pl-2 text-success font-medium"
                >{{ emptyText(spaceSummary?.max_total_bucket) }} 个</span
              ></span
            >
            <span class="text-sm text-ct-1"
              >剩余<span
                class="pl-2 text-success font-medium"
                :class="{ 'text-[#FF7D00]': spaceCountPercent * 100 > 80 }"
                >{{
                  isNaN(
                    Number(spaceSummary?.max_total_bucket) -
                      Number(spaceSummary?.used_bucket)
                  )
                    ? '-'
                    : Number(spaceSummary?.max_total_bucket) -
                      Number(spaceSummary?.used_bucket)
                }}
                个</span
              ></span
            >
          </div>
          <a-progress
            :percent="spaceCountPercent"
            :stroke-width="8"
            :show-text="false"
            class="vc-oss-progress"
            :color="spaceCountPercent * 100 > 80 ? '#FF7D00' : '#00B42A'"
            track-color="
        rgba(78, 89, 105, 0.20)"
          />
        </div>
      </div>
    </a-spin>
    <div class="flex gap-x-2 mb-4">
      <a-button type="primary" @click="handleCreate">新建</a-button>
      <vc-filter-bar
        v-model:page="pagination.page"
        v-model="queryData"
        :schemas="filterBarScheme"
        class="items-start gap-x-0!"
        @search="getTableList()"
      >
        <template #middle>
          <a-input-group>
            <a-select
              v-model="activeName"
              :options="SPACE_FILTER_LABEL"
              placeholder="请输入"
              class="w-[110px]!"
              @change="handleSelectChange"
            />
            <a-input
              v-if="activeName === 'symbol'"
              v-model="queryData.name"
              :max-length="128"
              placeholder="请输入空间名称"
              @change="getTableList()"
            >
              <template #suffix>
                <vc-svg-icon prefix="oss" name="search"></vc-svg-icon>
              </template>
            </a-input>
            <div v-if="activeName === 'label'">
              <a-input
                v-model="queryData.tag_key"
                class="rounded-none! w-[105px]!"
                placeholder="标签键"
                @change="getTableList()"
              />
              <a-input
                v-model="queryData.tag_value"
                class="rounded-none! w-[105px]!"
                placeholder="标签值"
                @change="getTableList()"
              />
            </div>
          </a-input-group>
        </template>
      </vc-filter-bar>
    </div>
    <a-table
      column-resizable
      :bordered="false"
      :loading="loading"
      :columns="columns"
      :data="dataSource"
      :pagination="arcoPagination"
      @page-change="handlePageChange"
      @sorter-change="handleSorterChange"
      @page-size-change="handlePageSizeChange"
      :row-class="'current-table-row'"
    >
      <template #label="{ record }">
        <a-popover position="bottom" content-class="space-label-popover">
          <vc-svg-icon
            name="icon_label"
            prefix="oss"
            class="cursor-pointer ml-1"
            @mouseover="handleMouse(record)"
          ></vc-svg-icon>
          <template #content>
            <a-list
              v-if="tagListData?.length"
              size="small"
              class="max-h-200px overflow-y-auto!"
            >
              <template #header>
                <span class="item-label-border pr-3!">标签键</span>
                <span class="pl-3!">标签值</span>
              </template>
              <a-list-item v-for="item in tagListData" :key="item.id">
                <span class="pr-3! item-label-border">{{ item.key }}</span>
                <span class="pl-3">{{ item.val }}</span></a-list-item
              >
            </a-list>
            <div class="flex justify-end items-center mt-3!">
              <a-button v-if="!tagListData?.length" size="mini" type="outline"
                >未设置标签</a-button
              >
              <a-button
                type="primary"
                size="mini"
                class="w-48px"
                @click="handleCommand('setting', record, 'label')"
                >{{ tagListData?.length ? '' : '去' }}设置</a-button
              >
            </div>
          </template>
        </a-popover>
      </template>
      <template #remark="{ record }">
        <vc-remark-input
          :content="record.remark"
          :maxLength="100"
          :on-submit="(v:string) => editRemark(record, v)"
        ></vc-remark-input>
      </template>
      <template #stroage_bytes="{ record }">
        <span>{{ convertByte(Number(record.storage_bytes)) }}</span>
      </template>
      <template #acl="{ record }">
        <span>{{ record.acl === 'private' ? '私有' : '公开' }}</span>
      </template>
      <template #region_id="{ record }">
        {{ regionName(record.region_id) }}
      </template>
      <template #actions="{ record }">
        <a-link
          :hoverable="false"
          @click="handleCommand('overview', record)"
          type="primary"
        >
          概览
        </a-link>
        <a-link
          :hoverable="false"
          @click="handleCommand('file', record)"
          type="primary"
        >
          文件
        </a-link>
        <a-link
          :hoverable="false"
          @click="handleCommand('setting', record)"
          type="primary"
        >
          设置
        </a-link>
        <a-link
          :hoverable="false"
          @click="handleCommand('domain', record)"
          type="primary"
        >
          域名
        </a-link>
      </template>
    </a-table>
  </vc-container>
  <create-space
    v-model="spaceState.visible"
    v-model:loading="spaceState.loading"
    @reload="getTableList()"
  />
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { IconDown } from '@arco-design/web-vue/es/icon'
import type { SpaceSummaryData } from '@vcp/apis/oss'
import {
  spaceListApi,
  spaceSummaryApi,
  tagListApi,
  type TagModel,
  updateSpaceRemark
} from '@vcp/apis/oss'
import { convertByte, emptyText, useListRequest } from 'vc-material'
import { useRouter } from 'vue-router'

import { REGION_LIST_DATA } from '@/components/SelectData'
import type { DataSource } from '@/types/space-list'

import columns from './columns'
import CreateSpace from './components/CreateSpace.vue'
import { filterBarScheme, SPACE_FILTER_LABEL } from './filterBarScheme'

const queryData = ref({
  name: '',
  region_id: '',
  tag_key: '',
  tag_value: '',
  acl: '',
  sort: 'created_at',
  order: 'desc'
})

//@ts-ignore
const spaceState = reactive<CommonState<any>>({
  visible: false,
  loading: false
})

const activeName = ref<string>('symbol')
const tagListData = ref<TagModel[]>([])

const {
  pagination,
  arcoPagination,
  loading,
  data: dataSource,
  run: getTableList
} = useListRequest(spaceListApi, queryData, {
  showPageSize: true,
  showTotal: true
})

const regionName = computed(() => (id: string) => {
  let name = '-'
  REGION_LIST_DATA.value.some(({ value, label }) => {
    value === id ? (name = label) : ''
  })
  return name
})

const handleChange = (value: string) => {
  queryData.value.region_id = value
  getTableList()
}

const handleSorterChange = (dataIndex: string, direction: string) => {
  // @ts-ignore
  queryData.order = direction ? direction.replace('end', '') : undefined
  // @ts-ignore
  queryData.sort = direction ? dataIndex : undefined
  getTableList()
}

const handleCreate = () => {
  spaceState.visible = true
}

const handlePageChange = (page: number) => {
  arcoPagination.current = page
  getTableList()
}

const handlePageSizeChange = (pageSize: number) => {
  arcoPagination.pageSize = pageSize
  getTableList()
}

const router = useRouter()

const handleCommand = (
  command: string,
  record?: DataSource,
  label?: string
) => {
  router.push({
    name: 'SpaceDetail',
    params: { id: record?.id, command, label }
  })
}

// 修改备注
const editRemark = async (record: DataSource, v: string) => {
  const data = {
    bucket_id: record.id,
    remark: v
  }
  try {
    //@ts-ignore
    await updateSpaceRemark(data).then(() => {
      Message.success('修改成功')
      getTableList()
    })
  } catch (e) {
    Message.error('请求错误，请稍后重试')
  }
}

/**获取标签 */
const handleMouse = (record: DataSource) => {
  tagListApi({ bucket_id: record.id }).then(res => {
    //@ts-ignore
    tagListData.value = res.list
  })
}

const summaryLoading = ref<boolean>(false)

const spaceSummary = ref<SpaceSummaryData>()

/** 获取存储空间和空间数量 */
const getSpaceData = () => {
  summaryLoading.value = true
  spaceSummaryApi()
    .then(res => {
      spaceSummary.value = res
    })
    .finally(() => {
      summaryLoading.value = false
    })
}

type BytesUnit = 1 | 2 | 3

const getStorageUnit = (bytes_unit: BytesUnit) => {
  const command = {
    1: {
      unit: 'GB',
      value: 1024 * 1024 * 1024
    },
    2: {
      unit: 'TB',
      value: 1024 * 1024 * 1024 * 1024
    },
    3: {
      unit: 'PB',
      value: 1024 * 1024 * 1024 * 1024 * 1024
    }
  }
  return command[bytes_unit]
}

// 剩余存储空间
const remainData = computed<number>(
  () =>
    Number(spaceSummary.value?.max_space_bytes) *
      getStorageUnit(
        Number(spaceSummary.value?.max_space_bytes_unit) as BytesUnit
      )?.value -
    Number(spaceSummary.value?.used_space_bytes)
)

// 占比
const remainPercent = computed<number>(
  () =>
    Number(spaceSummary.value?.used_space_bytes) /
    (Number(spaceSummary.value?.max_space_bytes) *
      getStorageUnit(
        Number(spaceSummary.value?.max_space_bytes_unit) as BytesUnit
      )?.value)
)

const spaceCountPercent = computed<number>(
  () =>
    Number(spaceSummary.value?.used_bucket) /
    Number(spaceSummary.value?.max_total_bucket)
)

const handleSelectChange = () => {
  queryData.value.name = ''
  queryData.value.tag_key = ''
  queryData.value.tag_value = ''
  getTableList()
}

onActivated(() => {
  getTableList()
  getSpaceData()
})
</script>

<style scoped lang="less">
.space-list-page {
  :deep(.vc-oss-progress) {
    .arco-progress-line,
    .arco-progress-line-bar {
      border-radius: 2px;
    }
  }
  :deep(.vc-container__header) {
    @apply border-none!;
  }
  :deep(.vc-container__content) {
    @apply pt-2!;
  }

  :deep(.current-table-row) {
    .edit-svg {
      @apply hidden;
    }
    &:hover {
      .edit-svg {
        display: inline-block;
      }
    }
  }
  .storage_space_contain {
    background: url('@/assets/images/storage_space.png') no-repeat center;
  }
  .space_count_container {
    background: url('@/assets/images/space_count.png') no-repeat center;
  }
}
</style>
