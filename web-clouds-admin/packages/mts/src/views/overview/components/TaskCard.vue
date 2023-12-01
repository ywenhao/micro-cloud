<template>
  <vca-card title="任务统计">
    <a-spin :loading="loading" class="w-full">
      <blue-card :data="data" />
    </a-spin>
  </vca-card>
</template>

<script setup lang="ts">
import { getMtsCollectStatusApi } from '@vca/apis/mts'
import { useRequest } from 'vc-material'

import type { DataType } from '@/components/BlueCard.vue'
import BlueCard from '@/components/BlueCard.vue'
import VcaCard from '@/components/VcaCard.vue'

const data: DataType[] = reactive([
  { label: '总任务数', value: null, unit: '个', key: 'total' },
  { label: '已成功', value: null, unit: '个', key: 'success' },
  { label: '成功率', value: null, unit: '%' },
  { label: '已失败', value: null, unit: '个', key: 'failed' },
  { label: '失败率', value: null, unit: '%' },
  { label: '待处理', value: null, unit: '个', key: 'queue' },
  { label: '处理中', value: null, unit: '个', key: 'process' }
])

const {
  loading,
  data: resData,
  run: getData
} = useRequest(getMtsCollectStatusApi)
getData()

watch(resData, resData => {
  if (!resData) return
  data.forEach(v => {
    if (v.key) {
      v.value = resData[v.key as keyof typeof resData]!
      return
    }
    if (v.label.includes('率') && !+resData.total!) {
      v.value = 0
      return
    }
    if (v.label === '成功率') {
      const res = (+resData.success! / +resData.total!) * 100
      v.value = res ? res.toFixed(2) : 0
    } else if (v.label === '失败率') {
      const res = (+resData.failed! / +resData.total!) * 100
      v.value = res ? res.toFixed(2) : 0
    }
  })
})
</script>
