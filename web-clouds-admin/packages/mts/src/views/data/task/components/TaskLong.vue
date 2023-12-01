<template>
  <div class="card-box">
    <div class="title">
      <div class="text">任务时长占比</div>
      <div class="more" v-if="onMore" @click="onMore">
        <span>更多</span>
        <vc-svg-icon name="arrow-right" prefix="mts" />
      </div>
    </div>
    <div class="echarts-box w-full h-238px" ref="el"></div>
  </div>
</template>

<script setup lang="ts">
import { preStyleOptions, useCharts } from 'vc-material'
type Item = { value: string | number; name: string }

const props = defineProps<{
  data: Item[]
  onMore: () => void
}>()
const { el, onUpdate } = useCharts()

const mergeOptions = {
  legend: {
    icon: 'rect',
    orient: 'vertical',
    itemWidth: 6,
    itemHeight: 6,
    itemGap: 16,
    show: true,
    right: 44,
    top: 65,
    bottom: 20,
    data: ['<=60s', '1-30min', '31-60min', '>60min']
  },
  color: ['#5775FF', '#31D9A4', '#8F83FF', '#F7DB57']
}
const useUpdatePie = (data: Item[]) => {
  const options = preStyleOptions(data, {}, mergeOptions)
  onUpdate(options)
}

watch(
  () => props.data,
  v => {
    if (v) {
      useUpdatePie(v)
    }
  },
  {
    deep: true,
    immediate: true
  }
)
</script>
<style lang="less" scoped>
@border: 1px solid var(--color-border-1, #f2f3f5);
.card-box {
  // width: 29.64%;
  flex: 1;
  font-size: 12px;
  border: @border;
  border-radius: 6px;
  font-weight: 400;
  line-height: 18px;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  font-size: 14px;
  background: var(--color-fill-1, #f7f8fa);
  line-height: 20px;
  .text {
    color: var(--color-text-1, #1d2129);
    font-weight: 500;
  }
}
.more {
  display: flex;
  align-items: center;
  color: var(--color-text-3, #86909c);
  cursor: pointer;
  font-weight: 400;
  line-height: 1;
  &:hover {
    opacity: 0.85;
  }
}
</style>
