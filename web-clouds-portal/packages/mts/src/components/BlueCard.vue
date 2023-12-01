<template>
  <div class="box">
    <div class="item" v-for="item in props.data" :key="item.label">
      <div class="label">{{ item.label }}</div>
      <div class="value" :class="isFail(item.label) && 'warning'">
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
</template>

<script setup lang="ts">
import { isNil } from 'lodash-es'

export type DataType = {
  key?: string | number
  label: string
  value: string | number | null
  unit: string
  timeUnit?: [time: string, unit: string][]
}

const props = defineProps<{
  data: DataType[]
}>()

function isFail(label: string) {
  return label.includes('失败')
}

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
.box {
  display: flex;
  align-items: center;
  padding: 16px 0;
  height: 84px;
  background: linear-gradient(
    180deg,
    rgba(232, 243, 255, 0.3) 0%,
    rgba(232, 243, 255, 0.1) 100%
  );
  border: 1px solid #f2f3f5;
  border-radius: 6px;
}
.item {
  flex: 1;
  padding-left: 24px;
  & + .item {
    border-left: 1px solid #f2f3f5;
  }
}

.label {
  font-size: 12px;
  color: var(--color-text-1);
  line-height: 18px;
}

.value {
  display: flex;
  align-items: baseline;
  color: rgb(var(--primary-6));
  line-height: 33.6px;
  .big-num {
    font-size: 28px;
    font-weight: 500;
  }
  .unit {
    margin-left: 2px;
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
  }
  &.warning {
    color: rgb(var(--warning-6));
  }
}
</style>
