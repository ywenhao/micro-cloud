<template>
  <div class="stat-card">
    <div v-for="item in data" :key="item.key" class="stat-card__container">
      <div class="stat-card__item">
        <div class="item-top">
          <span class="item-label">{{ item.label }}</span>
          <a-tooltip
            position="bottom"
            background-color="white"
            :content="item.des"
            content-class="tool-content"
          >
            <icon-question-circle size="16" />
          </a-tooltip>
        </div>
        <span class="item-num num">{{ item.num }}</span>
      </div>
      <a-divider direction="vertical"></a-divider>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { IconQuestionCircle } from '@arco-design/web-vue/es/icon'

import type { DataView } from '@/types/applyList'
interface IProps {
  data: DataView[]
}
withDefaults(defineProps<IProps>(), {})
</script>
<style lang="less" scoped>
.stat-card {
  display: flex;
  justify-content: space-around;
  padding: 16px 24px;
  background: linear-gradient(
    180deg,
    rgba(232, 243, 255, 0.3) 0%,
    rgba(232, 243, 255, 0.1) 100%
  );
  border: 1px solid var(--color-border-1, #f2f3f5);
  border-radius: 6px;
  flex-direction: row;
  &__container {
    display: flex;
    flex-direction: row;
    flex: 1;
    justify-content: space-between;
    .arco-divider-vertical {
      margin: 0 24px;
      height: 100%;
      border-color: var(--color-border-1);
    }
    &:last-child .arco-divider-vertical {
      display: none;
    }
  }
  &__item {
    display: flex;
    min-width: 88px;
    height: 100%;
    flex-direction: column;
    row-gap: 8px;

    .item-top {
      display: flex;
      flex-direction: row;
      column-gap: 4px;
      align-items: center;
      .item-label {
        font-size: 12px;
        color: var(--color-text-1);
      }
      .arco-icon {
        color: var(--color-border-4);
      }
    }
    .item-num {
      font-size: 28px;
      color: rgb(var(--primary-6));
    }
  }
}
</style>
