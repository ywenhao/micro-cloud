<template>
  <a-drawer
    v-model:visible="modelValue"
    title="任务中心"
    :width="856"
    :esc-to-close="false"
    :mask-closable="false"
    :footer="false"
    class="is-admin task-center-drawer"
  >
    <a-alert class="" type="warning">
      <template #icon> <icon-info-circle-fill /> </template>
      刷新页面或离开云存储 OSS 会终止所有任务并清空任务记录
    </a-alert>
    <a-tabs
      lazy-load
      class="mt-6"
      v-model:active-key="taskActive"
      :destroy-on-hide="true"
    >
      <a-tab-pane key="file" title="文件上传" />
      <a-tab-pane key="catalogDel" title="目录删除" />
    </a-tabs>
    <task-filter
      v-model:status="status"
      :allStopDisabled="allStopDisabled"
      :allRetryDisabled="allRetryDisabled"
      :cleanDisabled="cleanDisabled"
      @all-retry="handleAllRetry"
      @clean="handleClean"
      @all-stop="handleAllStop"
    />
    <file-list v-if="taskActive === 'file'" :status="status" />
    <del-catalog
      :status="status"
      v-if="taskActive === 'catalogDel'"
      ref="delCatalogRef"
    />
  </a-drawer>
</template>

<script setup lang="ts">
import { IconInfoCircleFill } from '@arco-design/web-vue/es/icon'

import type { CustomFileItem } from '@/stores/modules/taskCenter'
import { useTaskCenterStore } from '@/stores/modules/taskCenter'

import DelCatalog from './DelCatalog.vue'
import FileList from './FileList.vue'
import TaskFilter from './TaskFilter.vue'

const modelValue = defineModel<boolean>()

const taskCenterStore = useTaskCenterStore()
const delCatalogRef = ref<InstanceType<typeof DelCatalog>>()

// const taskList = computed(() => taskCenterStore.taskFileList)
// const delCatalogList = computed(() => taskCenterStore.delCatalogList)

const taskActive = ref<'file' | 'catalogDel'>('file')

const status = ref<CustomFileItem['status'] | ''>('')

const handleAllRetry = () => {
  if (taskActive.value === 'file') {
    taskCenterStore.allRetry()
    return
  }
  delCatalogRef.value?.handleAllRetry()
}

const handleClean = () => {
  if (taskActive.value === 'file') {
    taskCenterStore.allClean()
    taskCenterStore.taskFileList = []
  } else {
    delCatalogRef.value?.handleAllStop()
    taskCenterStore.delCatalogList = []
  }
}

const handleAllStop = () => {
  if (taskActive.value === 'file') {
    taskCenterStore.allStop()
  } else {
    delCatalogRef.value?.handleAllStop()
  }
}

const allStopDisabled = computed(() => {
  if (taskActive.value === 'catalogDel') {
    const list = taskCenterStore.delCatalogList
    if (!list.length) return true
    return !list.some(item => item.status === 'deleteIng')
  }

  if (taskActive.value === 'file') {
    const list = taskCenterStore.taskFileList
    if (!list.length) return true
    return !taskCenterStore.hasUploading
  }
  return true
})

const allRetryDisabled = computed(() => {
  if (taskActive.value === 'catalogDel') {
    const list = taskCenterStore.delCatalogList
    if (!list.length) return true
    if (list.every(item => item.status === 'success')) return true
    return list.some(item => item.status === 'deleteIng')
  }

  if (taskActive.value === 'file') {
    const list = taskCenterStore.taskFileList
    if (!list.length) return true
    if (list.every(item => item.status === 'success')) return true
    return taskCenterStore.hasUploading
  }
  return true
})

const cleanDisabled = computed(() => {
  if (taskActive.value === 'catalogDel') {
    const list = taskCenterStore.delCatalogList
    if (!list.length) return true
    return list.some(item => item.status === 'deleteIng')
  }

  if (taskActive.value === 'file') {
    const list = taskCenterStore.taskFileList
    if (!list.length) return true
    return taskCenterStore.hasUploading
  }
  return false
})
</script>
