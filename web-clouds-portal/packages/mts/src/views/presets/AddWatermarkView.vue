<template>
  <vc-container
    header-bordered
    :page-title="($route.meta.title as string)"
    :back="back"
  >
    <div flex>
      <a-form
        ref="formRef"
        :rules="rules"
        :model="formState"
        layout="vertical"
        class="w-472px!"
      >
        <a-form-item
          field="name"
          label="名称"
          ref="nameRef"
          asterisk-position="end"
          class="mb-24px!"
          :help="
            nameRef?.isError
              ? undefined
              : '仅支持中文、英文、数字、_、-和.六种格式，长度不能超过32个字符'
          "
        >
          <a-input
            v-model="formState.name"
            placeholder="请输入名称"
            :max-length="32"
          />
        </a-form-item>
        <watermark-form-item
          ref="watermarkRef"
          :form-ref="formRef"
          :data="formState"
          :region-id="regionId"
          :data-loaded="dataLoaded"
          v-model:time-line-visible="time_line"
        />
      </a-form>
      <a-divider type="dashed" direction="vertical" class="middle-divider" />
      <a-form :model="formState" layout="vertical" class="w-376px!">
        <a-form-item label="预览画面尺寸" required asterisk-position="end">
          <div flex w="full" items-center>
            <a-input-number
              :min="1"
              :step="1"
              :precision="0"
              v-model="formState.preview_w"
              placeholder="请输入宽度"
            />
            <div class="color-ct-3 mx-8px">x</div>
            <a-input-number
              :min="1"
              :step="1"
              :precision="0"
              v-model="formState.preview_h"
              placeholder="请输入高度"
            />
          </div>
        </a-form-item>
        <a-form-item hide-label>
          <watermark-show :data="formState" />
        </a-form-item>
      </a-form>
    </div>

    <div class="footer">
      <a-button :loading="loading" type="primary" @click="handleSubmit"
        >保存
      </a-button>
      <a-button :loading="loading" type="outline" @click="back">取消</a-button>
    </div>
  </vc-container>
</template>

<script setup lang="ts">
import {
  type FormInstance,
  type FormItemInstance,
  Message
} from '@arco-design/web-vue'
import {
  addMtsPresetWatermarkApi,
  getMtsPresetInfoDetailApi,
  updateMtsPresetWatermarkApi,
  type WatermarkPresetModel
} from '@vcp/apis/mts'
import { isEmpty, merge } from 'lodash-es'
import { nameReg } from 'vc-material'

import WatermarkFormItem from '@/components/workflow/form/watermark/WatermarkFormItem.vue'
import WatermarkShow from '@/components/workflow/form/watermark/WatermarkShow.vue'
import {
  filterState,
  initBackState,
  initState
} from '@/components/workflow/utils/watermark'

import { ADD_FORM_STATE_KEY } from './constants'

const route = useRoute()
const router = useRouter()
const nameRef = ref<FormItemInstance>()
const watermarkRef = ref()
const imagePathRef = computed<FormItemInstance>(
  () => watermarkRef.value?.imagePathRef
)
const id = computed(() => route.params.id as string)
const regionId = computed(() => route.params.regionId as string)
const isEdit = computed(() =>
  (route.name as string).toLowerCase().includes('edit')
)

const formRef = ref<FormInstance>()
const rules: Rules = {
  name: [
    { required: true, message: '请输入名称' },
    {
      match: nameReg,
      message: '仅支持中文、英文、数字、_、-和.六种格式，长度不能超过32个字符'
    }
  ],
  image_path: [{ required: true, message: '请选择水印' }],
  text_word: [{ required: true, message: '请输入内容' }]
}

const formState = ref<WatermarkPresetModel>(initState())

const time_line = ref(false)

const state = useSessionStorage(
  ADD_FORM_STATE_KEY,
  ref<WatermarkPresetModel>({})
)

const loading = ref(false)
const dataLoaded = ref(false)

async function handleSubmit() {
  if (imagePathRef.value?.isError) return
  const err = await formRef.value?.validate()
  if (err) return
  const state = filterState(formState.value, time_line)
  loading.value = true
  const apiFn = isEdit.value
    ? updateMtsPresetWatermarkApi
    : addMtsPresetWatermarkApi
  const msg = isEdit.value ? '修改成功' : '添加成功'
  try {
    // @ts-ignore
    await apiFn({ ...state, region_id: regionId.value })
    Message.success(msg)
    back()
  } finally {
    loading.value = false
  }
}

function back() {
  router.push({ name: 'Presets', params: { type: 'watermark' } })
}

async function getDetail() {
  loading.value = true
  try {
    const res = await getMtsPresetInfoDetailApi({
      id: id.value,
      preset_type: '2'
    })
    merge(formState.value, initBackState(res?.watermark_preset!, time_line))
  } finally {
    loading.value = false
    dataLoaded.value = true
  }
}

function getData() {
  if (!regionId.value) return Message.error('缺少区域id')

  if (isEdit.value) {
    if (!id.value) return Message.error('缺少预设id')
    getDetail()
  } else {
    if (!isEmpty(state.value)) {
      merge(formState.value, initBackState(state.value, time_line))
    }
    state.value = null
    dataLoaded.value = true
  }
}

onMounted(() => {
  getData()
})
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

:deep(.arco-form-item) {
  .arco-form-item {
    margin-bottom: 0;
  }
}

.middle-divider.arco-divider-vertical {
  margin: 4px 28px;
  height: 526px;
}

.tab-btn-box {
  display: flex;
}

.tab-btn {
  cursor: pointer;
  flex: 1;
  height: 32px;
  font-size: 14px;
  text-align: center;
  color: var(--color-text-1);
  border: 1px solid;
  border-color: var(--color-border-2);
  line-height: 32px;
  font-weight: 400;
  border-radius: 6px;

  &:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  & + .tab-btn {
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;

    &.active {
      border-left: 1px solid;
    }
  }

  &.active {
    color: rgb(var(--primary-6));
    background-color: rgb(var(--primary-1));
    border-color: rgb(var(--primary-6));
  }
}
</style>
