<template>
  <a-form-item hide-label :merge-props="false">
    <a-form-item label="封装格式">
      <a-select
        v-model="formState.format"
        placeholder="请选择封装格式"
        :options="videoFormatOpts"
      />
    </a-form-item>
    <a-form-item label="配置项" class="ml-16px">
      <div class="flex config-btn-box">
        <a-button
          v-for="(item, index) in configBtnList"
          :key="item"
          @click="toggleConfig(item)"
          type="outline"
          class="config-btn"
          :disabled="!btnList.includes(item)"
          :class="{
            'cursor-not-allowed!': index === 0,
            active: index === 0 || btnActive.includes(item)
          }"
          >{{ item }}
        </a-button>
      </div>
    </a-form-item>
  </a-form-item>
  <a-form-item hide-label class="mb-16px!">
    <sub-title class="color-ct-3! after:ml-4px! mb-0!">编码配置</sub-title>
  </a-form-item>
  <a-form-item hide-label>
    <a-tabs class="config-tabs" v-model:active-key="tabActive">
      <a-tab-pane v-for="item in btnActive" :title="item" :key="item" />
    </a-tabs>
  </a-form-item>
  <component :is="formComp" :data="formState" :dataLoaded="dataLoaded" />
</template>

<script setup lang="ts">
import type { VideoPresetModel } from '@vcp/apis/mts'
import type { VNode } from 'vue'

import SubTitle from '@/components/SubTitle.vue'
import { videoFormatOpts } from '@/utils/opts/preset'

import AudioForm from './AudioForm.vue'
import CaptionsForm from './CaptionsForm.vue'
import VideoForm from './VideoForm.vue'

const props = withDefaults(
  defineProps<{
    isSys?: boolean
    data: VideoPresetModel
    dataLoaded?: boolean
  }>(),
  {
    dataLoaded: true
  }
)

const formState = computed(() => props.data)

const configBtnList = ['视频参数', '音频参数', '字幕参数'] as const
const btnList = computed(() => {
  const list = configBtnList.slice()
  if (props.isSys) list.pop()
  return list
})

export type ConfigKey = (typeof configBtnList)[number]
const btnActive = ref<ConfigKey[]>(['视频参数'])
const tabActive = ref<ConfigKey>('视频参数')

const formCompMap = new Map([
  ['视频参数', VideoForm],
  ['音频参数', AudioForm],
  ['字幕参数', CaptionsForm]
])

const formComp = computed(
  () => formCompMap.get(tabActive.value) as unknown as VNode
)

function toggleConfig(key: ConfigKey) {
  if (key === '视频参数') return
  const tab = tabActive.value
  if (btnActive.value.includes(key)) {
    btnActive.value = btnActive.value.filter(item => item !== key)
    if (btnActive.value.length && !btnActive.value.includes(tab)) {
      tabActive.value = btnActive.value[0]
    }
  } else {
    btnActive.value.push(key)
  }
}

watch(
  () => props.dataLoaded,
  val => {
    if (!val) return
    for (const key in formState.value) {
      const item = formState.value[key as keyof typeof formState.value]
      if (!item) continue
      if (key.startsWith('audio') && !btnActive.value.includes('音频参数')) {
        btnActive.value.push('音频参数')
      } else if (
        !props.isSys &&
        key.startsWith('subtitle') &&
        !btnActive.value.includes('字幕参数')
      ) {
        btnActive.value.push('字幕参数')
      }
    }
  },
  { immediate: true }
)

defineExpose({ btnActive })
</script>

<style lang="less" scoped>
.config-btn {
  &.active {
    color: rgb(var(--primary-6));
    background: rgb(var(--primary-1, #e8f3ff));
    border-color: rgb(var(--primary-6));
  }
}

.config-tabs {
  width: 100%;

  :deep(.arco-tabs-content) {
    padding: 0;
  }
}
</style>
