<template>
  <a-modal
    modal-class="vc-dialog form-dialog"
    title-align="start"
    v-model:visible="modelValue"
    :title="title"
    :width="520"
    @before-open="handleModalBeforeOpen"
    :on-before-ok="handleConfirm"
    :esc-to-close="false"
    :mask-closable="false"
    okText="保存"
    cancelText="取消"
  >
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item
        label="产品名称"
        field="name"
        validate-trigger="input"
        asterisk-position="end"
      >
        <a-input
          v-model="formState.name"
          :max-length="15"
          show-word-limit
          placeholder="请输入名称"
        ></a-input>
      </a-form-item>
      <a-form-item
        class="hide-content"
        :label="`产品标识: ${formState.symbol}`"
        help="用于拼接产品的官网介绍页面、控制台跳转地址，例如oss、cdn等"
      >
      </a-form-item>
      <a-form-item
        class="mb-6!"
        label="产品图表n"
        help="icon图片支持上传png、jpg、jpeg、svg文件，上传图片大小不能超过2MB，建议尺寸为120px*120px"
      >
        <upload-logo size="94px" v-model="formState.icon"></upload-logo>
      </a-form-item>
      <a-form-item class="mb-0!" hide-label label="状态">
        <div class="flex items-center gap-x-2">
          <label>状态</label>
          <a-switch
            :unchecked-value="2"
            :checked-value="1"
            v-model="formState.status"
          ></a-switch>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { type FormInstance, Message } from '@arco-design/web-vue'
import { type ProductModel, productUpdateApi } from '@vca/apis/pedestal'
import { pick } from 'lodash-es'
import { computed } from 'vue'

const formRef = ref<FormInstance>()
const modelValue = defineModel()
const record = defineModel<ProductModel>('record', { default: undefined })
const emit = defineEmits<{
  (event: 'reload'): void
}>()
const title = computed(() => (record?.value ? '编辑产品' : '新建产品'))

const rules: Rules = {
  name: [{ required: true, message: '请输入产品名称' }]
}
const formState = ref<Required<ProductModel>>({
  id: '',
  name: '',
  symbol: '',
  create_account: '',
  icon: '',
  created_at: '',
  status: 0,
  index: 0,
  isLeaf: false
})

const handleModalBeforeOpen = () => {
  formState.value = { ...formState.value, ...(record.value || {}) }
}

// function handleConfirm() {
//   formRef.value?.validate().then(() => {
//     emit('submit', pick(formState.value, ['id', 'icon', 'name', 'status']))
//   })
// }

/** 编辑提交事件 */
const handleEditorSubmit = async () => {
  const pickFields = ['id', 'icon', 'name', 'status']
  const params: ProductModel = pick(formState.value, pickFields)

  try {
    await productUpdateApi(params as any)
    Message.success(params?.id ? '修改成功' : '添加成功')
    emit('reload')
    return true
  } catch (e) {
    return false
  }
}
const handleConfirm = async () => {
  const validate = await formRef.value?.validate()
  if (validate) return false
  return handleEditorSubmit()
}
</script>
