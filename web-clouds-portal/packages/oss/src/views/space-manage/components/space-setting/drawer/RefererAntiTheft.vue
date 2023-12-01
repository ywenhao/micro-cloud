<template>
  <a-drawer
    v-model:visible="modelValue"
    title="Referer防盗链"
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
    <div class="flex flex-row gap-x-2 mb-8">
      <span class="text-ct-1 text-sm">状态</span>
      <a-switch v-model="refererData!!.enable" size="small" />
    </div>
    <div v-if="refererData!!.enable" class="flex flex-col gap-y-8">
      <div class="flex flex-col gap-y-2">
        <span class="text-ct-1 text-sm">类型</span>
        <a-radio-group v-model="refererData!!.is_white_list">
          <a-radio :value="true">白名单</a-radio>
          <a-radio :value="false">黑名单</a-radio>
        </a-radio-group>
      </div>
      <div class="flex flex-col gap-y-2">
        <span class="text-ct-1 text-sm">允许空Referer</span>
        <a-radio-group v-model="refererData!!.allow_empty">
          <a-radio :value="true">允许</a-radio>
          <a-radio :value="false">拒绝</a-radio>
        </a-radio-group>
      </div>
      <a-list>
        <template #header>
          <div
            class="text-[var(--color-text-1)] text-sm font-medium flex items-center"
          >
            <span class="flex-1">Referer</span>
            <span class="w-12">操作</span>
          </div>
        </template>
        <a-form ref="formRef" :model="refererData" class="referer-form-box">
          <a-list-item
            v-for="(item, index) in refererData?.refererList"
            :key="index"
          >
            <a-form-item
              :field="`refererList[${index}].value`"
              :hide-asterisk="true"
              hide-label
              :rules="[{ required: true, validator: handleValidator }]"
              validate-trigger="change"
              class="flex flex-col mb-0! flex-1"
            >
              <a-input v-model="item.value" placeholder="请输入URL" />
            </a-form-item>

            <div class="flex pl-2! gap-x-4 h-8 items-center">
              <div class="icon-container" @click="handleDel(item, index)">
                <vc-svg-icon
                  prefix="oss"
                  name="icon_delete"
                  :size="16"
                ></vc-svg-icon>
              </div>
            </div>
          </a-list-item>
          <a-list-item>
            <a-button
              type="outline"
              @click="handleAdd"
              class="border-primary! px-2!"
            >
              <vc-svg-icon
                prefix="oss"
                name="add_file"
                class="mr-1"
              ></vc-svg-icon>
              <a-link :hoverable="false" type="primary"> 添加 </a-link>
            </a-button>
          </a-list-item>
        </a-form>
      </a-list>
    </div>
  </a-drawer>
</template>
<script lang="ts" setup>
import { type FormInstance, Message } from '@arco-design/web-vue'
import { editReferApi, refererListApi, type RefererModel } from '@vcp/apis/oss'
import { cloneDeep } from 'lodash-es'
import { VcModal } from 'vc-material'
interface IEmits {
  (event: 'update'): void
}
const modelValue = defineModel<boolean>({ default: false })
const loading = ref(false)
const route = useRoute()
const formRef = ref<FormInstance>()
const emit = defineEmits<IEmits>()
const refererData = ref<RefererModel>({
  allow_empty: false,
  enable: false,
  is_white_list: false,
  list: [],
  refererList: []
})

/** 获取referer */
const getReferData = () => {
  refererListApi({
    bucket_id: route.params?.id as string
  }).then(res => {
    refererData.value = { ...refererData.value, ...res }
    refererData.value.refererList = res.list?.map(item => {
      return {
        value: item,
        edit: false,
        id: item
      }
    })
  })
}

/**添加referer */
const handleAdd = () => {
  refererData.value?.refererList?.push({
    value: '',
    edit: false,
    message: ''
  })
}

/**删除referer */
const handleDel = (item: any, index?: number) => {
  // if (!item.id) {
  //   refererData.value.refererList?.splice(index as number, 1)
  //   return
  // }
  const referers = cloneDeep(refererData.value.refererList)
  referers?.splice(index as number, 1)

  const list = referers?.map((item: any) => item.value)

  const { enable, is_white_list, allow_empty } = refererData.value

  const request = () =>
    editReferApi({
      bucket_id: route.params?.id as string,
      enable: enable as boolean,
      is_white_list: is_white_list as boolean,
      allow_empty: allow_empty as boolean,
      referers: list
    })
      .then(() => {
        Message.success('删除成功')
        getReferData()
      })
      .finally(() => {})
  VcModal.error(
    {
      title: '删除referer',
      content: '确定要删除吗？'
    },
    request
  )
}

const handleValidator = (value: any, callback: any) => {
  const domainReg =
    /^((http:\/\/)|(https:\/\/))([a-zA-Z0-9]([a-zA-Z0-9-_]{0,63}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,11}$/
  if (!value) {
    return callback('referer不允许为空')
  }
  if (!domainReg.test(value)) {
    return callback('URL地址不合适')
  }

  return callback()
}
const handleBeforeOk = () => {
  loading.value = true
  const { enable, is_white_list, allow_empty, refererList } = refererData.value
  const referers = refererList?.map((v: any) => v.value)
  return editReferApi({
    bucket_id: route.params?.id as string,
    enable: enable as boolean,
    is_white_list: is_white_list as boolean,
    allow_empty: allow_empty as boolean,
    referers: referers!.length > 0 ? referers : []
  })
    .then(() => {
      Message.success('保存成功')
      modelValue.value = false
      emit('update')
    })
    .finally(() => {
      loading.value = false
    })
}
const handleBeforeClose = () => {
  modelValue.value = false
  return false
}
const handleDrawerOpen = () => {
  getReferData()
}
</script>
<style scoped lang="less">
.space-setting-table {
  overflow-y: auto;
  max-height: 450px;
}
.vc-referer-header {
  border-top: 1px solid #f2f3f5;
}
:deep(.arco-list-header) {
  padding: 10px 0px 10px 16px !important;
  background: #f2f3f5;
}
:deep(.arco-list-item) {
  @apply py-2! px-4!;

  .arco-list-item-content {
    @apply flex h-full items-start;
  }
}
.referer-form-box {
  // :deep(.arco-form-item) {
  //   width: 86%;
  // }
  :deep(.arco-form-item-label-col) {
    @apply hidden !important;
  }
  // :deep(.arco-form-item-wrapper-col) {
  //   width: 90%;
  //   flex: 0 0 90%;
  // }
}
.icon-container {
  @apply flex items-center justify-center w-8 h-8 rounded-md border border-solid border-[#E5E6EB]  cursor-pointer;
}
</style>
