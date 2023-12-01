<template>
  <vc-container admin header-bordered page-title="站点列表">
    <vc-filter-bar
      ref="filterBarRef"
      class="mb-4"
      v-model="filterData"
      :schemas="filterBarSchemes"
      @search="handleSearch"
    />
    <vc-table
      row-key="id"
      column-resizable
      :data="dataSource"
      :columns="columns"
      @row-click="handleRowClick"
      @sorter-change="handleSortChange"
      @get-list="getList"
      :page-data="pagination"
      :loading="loading"
    >
      <!-- 解析状态 -->
      <template #resolve_status="{ record }">
        <div
          class="flex items-center gap-x-1"
          v-if="resolveStats(record)?.status === 0"
        >
          <a-spin :size="12" :loading="resolveStats(record)?.loading"> </a-spin>
          <span>获取中</span>
        </div>
        <template v-if="resolveStats(record)?.status === -1">
          获取失败
        </template>
        <template v-if="resolveStats(record)?.status === 1">已解析</template>
        <template v-if="resolveStats(record)?.status === 2">未解析</template>
      </template>
      <template #actions="{ record }">
        <a-link :hoverable="false" @click="handleCommand('setup', record)">
          配置
        </a-link>
        <a-link
          :hoverable="false"
          @click="handleCommand('cleanCache', record)"
          status="warning"
        >
          清除缓存
        </a-link>
      </template>
      <template #status="{ record }">
        <a-switch
          :model-value="record?.status"
          inlinePrompt
          :before-change="() => handleChangeStatus(record)"
          :unchecked-value="2"
          :checked-value="1"
        ></a-switch>
      </template>
    </vc-table>
    <clear-cache
      v-model="cleanState.visible"
      :siteId="cleanState.siteId"
      :domain="cleanState.domain"
    ></clear-cache>
  </vc-container>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  type CommonReturnListItem,
  getCdnResolvRegionsListApi,
  getCdnSiteListApi,
  updateCdnSiteStatusByIdApi
} from '@vca/apis/cdn'
import { useListRequest, useTable, VcModal } from 'vc-material'

import { useResolveStatus } from '@/hooks/useResolveStatus'

import ClearCache from './ClearCache.vue'
import columns from './columns'
import filterBarSchemes from './filterBarSchemes'

const filterBarRef = ref()
const route = useRoute()
const router = useRouter()

const { resolveStats, setKeys } = useResolveStatus('site')
const filterData = reactive({
  status: 0,
  title: '',
  content: '',
  user_id_keyword: ''
})

const {
  pagination,
  loading,
  run: getList,
  data: dataSource
} = useListRequest(getCdnSiteListApi, filterData)

const { createSortChange } = useTable(dataSource)

const handleSortChange = createSortChange(getList, filterData)

const noticeState = reactive({
  visible: false,
  list: [] as any
})

const handleRowClick = (row: any) => {
  noticeState.list = [row]
  noticeState.visible = true
}

const handleSearch = () => {
  pagination.page = 1
  if (route.query?.user_id !== filterData.user_id_keyword) {
    router.replace({
      ...route,
      query: { ...(route?.query || {}), user_id: undefined }
    })
    getList()
  }
}

watchPostEffect(async () => {
  if (dataSource.value.length) {
    const keys = dataSource.value.map(({ id }) => String(id))

    setKeys(keys)
  }
})
type ICommand = 'setup' | 'cleanCache'

/** 状态切换事件 */
const handleChangeStatus = (
  record: CommonReturnListItem<'/v1/cdn/site', 'get'>
) => {
  const request = () => {
    return new Promise<void>((resolve, reject) => {
      loading.value = true
      updateCdnSiteStatusByIdApi({
        site_id: record.id!,
        status: Number(record.status) === 1 ? 2 : 1
      } as any)
        .then(() => {
          Message.success(Number(record.status) === 1 ? '禁用成功' : '启用成功')
          resolve()
          getList()
        })
        .finally(() => {
          loading.value = false
        })
        .catch(() => reject())
    })
  }
  VcModal.confirm(
    {
      title: Number(record.status) !== 1 ? '启用站点' : '禁用站点',
      content: Number(record.status) !== 1 ? '确认启用站点' : '确认禁用站点'
    },
    request
  )
}
const cleanState = reactive<{
  siteId?: string
  domain?: string
  visible: boolean
}>({
  domain: undefined,
  siteId: undefined,
  visible: false
})

/** 事件处理集合 */
const handleCommand = (command: ICommand, record?: any) => {
  const actions: Record<ICommand, () => void> = {
    cleanCache: () => {
      cleanState.siteId = record?.id
      cleanState.domain = record?.domain
      cleanState.visible = true
    },
    setup: () => {
      router.push({
        name: 'SiteSetup',
        params: {
          domain: record?.domain,
          id: record?.id,
          userId: record.user_id
        }
      })
    }
  }
  actions[command]()
}

const getRegions = () => {
  getCdnResolvRegionsListApi({ offset: 0 }).then(res => {
    const options = (res?.list ?? []).map(item => ({
      label: String(item.name),
      value: String(item.id)
    }))

    filterBarRef.value?.setFieldSchema('region_id', {
      attrs: {
        options: [{ label: '全部区域', value: '0' }].concat(...options)
      }
    })
  })
}

onActivated(() => {
  getRegions()
  if (route.query?.user_id) {
    filterBarRef.value?.setFieldValue('user_id_keyword', route.query?.user_id)
  }
  getList()
})
</script>
