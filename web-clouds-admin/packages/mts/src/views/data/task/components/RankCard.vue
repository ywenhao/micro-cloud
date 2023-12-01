<template>
  <div class="card-box">
    <div class="title">
      <div class="text">{{ title }}</div>
      <div class="more" v-if="onMore" @click="onMore">
        <span>更多</span>
        <vc-svg-icon name="arrow-right" prefix="mts" />
      </div>
    </div>
    <div class="body h-full">
      <empty-echarts v-if="!data.length" />
      <template v-else>
        <div class="row">
          <div v-for="t in titleArray" :key="t">
            <span>{{ t }}</span>
          </div>
        </div>
        <div class="row" v-for="(item, index) in data" :key="index">
          <div class="rank" :class="index > 2 && 'normal'">
            <span class="relative">
              <vc-svg-icon
                prefix="mts"
                class="rank-icon"
                v-if="index <= 2"
                :name="`rank-${index + 1}`"
              />
              <div class="num" :style="{ color: getColor(index) }">
                {{ index + 1 }}
              </div>
            </span>
          </div>
          <div v-for="i in item" :key="i">
            <span>{{ i }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EmptyEcharts } from '@vca/shared'

type Item = string | number

defineProps<{
  title: string
  data: [Item, Item][]
  titleArray: [string, string, string]
  onMore?: () => void
}>()

const rankColor = ['#E45C14', '#7C7F99', '#AD4A16']
const getColor = (index: number) => {
  if (index + 1 > rankColor.length) return '#86909C'
  return rankColor[index]
}
</script>

<style lang="less" scoped>
@border: 1px solid var(--color-border-1, #f2f3f5);
.card-box {
  width: 39.33%;
  // flex: 1;
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

.row {
  display: flex;
  justify-content: space-between;
  color: var(--color-text-1, #1d2129);
  & + .row {
    border-top: @border;
  }
  &:first-child {
    color: var(--color-text-3, #86909c);
  }
  .rank-icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 16px;
    height: 18px;
  }
  & > div {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 38px;

    &:nth-child(1) {
      width: 72px;
    }
    &:nth-child(2) {
      flex: 1;
    }
    &:nth-child(3) {
      justify-content: end;
      padding-right: 24px;
      width: 137px;
    }
  }
}

.rank {
  span {
    display: inline-block;
    width: 16px;
    height: 18px;
  }
  .num {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &.normal {
    span {
      padding: 0 8px;
      background: var(--color-fill-2, #f2f3f5);
      border-radius: 4px;
    }
  }
}
</style>
