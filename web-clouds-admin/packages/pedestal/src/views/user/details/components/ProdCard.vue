<template>
  <a-card class="prod-card">
    <template #title>
      <div class="w-full flex flex-row gap-x-2 justify-center items-center">
        <product-icon :preview="false" :record="data.icon" />
        <span class="text-base text-ct-1">{{ data.name }}</span>
      </div>
    </template>
    <a-descriptions
      class="mt-5"
      :data="data.content"
      size="medium"
      :column="1"
    />
    <i class="flex-1 flex-shrink"></i>
    <a-button type="outline" class="text-ct-2! w-full h-11!" @click="toPortal">
      前往管理
      <icon-right />
    </a-button>
  </a-card>
</template>
<script lang="ts" setup>
import { IconRight } from '@arco-design/web-vue/es/icon'

import type { CardInfo } from '../type'

interface IProps {
  data: CardInfo
}
const props = withDefaults(defineProps<IProps>(), {})
const route = useRoute()
const router = useRouter()

const toPortal = () => {
  const { href } = router.resolve({
    path: props.data.portal,
    query: { user_id: route.params?.userId }
  })
  window.open(href)
}
</script>
<style lang="less" scoped>
.prod-card {
  display: flex;
  padding: 24px;
  height: 332px;
  flex-direction: column;
  :deep(.arco-card-header) {
    padding: 0;
    padding-bottom: 24px;
    // .arco-card-header-title {
    // }
    height: 64px;
    border-bottom: 1px dashed var(--color-border-2, #e5e6eb);
  }
  :deep(.arco-card-body) {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    padding: 0;
    .arco-descriptions {
      margin-top: 24px !important;
      margin-bottom: 24px !important;
      width: 100%;
      .arco-descriptions-item-value,
      .arco-descriptions-item-label {
        padding-right: 0;
      }
      .arco-descriptions-item-value {
        text-align: right !important;
      }
    }
  }
}
</style>
