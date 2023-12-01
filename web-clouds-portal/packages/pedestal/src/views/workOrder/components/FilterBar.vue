<template>
  <vc-filter-bar
    ref="filterBarRef"
    :schemas="filterBarScheme"
    :loading="loading"
    v-model:page="pagination.page"
    @search="emit('search')"
    v-model="state"
  >
    <template #prefix>
      <a-button
        type="primary"
        @click="$router.push({ name: 'WorkOrderSubmit' })"
        >提交工单</a-button
      >
    </template>
  </vc-filter-bar>
</template>

<script setup lang="ts">
import {
  queryWorkerOrderTypeByIdApi,
  queryWorkerProductListApi
} from '@vcp/apis/pedestal'
import type { Pagination, VcFilterBarInstance } from 'vc-material'

import { filterBarScheme } from './filterBarScheme'
// import { VcMultipartSearch, VcRefreshButton } from 'vc-material'

const filterBarRef = ref<VcFilterBarInstance>()

type IState = {
  product_id: string
  type_id: string
  title: string
}

const props = defineProps<{
  loading: boolean
  pagination: Pagination
  modelValue: IState & Record<string, any>
}>()

const state = useVModel(props, 'modelValue')
const pagination = useVModel(props, 'pagination')

const emit = defineEmits<{
  'update:modelValue': [val: IState & Record<string, any>]
  'update:pagination': [val: Pagination]
  search: []
}>()

const productList = ref<LabelValue[]>([])
async function setWorkerProductSelect() {
  filterBarRef.value?.setFieldAttrs('product_id', {
    loading: true
  })
  try {
    const res = await queryWorkerProductListApi()
    productList.value =
      res.list?.map(v => ({
        value: v.product_id!,
        label: v.product_name!
      })) || []
    filterBarRef.value?.setFieldAttrs('product_id', {
      options: [{ label: '全部产品', value: '' }, ...productList.value]
    })
  } finally {
    filterBarRef.value?.setFieldAttrs('product_id', { loading: false })
  }
}

onMounted(() => {
  setWorkerProductSelect()
})

const typeOpts = ref<LabelValue[]>([])
watch(
  () => state.value.product_id,
  id => {
    if (id) {
      filterBarRef.value?.setFieldAttrs('type_id', { loading: true })
      queryWorkerOrderTypeByIdApi({ product_id: id })
        .then(res => {
          typeOpts.value =
            res.list?.map(v => ({ value: v.id!, label: v.name! })) || []
          filterBarRef.value?.setFieldAttrs('type_id', {
            options: [{ value: '', label: '全部类型' }, ...typeOpts.value]
          })
        })
        .finally(() => {
          filterBarRef.value?.setFieldAttrs('type_id', { loading: false })
        })
    }
  }
)

watch(
  () => state.value.product_id,
  () => (state.value.type_id = '')
)

watchPostEffect(() => {
  const val = state.value.product_id
  filterBarRef.value?.setFieldAttrs('type_id', { disabled: !val })
})
</script>
