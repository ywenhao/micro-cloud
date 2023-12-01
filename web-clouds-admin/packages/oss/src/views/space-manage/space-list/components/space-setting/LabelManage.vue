<template>
  <div class="space-setting-table" id="anthor-label">
    <div class="flex flex-col vc-referer-header pb-2">
      <span class="space-table-title">标签管理</span>

      <span class="space-table-sub-title">
        可以为空间添加分类标签，每个空间最多10对。<br />
        每个空间最多可添加 10
        对标签，标签区分大小写，仅支持大小写字母、数字、空格、+ - = . _ : /
        @</span
      >
    </div>
    <a-list>
      <template #header>
        <div
          class="text-[var(--color-text-1)] text-sm font-medium flex items-center"
        >
          <span class="flex-1 grid grid-cols-2 gap-x-4 items-center">
            <span>标签键</span>
            <span>标签值</span>
          </span>
          <span class="w-[100px]">操作</span>
        </div>
      </template>
      <a-form ref="formLabelRef" :model="tagData" class="label-form-box">
        <a-list-item v-for="(item, index) in tagData.labelList" :key="index">
          <span class="flex-1 grid grid-cols-2 gap-x-4 items-start">
            <span v-if="item.edit" class="h-8 leading-8">{{ item.key }}</span>
            <a-form-item
              v-else
              :field="`labelList[${index}].key`"
              :hide-asterisk="true"
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

            <span v-if="item.edit" class="h-8 leading-8">{{ item.val }}</span>
            <a-form-item
              v-else
              :field="`labelList[${index}].val`"
              :hide-asterisk="true"
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
          </span>

          <span class="w-[100px]! gap-x-4 flex pl-4! h-8 items-center">
            <a-link
              v-if="item.edit"
              :hoverable="false"
              class="ml-0!"
              @click="handleEdit(item, index)"
              type="primary"
            >
              编辑
            </a-link>
            <a-spin v-else class="inline" :loading="item.loading">
              <a-link
                :hoverable="false"
                type="primary"
                class="ml-0!"
                @click="handleOk(item, index)"
                :disabled="item.loading"
              >
                保存
              </a-link>
            </a-spin>
            <a-link
              v-if="item.edit"
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
      </a-form>
      <a-list-item class="add-list-item">
        <a-button
          class="flex items-center mx-auto! bg-white! text-[#2253E6]!"
          @click="handleAdd"
          :disabled="tagData.labelList.length >= 10"
        >
          <vc-svg-icon prefix="oss" name="add_file" class="mr-1"></vc-svg-icon>
          添加一行
        </a-button>
      </a-list-item>
    </a-list>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { type FormInstance } from '@arco-design/web-vue'
import {
  addTagApi,
  delTagApi,
  tagListApi,
  type TagModel,
  updateTagApi
} from '@vca/apis/oss'
import { VcModal } from 'vc-material'
import { useRoute } from 'vue-router'

const route = useRoute()

const tagData = ref<{ labelList: TagModel[] }>({
  labelList: [
    { id: '', key: 'key1', val: 'value1', edit: false, loading: false }
  ]
})

const tagDataClone = reactive<TagModel[]>([])

const handleEdit = (v: any, index: number, flag?: 'cancel') => {
  v.edit = !v.edit
  if (flag && !v.id) {
    tagData.value.labelList.splice(index, 1)
  }

  if (!v.edit) {
    tagDataClone[index] = { ...v }
  } else {
    // 取消
    const item = tagDataClone[index] || {}
    if (item.key || item.val) {
      tagData.value.labelList[index] = { ...tagDataClone[index], edit: v.edit }
    } else {
      handleDel(v, index)
      tagDataClone.splice(index, 1)
    }
  }
}

const handleAdd = () => {
  tagData.value.labelList.push({
    key: '',
    val: '',
    edit: false
  })
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
/**添加、修改标签 */
const handleOk = async (item: TagModel, index: number) => {
  const validate = await formLabelRef.value?.validateField([
    `labelList[${index}].val`,
    `labelList[${index}].key`
  ])
  if (!validate) {
    const obj_data = {
      key: item.key,
      val: item.val
    }
    item.loading = true
    const actions = item?.id
      ? updateTagApi({
          ...obj_data,
          id: item.id,
          bucket_id: route.params?.id as string
        })
      : addTagApi({
          ...obj_data,
          bucket_id: route.params?.id as string
        })
    actions
      .then(() => {
        Message.success('操作成功')
        getTagData()
        item.edit = false
      })
      .finally(() => {
        item.loading = false
      })
    return
  }
}

/**删除标签 */
const handleDel = (item: TagModel, index: number) => {
  if (!item.id) {
    tagData.value.labelList.splice(index, 1)
    return
  }
  item.loading = true
  const request = () =>
    delTagApi({
      tag_id: item.id as string,
      bucket_id: route.params?.id as string
    })
      .then(() => {
        Message.success('删除成功')
        getTagData()
      })
      .finally(() => {
        item.loading = false
      })
  VcModal.error(
    {
      title: '删除标签',
      content: '确定要删除这条标签吗？'
    },
    request
  )
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

onMounted(() => {
  getTagData()
  if (route.params?.label) {
    document.getElementById('anthor-label')?.scrollIntoView()
  }
})
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
  :deep(.arco-form-item) {
    width: 86%;
  }
  :deep(.arco-form-item-label-col) {
    @apply hidden !important;
  }
  :deep(.arco-form-item-wrapper-col) {
    width: 100%;
    flex: 0 0 100%;
  }
}
</style>
