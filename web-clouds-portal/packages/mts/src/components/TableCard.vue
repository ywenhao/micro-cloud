<template>
  <div class="table-card">
    <div
      class="table-td"
      v-for="item in data"
      :key="item.label"
      :style="{ 'grid-column': item.span ? `span ${item.span}` : '' }"
    >
      <div class="table-label">
        <div>{{ item.label }}</div>
      </div>
      <div class="table-value">
        <div>
          <component
            :is="item.value"
            v-if="item.value && typeof item.value === 'object'"
          />
          <template v-else>
            {{ emptyText(item.value) }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { emptyText } from 'vc-material'
import type { VNode } from 'vue'

export type TableCardItem = {
  label: string
  value: string | JSX.Element | VNode
  span?: number
}

defineProps<{
  data: TableCardItem[]
}>()

const col = 3

// const gridColumn = (index: number = 1) => {
//   if (index !== props.data.length - 1) return ''
//   const rest = (index + 1) % col
//   if (rest === 0) return 'span 1'
//   const n = col - rest + 1
//   return `span ${n}`
// }
</script>

<style lang="less" scoped>
@border: 1px solid var(--color-border-2, #e5e6eb);

.table-card {
  display: grid;
  grid-template-columns: v-bind('"repeat(" + col + ", 1fr)"');
  grid-auto-flow: dense;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  border-left: @border;

  .table-td {
    display: flex;
  }
}
.table-label {
  width: 80px;
  color: var(--color-text-3, #86909c);
  background: var(--color-fill-1, #f7f8fa);
}
.table-value {
  flex: 1;
  color: var(--color-text-1, #1d2129);
}
.table-label,
.table-value {
  display: flex;
  align-items: center;
  padding-left: 12px;
  margin: -1px 0 0 -1px;
  height: 40px;
  border: @border;
}
</style>
