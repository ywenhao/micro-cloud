<template>
  <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
    <a-form-item hide-asterisk label="普通转码预设" field="video_preset_id">
      <a-select
        placeholder="请选择预设"
        v-model="formState.video_preset_id"
        :loading="presetLoading"
        :options="presetOpts"
      />
    </a-form-item>
    <div flex w-full items-center justify-between mb-8px>
      <div flex items-center>
        <div>水印设置</div>
        <a-switch
          class="ml-8px!"
          v-model="watermarkSwitch"
          :before-change="beforeWatermarkSwitchChange"
          @change="handleWatermarkSwitch"
        />
      </div>
      <a-link
        v-if="watermarkSwitch"
        :hoverable="false"
        class="add-btn"
        @click.stop="handleAddWatermark"
      >
        <icon-plus size="16" />
        <div class="ml-4px">添加</div>
      </a-link>
    </div>
    <a-form-item field="video_paths" hide-asterisk hide-label>
      <div flex="~ col" w-full v-if="watermarkSwitch">
        <div
          w-full
          class="watermark-select"
          v-for="(item, index) in watermark_preset_id_list"
          :key="item"
        >
          <a-select
            v-model="watermark_preset_id_list[index]"
            placeholder="请选择水印"
            :loading="watermarkLoading"
            :options="watermarkOpts"
          />
          <div class="ml-4px">
            <a-button
              :disabled="watermark_preset_id_list.length === 1"
              type="outline"
              class="close-btn"
              @click="handleRemoveWatermark(index)"
            >
              <template #icon>
                <icon-close size="16" />
              </template>
            </a-button>
          </div>
        </div>
      </div>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { type FormInstance, Message } from '@arco-design/web-vue'
import { getMtsPresetListApi, type WorkflowVideoConf } from '@vca/apis/mts'
import { cloneDeep } from 'lodash-es'
import { useRequest, useSelectRemote } from 'vc-material'

const props = defineProps<{
  data: WorkflowVideoConf
  dataLoaded: boolean
}>()

const formRef = ref<FormInstance>()
const formState = ref<WorkflowVideoConf>({})

const rules: Rules = {
  video_preset_id: [{ required: true, message: '请选择预设' }]
}

const watermarkSwitch = ref(false)

const {
  loading: presetLoading,
  data: presetData,
  run
} = useRequest(getMtsPresetListApi, { preset_type: 1 })
run()

const { loading: watermarkLoading, opts: watermarkOpts } = useSelectRemote(
  getMtsPresetListApi,
  {
    labelKey: 'name',
    valueKey: 'id',
    listKey: 'watermark_preset_list',
    defaultState: { preset_type: 2 }
  }
)

const presetList = computed(() => presetData.value?.video_preset_list || [])
const presetOpts = computed(() => {
  return presetList.value.map(item => ({
    label: item.name,
    value: item.id
  }))
})

const watermark_preset_id_list = computed(
  () => formState.value.video_preset?.watermark_preset_id_list || []
)

function initPresetIdList() {
  if (!watermark_preset_id_list.value.length) {
    // @ts-ignore
    formState.value.video_preset = {
      ...formState.value.video_preset,
      watermark_preset_id_list: ['']
    }
  }
}

function beforeWatermarkSwitchChange() {
  if (!watermarkSwitch.value && !formState.value.video_preset_id) {
    Message.error('请先选择普通转码预设')
    return false
  }
  return true
}

function handleWatermarkSwitch() {
  if (watermarkSwitch.value) {
    initPresetIdList()
  }
}

function handleAddWatermark() {
  const watermark_preset_id_list =
    formState.value.video_preset?.watermark_preset_id_list!
  watermark_preset_id_list.push('')
}

function handleRemoveWatermark(index: number) {
  watermark_preset_id_list.value.splice(index, 1)
}

watch(
  () => props.dataLoaded,
  val => {
    if (!val) return
    formState.value = cloneDeep(props.data)
    if (watermark_preset_id_list.value.length) {
      watermarkSwitch.value = true
    }
  },
  { immediate: true }
)

function getData(isSubmit = false) {
  const video_preset = presetList.value.find(
    item => item.id === formState.value.video_preset_id
  )

  const watermark_preset_id_list = watermarkSwitch.value
    ? formState.value.video_preset?.watermark_preset_id_list?.filter(Boolean)
    : undefined
  const watermark_list = undefined
  const state = {
    ...formState.value,
    watermark_preset_id_list,
    video_preset: isSubmit
      ? void 0
      : { ...video_preset, watermark_preset_id_list, watermark_list }
  }
  return state
}

defineExpose({ getData, validate: () => formRef.value?.validate() })
</script>

<style lang="less" scoped>
.watermark-select {
  display: flex;
  align-items: center;
  & + .watermark-select {
    margin-top: 8px;
  }
}

.add-btn {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  &:hover {
    color: rgb(var(--primary-5));
  }
}
</style>
