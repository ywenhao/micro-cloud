<script setup lang="tsx">
import { SubAppLayout } from '@vcp/shared'

import TaskCenter from '@/components/task-center/TaskCenter.vue'
import { useAppStore } from '@/stores/modules/app'

import { asideList } from './config/sideList'

const useStore = useAppStore()

useStore.GET_REGION_DATA_LIST()
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
    <task-center />
  </a-config-provider>
</template>
