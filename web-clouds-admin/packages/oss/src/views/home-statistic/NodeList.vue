<template>
  <a-table
    :columns="columns"
    :data="(nodeFiveList as any[])"
    :pagination="false"
    :scroll="scroll"
    class="oss-statistic-list"
  >
    <template #used_kb="{ record }">{{
      convertByte(Number(record.used_kb) * 1024)
    }}</template>
    <template #total_kb="{ record }">{{
      convertByte(Number(record.total_kb) * 1024)
    }}</template>
    <template #rate="{ record }"
      >{{
        record.total_kb
          ? ((+record.used_kb / +record.total_kb) * 100).toFixed(2)
          : 0
      }}%</template
    >
  </a-table>
</template>

<script setup lang="ts">
import { convertByte } from 'vc-material'

const nodeFiveList = defineModel<any>('nodeFiveList')

const scroll = {
  y: 146
}

const columns = [
  {
    title: '节点',
    dataIndex: 'region_name'
  },
  {
    title: '已用',
    dataIndex: 'used_kb',
    slotName: 'used_kb'
  },
  {
    title: '总量',
    dataIndex: 'total_kb',
    slotName: 'total_kb'
  },
  {
    title: '使用率',
    dataIndex: 'rate',
    slotName: 'rate'
  }
]
</script>

<style scoped lang="less">
.oss-statistic-list {
  @apply h-172px!;
  :deep(.arco-table-cell) {
    @apply py-3px!;
  }
}
</style>
