<template>
  <div class="card-box">
    <div class="title">
      <div class="text">转码时长-总量</div>
    </div>
    <div class="body">
      <div class="item" v-for="item in data" :key="item.label">
        <div class="label">{{ item.label }}</div>
        <div class="value">
          <span class="color-ct-1" v-if="isEmpty(item)">-</span>
          <template v-else>
            <template v-if="item.timeUnit">
              <template v-for="(val, index) in item.timeUnit" :key="index">
                <div class="big-num">{{ val[0] }}</div>
                <div class="unit ml-0">{{ val[1] }}</div>
              </template>
            </template>
            <template v-else>
              <div class="big-num">{{ getValue(item.value!, item.unit) }}</div>
              <div class="unit ml-4px">{{ item.unit }}</div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isNil } from 'lodash-es'

import type { DataType } from '@/components/BlueCard.vue'

defineProps<{
  data: DataType[]
}>()

function getValue(value: number | string, unit: string) {
  if (unit === '%') {
    return `${value}`
  }
  return Number(value).toLocaleString()
}

function isEmpty(item: DataType) {
  if (item.timeUnit) {
    return item.timeUnit.every(v => isNil(v[0]) || (v[0] === '0' && !v[1]))
  }
  return isNil(item.value) || (String(item.value) === '0' && !item.unit)
}
</script>

<style lang="less" scoped>
@border: 1px solid var(--color-border-1, #f2f3f5);
.card-box {
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

.body {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.item {
  display: grid;
  width: 100%;
  height: 120px;
  place-content: center;

  &:nth-child(1),
  &:nth-child(2),
  &:nth-child(3) {
    border-bottom: @border;
  }
  &:nth-child(2),
  &:nth-child(5) {
    border-left: @border;
    border-right: @border;
  }
}

.label {
  text-align: center;
  color: var(--color-text-3, #86909c);
}

.value {
  display: flex;
  align-items: baseline;
  color: rgb(var(--primary-6));
  .big-num {
    font-size: 28px;
    font-weight: 400;
    line-height: 33.6px;
  }
  .unit {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  }
}
</style>
