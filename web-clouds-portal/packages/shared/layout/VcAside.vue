<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { Aside } from '.'

const props = defineProps<{
  menus: Aside<string>[]
}>()

const router = useRouter()
const route = useRoute()

const key = ref<string>()

const asideList = computed(() =>
  key.value
    ? props.menus.find(
        item => item.key.toLowerCase() === key.value?.toLowerCase()
      )! || {}
    : props.menus[0]
)

const handleMenuSelect = (name: string) => {
  if (name === route.name) return
  const m = props.menus.map(v => v.menus).flat()
  const item = m.find(item => item.name === name)
  router.push(item?.path || { name })
}

const defaultActive = computed(() => {
  return (route.meta?.currentActive as string) || (route.name as string)
})

const selectedKeys = ref([defaultActive.value])

watchEffect(() => {
  if (defaultActive.value) {
    key.value = props.menus.find(v =>
      v.menus.some(item => item.name === defaultActive.value)
    )?.key
    selectedKeys.value = [defaultActive.value]
  }
})
</script>

<template>
  <div class="vc-aside" w200px bg-color="#fff">
    <div
      h48px
      mb8px
      px20px
      font-500
      leading-48px
      border-b="1px solid"
      text="16px"
      class="aside-title"
    >
      {{ asideList.title }}
    </div>
    <vc-menu
      auto-open-selected
      v-model:selectedKeys="selectedKeys"
      @menu-item-click="handleMenuSelect"
      :menus="asideList?.menus || []"
    />
  </div>
</template>

<style lang="less" scoped>
.aside-title {
  color: var(--color-text-3);
  border-color: var(--color-border-1);
}
.vc-aside {
  background-color: #fff;
  :deep(.arco-menu-item),
  :deep(.arco-menu-inline-header) {
    &::before {
      display: none;
    }
  }
  :deep(svg) {
    width: 18px;
    height: 18px;
    color: #fff;
  }
}
</style>
