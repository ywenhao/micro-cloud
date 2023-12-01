<template>
  <vc-container
    admin
    class="rounded-sm! space-link-domain"
    page-title="空间外链域名"
  >
    <a-tabs v-model="state.region_id" @change="handleChange">
      <a-tab-pane
        v-for="item in REGION_LIST_DATA"
        :key="item.value"
        :title="item.label"
      >
      </a-tab-pane>
    </a-tabs>
    <vc-filter-bar
      class="mb-4"
      ref="filterBarRef"
      @search="handleSearch"
      v-model="state"
      :schemas="filterBarScheme"
    >
    </vc-filter-bar>
    <vc-table
      class="mt-4"
      row-key="id"
      :data="dataSource"
      :columns="columns"
      @sorter-change="handleSortChange"
      :page-data="arcoPagination"
      :loading="loading"
    >
      <template #names="{ record }">
        <div
          v-for="item in record.names"
          :key="item"
          class="flex flex-col w-full items-start gap-y-1"
        >
          <vc-text-ell>{{ item }}</vc-text-ell>
        </div>
      </template>
      <template #cname_prefixes="{ record }">
        <div
          v-for="item in record.c_names"
          :key="item"
          class="flex flex-col w-full overflow-hidden items-start gap-y-1"
        >
          <vc-text-ell>{{ item }}</vc-text-ell>
        </div>
      </template>
      <template #region_id="{ record }">
        {{ regionName(record.region_id) }}
      </template>
      <template #actions="{ record }">
        <a-link
          :hoverable="false"
          @click="handleDelete(record)"
          type="primary"
          status="danger"
        >
          删除
        </a-link>
      </template>
    </vc-table>
  </vc-container>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { delLinkDomainApi, spaceLinkDomainListApi } from '@vca/apis/oss'
import { useListRequest, useTable } from 'vc-material/hooks'
import { VcModal } from 'vc-material/utils'

import { REGION_LIST_DATA } from '@/components/SelectData'

import columns from './columns'
import filterBarScheme from './filterBarScheme'

const state = reactive({
  region_id: ''
})

const {
  arcoPagination,
  loading,
  data: dataSource,
  run: getTableList
} = useListRequest(spaceLinkDomainListApi, state, {
  showPageSize: true,
  showTotal: true
})

const handleChange = (value: string | number) => {
  state.region_id = value as string
  getTableList()
}

const handleSearch = () => {
  getTableList()
}
const { createSortChange } = useTable(dataSource)

const handleSortChange = createSortChange(getTableList, state)

const regionName = computed(() => (id: string) => {
  let name = '-'
  REGION_LIST_DATA.value.some(({ value, label }) => {
    value === id ? (name = label) : ''
  })
  return name
})

const handleDelete = (record?: any) => {
  const request = () =>
    delLinkDomainApi({
      bucket_id: record!.bucket_id! as string,
      ids: record!.ids!
    }).then(() => {
      Message.success('删除成功')
      getTableList()
    })
  VcModal.error(
    {
      title: '删除空间外链域名',
      content: '删除后用户端所有外链域名将被删除，请谨慎操作！'
    },
    request
  )
}

onMounted(() => {
  getTableList()
})
</script>

<style scoped lang="less">
.space-link-domain {
  :deep(.vc-container__header) {
    @apply border-none!;
  }
  :deep(.vc-container__content) {
    @apply pt-2!;
  }
}
</style>
