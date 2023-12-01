<template>
  <a-drawer
    v-model:visible="modelValue"
    title="标签管理"
    :width="600"
    :esc-to-close="false"
    :mask-closable="false"
    :closable="!loading"
    :ok-loading="loading"
    @before-open="handleDrawerOpen"
    @before-cancel="handleBeforeClose"
    destroy-on-close
    cancel-text="取消"
    ok-text="保存"
    class="vc-drawer"
    @before-ok="handleBeforeOk"
  >
    <span class="text-xs text-ct-3"
      >每个空间最多可添加 10
      对标签，标签区分大小写，仅支持大小写字母、数字、空格、+ - = . _ : /
      @</span
    >
    <a-list class="mt-4">
      <template #header>
        <div
          class="text-[var(--color-text-1)] text-sm font-medium flex items-center"
        >
          <span class="flex-1 grid grid-cols-2 gap-x-4 items-center">
            <span>标签键</span>
            <span>标签值</span>
          </span>
          <span class="w-12">操作</span>
        </div>
      </template>
      <a-form ref="formLabelRef" :model="tagData" class="label-form-box">
        <a-list-item v-for="(item, index) in tagData.labelList" :key="index">
          <div class="flex-1 grid grid-cols-2 gap-x-2 items-start">
            <a-form-item
              :field="`labelList[${index}].key`"
              :hide-asterisk="true"
              hide-label
              :rules="[{ required: true, validator: handleValidatorKey }]"
              validate-trigger="change"
              class="mb-0!"
            >
              <a-input
                v-model.trim="item.key"
                placeholder="请输入标签建"
                :max-length="128"
                class="w-full"
              />
            </a-form-item>

            <a-form-item
              :field="`labelList[${index}].val`"
              :hide-asterisk="true"
              hide-label
              :rules="[{ required: true, validator: handleValidatorVal }]"
              validate-trigger="change"
              class="mb-0!"
            >
              <a-input
                v-model.trim="item.val"
                placeholder="请输入标签值"
                :max-length="128"
                class="w-full"
              />
            </a-form-item>
          </div>

          <div class="w-12! gap-x-4 flex pl-4! h-8 items-center">
            <div class="icon-container" @click="handleDel(index)">
              <vc-svg-icon
                prefix="oss"
                name="icon_delete"
                :size="16"
              ></vc-svg-icon>
            </div>
          </div>
        </a-list-item>
      </a-form>
      <a-list-item class="add-list-item">
        <a-button
          type="outline"
          class="flex items-center bg-white! text-[#2253E6]! border-primary! px-2!"
          @click="handleAdd"
          :disabled="tagData.labelList.length >= 10"
        >
          <vc-svg-icon prefix="oss" name="add_file" class="mr-1"></vc-svg-icon>
          添加
        </a-button>
      </a-list-item>
    </a-list>
  </a-drawer>
</template>

<script lang="ts" setup>
import { type FormInstance, Message } from '@arco-design/web-vue'
import { tagListApi, type TagModel, updateTagApi } from '@vcp/apis/oss'
import { omit } from 'vc-material'
interface IEmits {
  (event: 'update'): void
}
const emit = defineEmits<IEmits>()
const modelValue = defineModel<boolean>({ default: false })
const loading = ref(false)

const route = useRoute()

const tagData = ref<{ labelList: TagModel[] }>({
  labelList: [{ id: '', key: 'key1', val: 'value1' }]
})

const handleAdd = () => {
  tagData.value.labelList.push({
    key: '',
    val: ''
  })
}

const handleValidatorVal = (value: any, callback: any) => {
  const domainReg = /([a-zA-Z0-9 +-=._:/@])$/
  if (!value) {
    return callback('不能为空')
  }

  if (value && !domainReg.test(value)) {
    return callback('格式不合适')
  }

  return callback()
}

/** 获取标签 */
const getTagData = () => {
  tagListApi({
    bucket_id: route.params?.id as string
  }).then(res => {
    tagData.value.labelList = res.list?.map(item => {
      return { ...item, edit: true }
    }) as TagModel[]
  })
}

/**删除标签 */
const handleDel = (index: number) => {
  tagData.value.labelList.splice(index, 1)
}

const formLabelRef = ref<FormInstance>()

const handleValidatorKey = (value: any, callback: any) => {
  const domainReg = /([a-zA-Z0-9 +-=._:/@])$/
  if (!value) {
    return callback('不能为空')
  }

  if (value && !domainReg.test(value)) {
    return callback('格式不合适')
  }

  return callback()
}

const handleDrawerOpen = () => {
  getTagData()
  if (route.params?.label) {
    document.getElementById('anthor-label')?.scrollIntoView()
  }
}
const handleBeforeClose = () => {
  return false
}
const handleBeforeOk = async () => {
  const validate: any[] = []
  for (let i = 0; i < tagData.value.labelList.length; i++) {
    const valid = await formLabelRef.value?.validateField([
      `labelList[${i}].val`,
      `labelList[${i}].key`
    ])
    if (valid) {
      validate.push(valid)
    }
  }
  if (validate.length < 1) {
    loading.value = true

    const dataList = tagData.value.labelList.map(item => {
      return { ...omit(item, ['id']) }
    })
    return updateTagApi({
      list: dataList,
      bucket_id: route.params?.id as string
    })
      .then(() => {
        Message.success('操作成功')
        emit('update')
        modelValue.value = false
      })
      .finally(() => {
        loading.value = false
      })
  }
}
</script>
<style scoped lang="less">
.space-setting-table {
  overflow-y: auto;
  max-height: 450px;
  :deep(.arco-anchor-link) {
    @apply p-0!;
  }
}
:deep(.arco-list-header) {
  padding: 10px 0px 10px 16px !important;
  background: #f2f3f5;
}
:deep(.arco-list-item) {
  @apply py-2! px-4!;
  border-bottom: 1px solid var(--color-neutral-3);
  .arco-list-item-content {
    @apply flex h-full items-start;
  }
  &.add-list-item {
    border-bottom: none !important;
  }
}
.label-form-box {
  :deep(.arco-form-item-label-col) {
    @apply hidden !important;
  }
}
.icon-container {
  @apply flex items-center justify-center w-8 h-8 rounded-md border border-solid border-[#E5E6EB]  cursor-pointer;
}
</style>
