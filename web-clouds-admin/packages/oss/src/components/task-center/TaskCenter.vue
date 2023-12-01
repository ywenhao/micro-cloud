<template>
  <div class="task-center-box">
    <a-badge
      :count="waitCount"
      :max-count="99"
      v-show="waitCount"
      :offset="[-5, 3]"
    >
      <div class="task-center-icon" @click="taskCenterStore.visible = true">
        <vc-svg-icon name="icon_task_center" :size="24" prefix="oss" />
      </div>
    </a-badge>
    <task-center-drawer v-model="taskCenterStore.visible" />
  </div>
</template>

<script setup lang="ts">
import { useTaskCenterStore } from '@/stores/modules/taskCenter'

import TaskCenterDrawer from './TaskCenterDrawer.vue'

const taskCenterStore = useTaskCenterStore()
const waitCount = computed(() => taskCenterStore.waitCount)

// 离开页面提示
function onBeforeunload(e: BeforeUnloadEvent) {
  if (waitCount.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

onMounted(() => {
  window.microApp.dispatch({
    type: 'oss-task-center',
    payload: { waitCount }
  })
  window.addEventListener('beforeunload', onBeforeunload)
})

onUnmounted(() => {
  window.microApp.dispatch({
    type: 'oss-task-center',
    payload: { waitCount: 0 }
  })
  window.removeEventListener('beforeunload', onBeforeunload)
})
</script>

<style lang="less" scoped>
.task-center-box {
  position: fixed;
  right: 32px;
  bottom: 32px;
}
.task-center-icon {
  display: grid;
  width: 48px;
  height: 48px;
  background: #fff;
  border: 1px solid #f2f3f5;
  border-radius: 50%;
  box-shadow: 0px 5px 20px 0px rgba(78, 89, 105, 0.08);
  cursor: pointer;
  place-items: center;
}
</style>
