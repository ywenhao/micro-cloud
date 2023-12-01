<template>
  <div class="space-setting-table">
    <div class="flex flex-col">
      <span class="space-table-title">Referer防盗链</span>
      <span class="space-table-sub-title">
        HTTP Referer 黑白名单配置，用于防止盗链。</span
      >

      <a-space class="text-[var(--color-text-1)] mt-2">
        状态
        <a-switch
          v-model="refererData!!.enable"
          size="small"
          @change="handleChange"
        />
      </a-space>
    </div>
    <div v-if="refererData!!.enable" class="mt-4 vc-referer-header">
      <div class="vc-refer-table-header flex justify-between mt-4">
        <a-space class="text-[var(--color-text-1)]">
          黑白名单配置：
          <a-radio-group
            v-model="refererData!!.is_white_list"
            @change="handleChange"
          >
            <a-radio :value="true">白名单</a-radio>
            <a-radio :value="false">黑名单</a-radio>
          </a-radio-group>
        </a-space>
        <a-space class="text-[var(--color-text-1)]">
          允许空Referer：
          <a-switch
            v-model="refererData!!.allow_empty"
            size="small"
            @change="handleChange"
          />
        </a-space>
      </div>
      <a-list class="mt-4">
        <template #header>
          <div
            class="text-[var(--color-text-1)] text-sm font-medium flex items-center"
          >
            <span class="flex-1">Referer</span>
            <span class="w-[100px]">操作</span>
          </div>
        </template>
        <a-form ref="formRef" :model="refererData" class="referer-form-box">
          <a-list-item
            v-for="(item, index) in refererData?.refererList"
            :key="index"
          >
            <span v-if="item?.edit" class="flex-1">{{ item.value }}</span>
            <a-form-item
              v-else
              :field="`refererList[${index}].value`"
              :hide-asterisk="true"
              :rules="[{ required: true, validator: handleValidator }]"
              validate-trigger="change"
              class="flex flex-col mb-0! flex-1"
            >
              <a-input
                v-model="item.value"
                placeholder="请输入URL"
                class="w-11/12!"
              />
            </a-form-item>

            <span class="w-[100px]! flex pl-2! gap-x-4 h-8 items-center">
              <a-link
                v-if="item?.edit"
                :hoverable="false"
                @click="handleEdit(item, index)"
                type="primary"
                class="ml-0!"
              >
                编辑
              </a-link>
              <a-spin v-else class="inline" :loading="item?.loading">
                <a-link
                  :hoverable="false"
                  type="primary"
                  @click="handleOk(item, index)"
                  class="ml-0!"
                  :disabled="item?.loading"
                >
                  保存
                </a-link>
              </a-spin>
              <a-link
                v-if="item?.edit"
                :hoverable="false"
                type="primary"
                status="danger"
                class="ml-0!"
                @click="handleDel(item, index)"
              >
                删除
              </a-link>
              <a-link
                v-else
                :hoverable="false"
                type="primary"
                class="ml-0!"
                @click="handleEdit(item, index, 'cancel')"
              >
                取消
              </a-link>
            </span>
          </a-list-item>
          <a-list-item>
            <span
              class="flex items-center mx-auto cursor-pointer"
              @click="handleAdd"
            >
              <vc-svg-icon
                prefix="oss"
                name="add_file"
                class="mr-1"
              ></vc-svg-icon>
              <a-link :hoverable="false" type="primary"> 添加一行 </a-link>
            </span>
          </a-list-item>
        </a-form>
      </a-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { type FormInstance } from '@arco-design/web-vue'
import { editReferApi, refererListApi, type refererModel } from '@vca/apis/oss'
import { cloneDeep } from 'lodash-es'
import { VcModal } from 'vc-material'
import { useRoute } from 'vue-router'

const route = useRoute()

const refererDataClone = reactive<string[]>([])

const handleEdit = (v: any, index: number, flag?: 'cancel') => {
  v.edit = !v.edit
  if (flag && !v.id) v.value = ''
  if (!v.edit) {
    refererDataClone[index] = v.value
  } else {
    v.value = refererDataClone[index]
  }
}

const formRef = ref<FormInstance>()

const refererData = ref<refererModel>({
  allow_empty: false,
  enable: false,
  is_white_list: false,
  list: [],
  refererList: []
})

const handleAdd = () => {
  refererData.value?.refererList?.push({
    value: '',
    edit: false,
    message: ''
  })
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

const handleChange = (item?: any) => {
  const { enable, is_white_list, allow_empty, refererList } = refererData.value
  const referers = refererList?.map((v: any) => v.value)
  if (item) item.loading = true
  editReferApi({
    bucket_id: route.params?.id as string,
    enable: enable as boolean,
    is_white_list: is_white_list as boolean,
    allow_empty: allow_empty as boolean,
    referers
  })
    .then(() => {
      if (item) item.edit = false
      getReferData()
    })
    .finally(() => {
      if (item && item?.value) {
        item.loading = false
      }
    })
}

const handleOk = async (item: any, index: number) => {
  const validate = await formRef.value?.validateField([
    `refererList[${index}].value`
  ])
  !validate && handleChange(item)
}

/**删除referer */
const handleDel = (item: any, index?: number) => {
  if (!item.id) {
    refererData.value.refererList?.splice(index as number, 1)
    return
  }
  const referers = cloneDeep(refererData.value.refererList)
  referers?.splice(index as number, 1)

  const list = referers?.map((item: any) => item.value)

  const { enable, is_white_list, allow_empty } = refererData.value

  item.loading = true
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
      .finally(() => {
        item.loading = false
      })
  VcModal.error(
    {
      title: '删除referer',
      content: '确定要删除吗？'
    },
    request
  )
}

onMounted(() => {
  getReferData()
})
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
  :deep(.arco-form-item) {
    width: 86%;
  }
  :deep(.arco-form-item-label-col) {
    @apply hidden !important;
  }
  :deep(.arco-form-item-wrapper-col) {
    width: 90%;
    flex: 0 0 90%;
  }
}
</style>
