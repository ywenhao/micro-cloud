<template>
  <vc-container admin class="rounded-sm! space-list-page" page-title="空间列表">
    <a-tabs v-model="queryData.region_id" @change="handleChange">
      <a-tab-pane
        v-for="item in REGION_LIST_DATA"
        :key="item.value"
        :title="item.label"
      >
      </a-tab-pane>
    </a-tabs>
    <div class="flex gap-x-2 mb-4">
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
              v-if="activeName === 'username'"
              v-model="queryData.user_id"
              placeholder="请输入用户ID"
              :max-length="9"
              @change="handleSearch"
            >
              <template #suffix>
                <vc-svg-icon prefix="oss" name="search"></vc-svg-icon>
              </template>
            </a-input>
            <a-input
              v-if="activeName === 'symbol'"
              v-model="queryData.name"
              placeholder="请输入空间名称"
              :max-length="128"
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
      <template #user_id="{ record }">
        <span class="flex items-center"
          >{{ record.user_id }}
          <vc-svg-icon
            prefix="oss"
            name="icon_filter"
            class="filter-svg ml-1 cursor-pointer"
            @click="handleFilter(record?.user_id)"
          ></vc-svg-icon>
        </span>
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
        <a-link :hoverable="false" @click="handleCommand('overview', record)">
          概览
        </a-link>
        <a-link :hoverable="false" @click="handleCommand('file', record)">
          文件
        </a-link>
        <a-link :hoverable="false" @click="handleCommand('setting', record)">
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
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  spaceListApi,
  tagListApi,
  type TagModel,
  updateSpaceRemark
} from '@vca/apis/oss'
import { convertByte, useListRequest } from 'vc-material'
import { useRoute, useRouter } from 'vue-router'

import { REGION_LIST_DATA } from '@/components/SelectData'
import type { DataSource } from '@/types/space-list'

import columns from './columns'
import { filterBarScheme, SPACE_FILTER_LABEL } from './filterBarScheme'

const queryData = ref({
  name: '',
  user_id: '',
  region_id: '',
  tag_key: '',
  tag_value: '',
  acl: '',
  sort: 'created_at',
  order: 'desc'
})

const activeName = ref<string>('username')
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

const handleChange = (value: string | number) => {
  queryData.value.region_id = value as string
  getTableList()
}

const handlePageChange = (page: number) => {
  arcoPagination.current = page
  getTableList()
}

const handlePageSizeChange = (pageSize: number) => {
  arcoPagination.pageSize = pageSize
  getTableList()
}

const handleSorterChange = (dataIndex: string, direction: string) => {
  // @ts-ignore
  queryData.value.order = direction ? direction.replace('end', '') : undefined
  // @ts-ignore
  queryData.value.sort = direction ? dataIndex : undefined
  getTableList()
}

const router = useRouter()
const route = useRoute()

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

const handleSearch = () => {
  pagination.page = 1
  if (queryData.value.user_id !== route.query?.user_id) {
    router.replace({
      ...route,
      query: { ...(route?.query || {}), user_id: undefined }
    })
    getTableList()
  }
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

/**快速筛选*/
const handleFilter = (user_id: string) => {
  activeName.value = 'username'
  queryData.value.user_id = user_id
  getTableList()
}

const handleSelectChange = () => {
  queryData.value.user_id = ''
  router.replace({
    ...route,
    query: { ...(route?.query || {}), user_id: undefined }
  })
  queryData.value.name = ''
  queryData.value.tag_key = ''
  queryData.value.tag_value = ''
  getTableList()
}

onActivated(() => {
  if (route.query?.user_id) {
    queryData.value.user_id = route.query?.user_id as string
  }
  getTableList()
})
</script>

<style scoped lang="less">
.space-list-page {
  :deep(.vc-container__header) {
    @apply border-none!;
  }
  :deep(.vc-container__content) {
    @apply pt-2!;
  }
  :deep(.current-table-row) {
    .filter-svg {
      @apply hidden;
    }
    &:hover {
      .filter-svg {
        display: inline-block;
      }
    }
  }
}
</style>
