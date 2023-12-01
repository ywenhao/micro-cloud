<template>
  <vc-container header-bordered page-title="提交工单">
    <a-form
      layout="vertical"
      class="w-400px! mt-16px"
      ref="formRef"
      :model="formState"
      :rules="rules"
    >
      <a-form-item asterisk-position="end" label="所属产品" field="product_id">
        <a-select
          :loading="productLoading"
          @change="formState.type = ''"
          v-model="formState.product_id"
          placeholder="请选择所属产品"
          :trigger-props="{ autoFitPopupMinWidth: true }"
        >
          <a-option
            v-for="item in productList"
            :label="item.label!"
            :key="item.value!"
            :value="item.value!"
          >
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item asterisk-position="end" label="工单类型" field="type">
        <a-select
          placeholder="请选择工单类型"
          :disabled="!formState.product_id"
          v-model="formState.type"
          :loading="typeLoading"
          :trigger-props="{ autoFitPopupMinWidth: true }"
        >
          <a-option
            v-for="item in typeOpts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item asterisk-position="end" label="工单标题" field="title">
        <a-input
          placeholder="请输入工单标题"
          v-model="formState.title"
          :max-length="100"
          show-word-limit
        />
      </a-form-item>
      <a-form-item asterisk-position="end" label="问题描述" field="describe">
        <a-textarea
          placeholder="请输入问题描述"
          v-model="formState.describe"
          :max-length="500"
          show-word-limit
          resize="none"
          type="textarea"
        />
      </a-form-item>
      <a-form-item asterisk-position="end" label="上传图片">
        <upload-image
          ref="uploadRef"
          :limit="9"
          v-model="formState.image"
          :custom-request="customRequest"
        />
      </a-form-item>
    </a-form>
    <div class="vc-footer mb-24px mt-32px">
      <a-button @click="handleSubmit" :loading="loading" type="primary"
        >提交</a-button
      >
    </div>
  </vc-container>
</template>

<script setup lang="ts">
import {
  type FieldRule,
  type FormInstance,
  Message
} from '@arco-design/web-vue'
import {
  addWorkerOrderApi,
  queryWorkerOrderTypeByIdApi,
  queryWorkerProductListApi,
  uploadApi
} from '@vcp/apis/pedestal'
import { omit } from 'lodash-es'
import { useSelectRemote, VcModal } from 'vc-material'

const router = useRouter()

const { loading: productLoading, opts: productList } = useSelectRemote(
  queryWorkerProductListApi,
  {
    labelKey: 'product_name',
    valueKey: 'product_id'
  }
)

const uploadRef = ref<InstanceType<typeof UploadImage>>()
const formRef = ref<FormInstance>()
const loading = ref(false)

const rules: Record<string, FieldRule[]> = {
  product_id: [{ required: true, message: '请选择所属产品' }],
  type: [{ required: true, message: '请选择工单类型' }],
  title: [{ required: true, message: '请输入工单标题' }],
  describe: [{ required: true, message: '请输入问题描述' }]
}

const formState = reactive({
  product_id: '',
  type: '',
  title: '',
  describe: '',
  image: []
})

const {
  loading: typeLoading,
  opts: typeOpts,
  remoteMethod
} = useSelectRemote(queryWorkerOrderTypeByIdApi, {
  labelKey: 'name',
  valueKey: 'id',
  immediate: false
})
watch(
  () => formState.product_id,
  id => {
    id && remoteMethod({ product_id: id })
  }
)

async function customRequest(data: FormData, config?: any) {
  const { filepath } = await uploadApi(data, config)
  return filepath!
}

async function handleSubmit() {
  if (uploadRef.value?.status === 'uploading') {
    VcModal.confirm({
      title: '图片上传提示',
      content: '图片正在上传中，请稍后。',
      hideCancel: true,
      okText: '知道了'
    })
    return
  }

  const res = await formRef.value?.validate()
  if (res) return
  loading.value = true
  try {
    await addWorkerOrderApi({
      ...omit(formState, 'image'),
      picture_path: formState.image.join(',')
    })
    Message.success('提交成功')
    setTimeout(() => {
      router.push({ name: 'WorkOrderMy' })
    }, 500)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="less" scoped>
:deep(.arco-form) {
  row-gap: 32px - 24px;
  .arco-select {
    width: 100%;
  }
  .arco-textarea {
    height: 120px;
  }
  .arco-form-item {
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.vc-container {
  @apply flex-col-1;
  height: auto;
  min-height: auto;
}
</style>
