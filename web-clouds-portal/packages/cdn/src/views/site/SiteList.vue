<template>
  <vc-container header-bordered page-title="站点管理">
    <vc-filter-bar
      ref="filterBarRef"
      class="mb-4"
      v-model="filterData"
      :schemas="filterBarSchemes"
      @search="handleSearch"
    >
      <template #prefix>
        <a-button @click="handleCommand('create')" type="primary">
          添加站点
        </a-button>
      </template>
    </vc-filter-bar>
    <vc-table
      row-key="id"
      column-resizable
      :data="dataSource"
      :columns="columns"
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
          <span>查询中...</span>
        </div>
        <template v-if="resolveStats(record)?.status === -1">
          获取失败
        </template>
        <template v-if="resolveStats(record)?.status === 1">已解析</template>
        <template v-if="resolveStats(record)?.status === 2">未解析</template>
      </template>

      <template #cname_domain_title>
        CNAME域名
        <a-popover position="bottom" content-class="py-3!">
          <icon-question-circle class="cursor-pointer" />
          <template #content>
            如需使用CDN加速，需要配置加速域名指向CNAME，<br />配置CNAME后大约有10分钟延迟才会生效。
          </template>
        </a-popover>
      </template>

      <template #resolve_status_title>
        解析状态
        <a-popover position="bottom" content-class="py-3!">
          <icon-question-circle class="cursor-pointer" />
          <template #content>
            于域名DNS服务商添加CNAME记录后，完成解析，<br />CDN加速生效。
          </template>
        </a-popover>
      </template>

      <template #status="{ record }">
        <a-tag v-if="record?.status === 1" class="is-success">有效</a-tag>
        <a-tag v-else class="is-info">暂停</a-tag>
      </template>
      <template #actions="{ record }">
        <a-link :hoverable="false" @click="handleCommand('setup', record)">
          配置
        </a-link>
      </template>
    </vc-table>
    <editor-site @reload="getList" v-model="createVisible" />
  </vc-container>
</template>

<script setup lang="ts">
import { IconQuestionCircle } from '@arco-design/web-vue/es/icon'
import { getCdnSiteListApi } from '@vcp/apis/cdn'
import { useListRequest, useTable } from 'vc-material'

import { useResolveStatus } from '@/hooks/useResolveStatus'

import columns from './columns'
import EditorSite from './components/EditorSite.vue'
import filterBarSchemes from './filterBarSchemes'

const filterBarRef = ref()
const router = useRouter()

const { resolveStats, setKeys } = useResolveStatus()
const filterData = reactive({
  status: 0,
  title: '',
  content: ''
})

const {
  pagination,
  loading,
  run: getList,
  data: dataSource
} = useListRequest(getCdnSiteListApi, filterData)

const { createSortChange } = useTable(dataSource)

const handleSortChange = createSortChange(getList, filterData)

const handleSearch = () => {
  pagination.page = 1
  getList()
}

watchPostEffect(async () => {
  if (dataSource.value.length) {
    const keys = dataSource.value.map(({ id }) => String(id))

    setKeys(keys)
  }
})
const createVisible = ref(false)
type ICommand = 'setup' | 'create'

/** 事件处理集合 */
const handleCommand = (command: ICommand, record?: any) => {
  const actions: Record<ICommand, () => void> = {
    create() {
      createVisible.value = true
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

onActivated(() => {
  getList()
})
</script>
