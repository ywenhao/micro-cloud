<template>
  <a-popover
    v-model:popup-visible="visible"
    position="bl"
    content-class="vcp-products-popover"
    :arrow-style="{ display: 'none' }"
    trigger="hover"
  >
    <slot></slot>
    <template #content>
      <div class="vcp-products-popover__products">
        <div
          v-for="item in products"
          :key="item.symbol"
          class="products-item"
          @click="handleProductClick(item)"
        >
          <a-image :src="item.icon" :preview="false">
            <template #error>
              <vc-svg-icon
                :size="iconSize"
                :name="defaultIcon(item.symbol)"
              ></vc-svg-icon>
            </template>
          </a-image>
          <p class="products-item-name">
            {{ item.name }}
          </p>
        </div>
      </div>
    </template>
  </a-popover>
</template>

<script lang="ts" setup name="VcButton">
import { ref } from 'vue'

import { products as defaultProducts } from '..'

interface ProductsPopoverItem {
  name: string
  symbol: string
  icon: string
}

const visible = ref(false)

const props = withDefaults(
  defineProps<{
    products: ProductsPopoverItem[]
    iconSize?: number
    // 选中之后是否关闭浮层
    selectedClose?: boolean
  }>(),
  {
    products: () => [],
    iconSize: 60,
    selectedClose: true
  }
)

const emit = defineEmits<{
  (event: 'select', item: ProductsPopoverItem): void
}>()

const handleProductClick = (data: ProductsPopoverItem) => {
  emit('select', data)
  if (props?.selectedClose) {
    visible.value = false
  }
}

const defaultIcon = (symbol: string) => {
  const s = symbol.toLowerCase()
  const icon = defaultProducts.find(item => item.symbol === s)?.icon
  if (!icon) {
    console.error(`产品图标不存在: ${symbol}`)
  }
  return icon || ''
}
</script>

<style lang="less">
.vcp-products-popover {
  padding: 24px !important;
  margin-top: 12px;
  margin-left: -80px;
  width: max-content !important;

  /* 边框/浅 */
  border: 1px solid var(--color-border-1);
  border-radius: 12px !important;
  inset: 58px auto auto 78px !important;

  .vcp-products-popover__products {
    display: flex;
    flex-wrap: nowrap;
    column-gap: 8px;
    font-size: 14px;
    .products-item {
      display: flex;
      align-items: center;
      padding: 16px;
      width: 160px;
      height: 112px;
      background: rgba(255, 255, 255, 1e-5);

      /* 边框/浅 */
      border: 1px solid var(--color-border-1);
      border-radius: 6px;
      transition: 0.3s;
      flex-direction: column;
      cursor: pointer;
      &:hover {
        /* 品牌色/浅色 白底悬浮 */
        background: rgb(var(--primary-1));
        border-color: rgb(var(--primary-1));
        border-radius: 6px;
      }
      &-name {
        @apply w-full m-0 text-truncate text-center;
      }
      .arco-image,
      .arco-image-img {
        width: 60px;
        height: 60px;
      }
    }
  }
}
</style>
