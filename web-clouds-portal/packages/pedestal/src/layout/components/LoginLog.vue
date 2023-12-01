<template>
  <a-drawer
    width="900px"
    :footer="false"
    v-model:visible="visible"
    title="登录记录"
    @open="getList()"
  >
    <vc-table
      :columns="columns"
      @get-list="getList()"
      :loading="loading"
      :data="dataSource"
      :page-data="pagination"
    />
  </a-drawer>
</template>

<script setup lang="ts">
import { userLoginLogApi } from '@vcp/apis/pedestal'
import { useListRequest } from 'vc-material'

import { columns } from './loginLogColumns'

const props = defineProps<{
  modelValue: boolean
}>()

const visible = useVModel(props, 'modelValue')

const {
  run: getList,
  pagination,
  loading,
  data: dataSource
} = useListRequest(userLoginLogApi)
</script>
