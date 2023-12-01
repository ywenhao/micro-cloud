<template>
  <div class="table-tips">
    <vc-text-ell>
      <div><slot /></div>
    </vc-text-ell>
    <a-popover
      trigger="hover"
      background-color="#fff"
      class="table-tips-popover"
      position="right"
    >
      <vc-svg-icon
        :size="16"
        prefix="mts"
        class="table-tips-icon"
        :name="iconName"
      />
      <template #content>
        <div class="w-full table-tips-content">
          <template v-for="table in data" :key="table.title">
            <div class="tips-title">{{ table.title }}</div>
            <div class="tips-table">
              <div
                class="table-tr"
                v-for="item in table.list"
                :key="item.label"
              >
                <div class="left-box">
                  <div class="left-item">
                    {{ item.label }}
                  </div>
                </div>
                <div class="right-box">
                  <div class="right-item">
                    {{ item.value }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </a-popover>
  </div>
</template>

<script setup lang="ts">
import type { LabelValue } from 'vc-material'

const props = defineProps<{
  light?: boolean
  icon: 'help' | 'point' | 'warning'
  data: {
    title: string
    list: LabelValue[]
  }[]
}>()

const iconName = computed(() => {
  if (props.icon === 'help') {
    return props.light ? 'help-outline' : 'help'
  }
  return props.icon
})
</script>

<style lang="less">
.table-tips {
  display: inline-flex;
  align-items: center;
}
.table-tips-popover {
  .arco-popover-popup-content {
    padding-bottom: 16px;
    width: 464px;
    border: none;
  }
  .table-tips-content {
    font-size: 12px;
    color: #454954;
    letter-spacing: 0;
    line-height: 18px;
    font-weight: 400;
    .tips-title {
      font-size: 14px;
      color: var(--color-text-1);
      font-weight: 500;
      line-height: 20px;
    }
    .tips-table {
      margin-top: 8px;
      border: 1px solid var(--color-border-2);
      .table-tr {
        display: flex;
      }
      .left-item,
      .right-item {
        padding: 4px 8px;
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        word-break: break-all;
      }
      .left-box {
        display: flex;
        align-items: center;
        width: 80px;
        background-color: var(--color-fill-2);
        border-right: 1px solid var(--color-border-2);
        .left-item {
          color: var(--color-text-1);
        }
      }
      .table-tr + .table-tr {
        .left-box,
        .right-box {
          border-top: 1px solid var(--color-border-2);
        }
      }
      .right-box {
        flex: 1;
        .right-item {
          color: var(--color-text-2);
        }
      }
    }
  }
}
.table-tips-icon {
  cursor: pointer;
  margin-left: 4px;
}
</style>
