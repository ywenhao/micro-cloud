<template>
  <vc-dialog v-model="visible" title="告警详情" :mask-close="true">
    <a-alert type="error">
      <template #icon>
        <vc-svg-icon name="error" :size="20" />
      </template>
      <div>
        <div class="sub-title">{{ title }}</div>
        <div class="desc mt-1 color-ct-1" v-if="record?.desc">
          {{ record?.desc }}
        </div>
        <div class="mt-2 color-ct-3 text-14px leading-22px">
          告警时间：{{ formatUnix(+record?.time!) }}
        </div>
      </div>
    </a-alert>
    <vc-scrollbar class="mt-2">
      <div v-if="record" class="alarm-content">
        <div
          class="item"
          v-for="item in record.list"
          :key="item.value! + item.key!"
        >
          <div class="key" v-if="item.key">{{ item.key }}</div>
          <div class="value">{{ item.value }}</div>
        </div>
      </div>
    </vc-scrollbar>
  </vc-dialog>
</template>

<script setup lang="ts">
import type { AlarmModel } from '@vca/apis/pedestal'
import { formatUnix } from 'vc-material'

defineProps<{
  title: string
  record?: AlarmModel
}>()

const visible = defineModel<boolean>({ required: true })
</script>

<style lang="less" scoped>
.vc-scrollbar,
:deep(.vc-scrollbar__wrap) {
  max-height: 208px;
}

.alarm-content {
  padding: 0 16px;
  background-color: var(--color-fill-1);
  border-radius: 6px;
  .item {
    display: flex;
    justify-content: space-between;
    padding: 16px 0;
    gap: 16px;
    border-bottom: 1px dashed var(--color-border-2);
    &:last-child {
      border-bottom: none;
    }
    .key {
      white-space: nowrap;
    }
    .value {
      white-space: wrap;
      color: rgb(var(--danger-6));
      word-break: break-all;
    }
  }
}
</style>
