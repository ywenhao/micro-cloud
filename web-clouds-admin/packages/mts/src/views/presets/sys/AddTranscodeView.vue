<template>
  <vc-container
    admin
    header-bordered
    :page-title="($route.meta.title as string)"
    :back="back"
  >
    <a-spin :loading="loading" class="block w-472px!">
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
        <transcode-tab-form
          ref="tabFormRef"
          :is-sys="isSys"
          :data="formState"
          :data-loaded="dataLoaded"
        />
      </a-form>
    </a-spin>
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
  addMtsPresetVideoApi,
  getMtsPresetInfoDetailApi,
  updateMtsPresetVideoApi,
  type VideoPresetModel
} from '@vca/apis/mts'
import { isEmpty, merge } from 'lodash-es'
import { nameReg } from 'vc-material'

import TranscodeTabForm, {
  type ConfigKey
} from '@/components/workflow/form/transcode/TranscodeTabForm.vue'
import {
  filterState,
  initBackState,
  initState
} from '@/components/workflow/utils/transcode'

import { ADD_FORM_STATE_KEY } from './constants'

const route = useRoute()
const router = useRouter()
const nameRef = ref<FormItemInstance>()
const id = computed(() => route.params.id as string)

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

const formState = ref<VideoPresetModel>(initState())

const state = useSessionStorage(ADD_FORM_STATE_KEY, ref<VideoPresetModel>({}))

const routeName = computed(() => (route.name as string)?.toLowerCase())
const isSys = computed(() => !!routeName.value?.includes('sys'))

const loading = ref(false)
const dataLoaded = ref(false)

const tabFormRef = ref()
const btnActive = computed<ConfigKey[]>(
  () => tabFormRef?.value?.btnActive || []
)

async function handleSubmit() {
  const err = await formRef.value?.validate()
  if (err) return
  const state = filterState(formState.value, btnActive.value)
  loading.value = true
  const apiFn = isEdit.value ? updateMtsPresetVideoApi : addMtsPresetVideoApi
  const msg = isEdit.value ? '修改成功' : '添加成功'
  try {
    // @ts-ignore
    await apiFn({ ...state })
    Message.success(msg)
    back()
  } finally {
    loading.value = false
  }
}

function back() {
  router.push({ name: 'PresetsSys' })
}

async function getDetail() {
  loading.value = true
  try {
    const res = await getMtsPresetInfoDetailApi({
      id: id.value,
      preset_type: '1'
    })
    merge(formState.value, initBackState(res?.video_preset!))
  } finally {
    loading.value = false
    dataLoaded.value = true
  }
}

function getData() {
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
:deep(.arco-form-item) {
  .arco-form-item {
    margin-bottom: 0;
  }
}
</style>
