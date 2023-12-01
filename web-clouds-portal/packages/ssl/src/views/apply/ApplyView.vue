<template>
  <vc-container page-title="申请列表">
    <statistic-card :data="applyDataOverview" class="mt-4"></statistic-card>
    <vc-filter-bar
      v-model="state"
      :schemas="filterBarScheme(true, 2)"
      @search="handleSearch"
      @refresh="getList()"
      class="my-4"
    >
      <template #prefix>
        <a-button type="primary" @click="handleApplyAndVerify('apply', false)"
          >申请证书</a-button
        >
        <a-button type="outline" @click="handleApplyAndVerify('apply', true)"
          >批量申请</a-button
        >
      </template>
    </vc-filter-bar>
    <vc-table
      row-key="id"
      ref="tableRef"
      :data="tableData || []"
      :columns="columns"
      :page-data="pagination"
      :loading="loading"
      v-model:selectedKeys="selectedKeys"
      is-selection
      @sorter-change="handleSortChange"
      @get-list="getList()"
    >
      <template #remark="{ record }">
        <span v-if="record.status === 3" v-table-cell="record.desc"></span>
        <vc-remark-input
          v-else
          :content="record.desc"
          :on-submit="(v:string) => editRemark(record, v)"
        ></vc-remark-input>
      </template>
      <template #optional="{ record }">
        <div class="flex flex-row items-center justify-start">
          <a-link @click="handleCommand('details', record)">详情</a-link>
          <a-link
            v-show="[2, 3].includes(record.status)"
            @click="handleCommand('cancel', record)"
          >
            取消申请</a-link
          >
          <a-link
            v-show="record.status === 2"
            @click="handleApplyAndVerify('verify', false, record)"
            >验证</a-link
          >
        </div>
      </template>
      <template #pagination-left>
        <a-checkbox v-model="checkAll" :indeterminate="indeterminate" />
        <a-button
          type="outline"
          :disabled="batchDisabled"
          @click="handleCommand('cancel', selectedKeys)"
          >取消申请</a-button
        >
      </template>
    </vc-table>
    <apply-details
      v-model:visible="detailDraw.visible"
      v-model:apply-id="detailDraw.record"
    ></apply-details>
    <apply-license-draw
      v-model:visible="applyDraw.visible"
      v-model:data="applyDraw.data"
      :command="applyDraw.command"
      :is-batch="applyDraw.isBatch"
      @update-list="handleUpdate"
      title="申请证书"
    ></apply-license-draw>
  </vc-container>
</template>
<script lang="ts" setup>
// import 'vc-material/theme-chalk/table.css'

import { Message } from '@arco-design/web-vue'
import { applyListApi, editRemarkApi } from '@vcp/apis/src/ssl'
import { useListRequest, useTable } from 'vc-material/hooks'

import { ApplyLicenseDraw } from '@/components/business/'
import ApplyDetails from '@/components/business/ApplyDetails.vue'
import StatisticCard from '@/components/business/StatisticCard.vue'
import { filterBarScheme } from '@/config/'
import { tableColumn } from '@/config/index'
import useStatistic from '@/hooks/useStatistic'
import useTableColumn from '@/hooks/useTableColumn'
import type { ApplyCommand, ApplyListItem } from '@/types/applyList'

const columns = tableColumn(true)
const state = ref({
  sort: '',
  order: ''
})
// 获取列表数据
const {
  pagination,
  loading,
  run: getList,
  data: tableData
} = useListRequest(applyListApi, state)

const { applyDataOverview, getStatistic } = useStatistic({ apply: true })
// 列表hooks
const {
  tableRef,
  selectedKeys,
  selected,
  checkAll,
  indeterminate,
  createSortChange
} = useTable(tableData)

const { detailDraw, handleCommand } = useTableColumn(handleUpdate)
// 修改备注
const editRemark = async (record: ApplyListItem, v: string) => {
  const data = {
    id: record.id ?? '',
    desc: v,
    is_check: 2
  }
  try {
    await editRemarkApi(data).then(() => {
      Message.success('修改成功')
      getList()
    })
  } catch (e) {
    Message.error('请求错误，请稍后重试')
  }
}
const handleSearch = (arg: any) => {
  pagination.page = 1
  getList(arg)
}

function handleUpdate() {
  getList()
  getStatistic()
}

// 排序
const handleSortChange = createSortChange(getList, state)

// 多选按钮禁用
const batchDisabled = computed(() => {
  // 是否存在非申请中状态的项
  const list = [1, 4, 5]
  const flag = selected.value.find(item => list.includes(item.status ?? 1))
  return selectedKeys.value.length < 1 || !!flag
})

/**
 * 申请或验证抽屉
 */
const applyDraw = reactive<any>({
  visible: false,
  record: undefined,
  command: 'apply',
  isBatch: false,
  data: undefined
})

/**申请或验证事件
   * @params
   *apply:申请/验证
   batch:批量或单个申请
   */
const handleApplyAndVerify = (
  command: ApplyCommand,
  batch: boolean,
  record?: ApplyListItem
) => {
  applyDraw.command = command
  applyDraw.isBatch = batch ? true : false
  applyDraw.visible = true

  applyDraw.data = record
}
onMounted(() => {
  getList()
})
</script>
<style lang="less" scoped>
.apply-list {
  @apply p-6 rounded-sm! bg-white h-full w-full;
}

:deep(.user-cell) {
  color: rgb(var(--primary-6));
  cursor: pointer;
}
</style>
