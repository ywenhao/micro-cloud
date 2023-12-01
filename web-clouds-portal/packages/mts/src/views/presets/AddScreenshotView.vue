<template>
  <vc-container
    header-bordered
    :page-title="($route.meta.title as string)"
    :back="back"
  >
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
      <screenshot-form-item
        :data="formState"
        :data-loaded="dataLoaded"
        :form-ref="formRef"
      />
    </a-form>
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
  addMtsPresetScreenshotApi,
  getMtsPresetInfoDetailApi,
  type ScreenshotPresetModel,
  updateMtsPresetScreenshotApi
} from '@vcp/apis/mts'
import { isEmpty, merge } from 'lodash-es'
import { nameReg } from 'vc-material'

import ScreenshotFormItem from '@/components/workflow/form/screenshot/ScreenshotFormItem.vue'
import {
  filterState,
  initBackState,
  initState
} from '@/components/workflow/utils/screenshot'

import { ADD_FORM_STATE_KEY } from './constants'

const route = useRoute()
const router = useRouter()
const nameRef = ref<FormItemInstance>()
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
  ]
}

const formState = ref<ScreenshotPresetModel>(initState())

const state = useSessionStorage(
  ADD_FORM_STATE_KEY,
  ref<ScreenshotPresetModel>({})
)

const loading = ref(false)
const dataLoaded = ref(false)

async function handleSubmit() {
  const err = await formRef.value?.validate()
  if (err) return
  const state = filterState(formState.value)
  loading.value = true
  const apiFn = isEdit.value
    ? updateMtsPresetScreenshotApi
    : addMtsPresetScreenshotApi
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
  router.push({ name: 'Presets', params: { type: 'screenshot' } })
}

async function getDetail() {
  loading.value = true
  try {
    const res = await getMtsPresetInfoDetailApi({
      id: id.value,
      preset_type: '3'
    })
    merge(formState.value, initBackState(res?.screenshot_preset!))
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
      merge(formState.value, initBackState(state.value))
    }
    dataLoaded.value = true
    state.value = null
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
</style>
