<template>
  <div class="detail-table">
    <div class="table-tr" v-for="item in data" :key="item.label">
      <div class="table-label">
        <div class="t-cell">{{ item.label }}</div>
      </div>
      <div class="table-value">
        <div class="t-cell">
          <component :is="item.value" v-if="isVNode(item.value)" />
          <template v-else>
            {{ emptyText(item.value) }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { emptyText } from 'vc-material'
import type { VNode } from 'vue'
import { isVNode } from 'vue'

defineProps<{
  data: {
    label: string
    value: string | number | VNode | JSX.Element
  }[]
}>()
</script>

<style lang="less" scoped>
@border: 1px solid var(--color-border-1, #f2f3f5);
.detail-table {
  border: @border;
}
.table-tr {
  display: flex;
  width: 100%;
  & + .table-tr {
    border-top: @border;
  }
}
.table-label {
  border-right: @border;
  width: 176px;
}
.table-value {
  flex: 1;
}

.table-label,
.table-value {
  display: flex;
  align-items: center;
  padding-top: 14px;
  padding-bottom: 14px;
  padding-left: 16px;
  // min-height: 48px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
}
</style>
