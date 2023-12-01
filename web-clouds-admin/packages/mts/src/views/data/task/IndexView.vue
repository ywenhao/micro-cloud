<template>
  <vc-container page-title="任务处理统计" admin>
    <a-spin :loading="loading" class="w-full h-full">
      <div flex gap="8px" mt="16px">
        <a-radio-group
          type="button"
          v-model="dateRadio"
          :options="mtsDayOpts"
        />
        <a-range-picker
          class="w-300px"
          v-model="datePicker"
          value-format="X"
          :disabled-date="disabledDate"
        />
        <i flex="1" />
        <vc-refresh-button :loading="loading" @click="getData" />
      </div>
      <div flex gap="8px" mt="32px">
        <rank-card
          title="任务数排名"
          :title-array="['排名', '用户ID', '任务数']"
          :data="taskData"
          :on-more="() => $router.push({ name: 'TaskManage' })"
        />
        <task-long
          :data="taskTimeData"
          :on-more="() => $router.push({ name: 'TaskManage' })"
        />
        <task-done
          :data="taskDoData"
          :on-more="() => $router.push({ name: 'TaskManage' })"
        />
      </div>
      <div mt="32px">
        <a-tabs v-model:active-key="active">
          <a-tab-pane key="普通视频转码" title="普通视频转码">
            <normal-panel
              v-if="active === '普通视频转码'"
              :filter-data="filterData"
            />
          </a-tab-pane>
          <a-tab-pane key="视频截图" title="视频截图">
            <video-screenshot-panel
              v-if="active === '视频截图'"
              :filter-data="filterData"
            />
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-spin>
  </vc-container>
</template>

<script setup lang="ts">
import { getMtsCollectTaskApi, type TaskTime } from '@vca/apis/mts'
import { mtsDayOpts, useDatePicker } from 'vc-material'

import { disabledDate } from '@/utils/date'

import NormalPanel from './components/NormalPanel.vue'
import RankCard from './components/RankCard.vue'
import TaskDone from './components/TaskDone.vue'
import TaskLong from './components/TaskLong.vue'
import VideoScreenshotPanel from './components/VideoScreenshotPanel.vue'

const { dateRadio, datePicker, dateValue } = useDatePicker()

const filterData = reactive({
  begin_time: computed(() => dateValue.value[0]),
  end_time: computed(() => dateValue.value[1])
})
const data = ref<TaskTime>({})
const loading = ref(false)

//任务数排名统计
const taskData = computed<[string, string | number][]>(() => {
  const taskList = data.value.user_task_list ?? []
  return taskList.map(item => [item.user_id ?? '-', item.count ?? 0])
})

// 任务时长统计
const taskTimeData = computed<{ value: string | number; name: string }[]>(
  () => [
    { value: data.value?.lte_60_second ?? 0, name: '<=60s' },
    { value: data.value?.lte_30_min ?? 0, name: '1-30min' },
    { value: data.value?.lte_60_min ?? 0, name: '31-60min' },
    { value: data.value?.gt_60_min ?? 0, name: '>60min' }
  ]
)

// 任务完成情况统计
const taskDoData = computed<{ value: string | number; name: string }[]>(() => [
  { value: data.value?.success ?? 0, name: '成功' },
  { value: data.value?.fail ?? 0, name: '失败' }
])
const active = ref<'普通视频转码' | '视频截图'>('普通视频转码')

// 获取任务数统计
async function getData() {
  loading.value = true
  getMtsCollectTaskApi(filterData)
    .then(res => {
      data.value = res
    })
    .finally(() => {
      loading.value = false
    })
}

watchEffect(() => {
  dateValue.value
  getData()
})
</script>

<style lang="less" scoped>
:deep(.arco-tabs-content) {
  padding-top: 8px;
}
</style>
