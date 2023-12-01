<script setup lang="tsx">
import { SubAppLayout } from '@vcp/shared'

import { asideList } from './config/sideList'
</script>

<template>
  <a-config-provider update-at-scroll scroll-to-close>
    <template #empty="{ component }">
      <div class="flex flex-col items-center justify-center py-8">
        <vc-svg-icon
          :size="component === 'table' ? 104 : 74"
          name="empty"
        ></vc-svg-icon>
        <span class="text-ct-3">暂无数据</span>
      </div>
    </template>
    <sub-app-layout
      :menus="asideList"
      :has-side-bar="!!$route.meta.hasSideBar"
      class="vc-cdn"
    />
  </a-config-provider>
</template>
