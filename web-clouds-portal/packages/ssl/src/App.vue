<script setup lang="tsx">
import { SubAppLayout } from '@vcp/shared'

import type { UserData } from '@/config/provideKeys'
import { userDataKey } from '@/config/provideKeys'

import { asideList } from './config/sideList'
// import { APP_TITLE } from './config'
// // import LayoutDefault from './layout/LayoutDefault.vue'
const data: UserData = (window.microApp?.getData() as UserData) || {}
provide(userDataKey, data)
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
    />
  </a-config-provider>
</template>
