<template>
  <vc-container
    admin
    header-bordered
    class="rounded-sm! region-manage"
    page-title="外链调度域名"
  >
    <template #description>
      作用于用户空间的外链调度域名，用来给用户空间生成CNAME，使用户在配置空间外链域名后，访问用户自己绑定的外链域名时，能够最终指向这个调度域名。<br />
      作用于区域的外链调度域名，用来指向区域，用户在使用自己配置的外链域名访问文件时，最终会根据用户配置空间时选择的区域，指向该区域对应的域名。
    </template>
    <vc-filter-bar
      v-model="state"
      :loading="loading"
      :schemas="filterBarScheme"
      @search="handleSearch"
    >
      <template #prefix>
        <a-button type="primary" @click="handleAddDomain"
          >设置用户空间域名</a-button
        >
      </template>
    </vc-filter-bar>

    <a-table
      column-resizable
      :bordered="false"
      :loading="loading"
      :columns="columns"
      :data="dataSource"
      class="mt-4"
      :pagination="arcoPagination"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
      @sorter-change="handleSorterChange"
    >
      <template #usage_type="{ record }">
        <span v-if="record.usage_type === 1">区域</span>
        <span v-if="record.usage_type === 3">用户空间</span>
      </template>
    </a-table>
    <create-domain
      v-model="domainState.visible"
      v-model:loading="domainState.loading"
      v-model:record="domainState.record"
      @reload="handleReload"
    />
  </vc-container>
</template>

<script setup lang="tsx">
import { chainDomainListApi, userOutDomainApi } from '@vca/apis/oss'
import { useListRequest } from 'vc-material'

import columns from './columns'
import CreateDomain from './CreateDomain.vue'
import filterBarScheme from './filterBarScheme'

const state = ref({
  sub_product_type: 2,
  usage_status: 1
})
const {
  arcoPagination,
  loading,
  data: dataSource,
  run: getTableList
} = useListRequest(chainDomainListApi, state, {
  showPageSize: true,
  showTotal: true
})

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
  state.value.order = direction ? direction.replace('end', '') : undefined
  // @ts-ignore
  state.value.sort = direction ? dataIndex : undefined
  getTableList()
}

const handleSearch = () => {
  getTableList()
}

const domainState = reactive<CommonState<any>>({
  visible: false,
  record: undefined,
  loading: false
})

/**设置空间外链域名 */
const handleAddDomain = () => {
  domainState.visible = true
}

/**获取用户空间域名 */
const getUserDomain = async () => {
  const res = await userOutDomainApi({})
  domainState.record = {
    id: res.domain_id,
    name: res.domain_name
  }
}

const handleReload = () => {
  getTableList()
  getUserDomain()
}

onMounted(() => {
  getTableList()
  getUserDomain()
})
</script>

<style scoped lang="less">
.region-manage {
  .vc-filter-bar {
    column-gap: 8px;
  }
}
</style>
<style lang="less">
.delete-tigger {
  width: 300px;
  border: 1px solid #f2f3f5;
  box-shadow: 0px 5px 10px #f2f3f5;
  @apply bg-white;
}
.arco-tooltip-popup-arrow {
  background: #fff !important;
  box-shadow: 0px 5px 15px #a29e9e;
}
</style>
