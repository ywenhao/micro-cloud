<template>
  <a-drawer
    v-model:visible="modelValue"
    title="新建存储空间"
    :width="600"
    :esc-to-close="false"
    :mask-closable="false"
    :closable="!loading"
    @close="handleBeforeClose"
    destroy-on-close
    cancel-text="取消"
    ok-text="保存"
    class="vc-drawer"
    :ok-loading="loading"
    :on-before-ok="handleBeforeOk"
  >
    <a-form ref="formRef" :model="formState" layout="vertical" :rules="rules">
      <a-form-item
        field="name"
        label="空间名称"
        class="mb-8!"
        validate-trigger="input"
        :hide-asterisk="true"
      >
        <div class="flex items-center">
          <a-input
            v-model="formState.name"
            class="w-[440px]!"
            :max-length="22"
            placeholder="请输入名称"
          />
          <span class="pl-3">-{{ userID }}</span>
        </div>
        <template #extra>
          <div class="text-xs text-ct-3">
            存储空间名称不允许重复，遇到冲突请更换名称。<br />
            名称格式为 3 ~ 22
            个字符，可以包含小写字母、数字、短划线，且必须以小写字母或数字开头和结尾。
          </div>
        </template>
      </a-form-item>
      <a-form-item
        field="region_id"
        hide-asterisk
        label="存储区域"
        class="mb-8!"
      >
        <a-radio-group v-model="formState.region_id" direction="vertical">
          <a-radio
            v-for="item in optionsList"
            :key="item.value"
            :value="item.value"
            >{{ item.label }}</a-radio
          >
        </a-radio-group>
      </a-form-item>
      <a-form-item label="访问权限">
        <template #label>
          <div class="flex flex-col">
            <span>访问权限</span>
            <span class="text-xs text-ct-3"
              >公开和私有仅对空间的读文件生效，修改、删除、写入等对空间的操作均需要拥有者授权才能进行操作</span
            >
          </div>
        </template>
        <a-radio-group v-model="formState.acl">
          <a-radio value="private">私有</a-radio>
          <a-radio value="public-read">公开</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
import {
  type FieldRule,
  type FormInstance,
  Message
} from '@arco-design/web-vue'
import { createSpaceApi } from '@vcp/apis/oss'
import { getMicroAppData } from '@vcp/shared'
import { cloneDeep } from 'lodash-es'

import { REGION_LIST_DATA } from '@/components/SelectData'

const modelValue = defineModel<boolean>()
const microAppData = computed(() => getMicroAppData())

const userID = computed(() => microAppData.value.userInfo?.id)

const loading = defineModel<boolean>('loading', { default: false })
const optionsList = computed(() => {
  const regionList = cloneDeep(REGION_LIST_DATA.value)
  const index = regionList.findIndex((item: any) => item.label === '全部区域')
  regionList.splice(index, 1)
  return regionList
})

const formState = ref({
  name: '',
  region_id: '',
  acl: 'private'
})

const emit = defineEmits<{
  (event: 'reload'): void
}>()

const formRef = ref<FormInstance>()

const rules = computed<Record<string, FieldRule[]>>(() => {
  const res: Record<string, FieldRule[]> = {
    region_id: [{ required: true, message: '请选择存储区域' }],
    name: [
      {
        required: true,
        validator(value, callback) {
          const domainReg = /^[a-z0-9][-a-z0-9]{1,20}[a-z0-9]$/

          if (!value) {
            return callback('请输入空间名称')
          }
          if (!domainReg.test(value)) {
            return callback('请输入正确的空间名称')
          }
          return callback()
        }
      }
    ]
  }
  return res
})

const handleBeforeClose = (): boolean => {
  formRef.value?.resetFields()
  formState.value.region_id = ''
  formState.value.acl = 'private'

  return true
}

const handleEditorSubmit = () => {
  return new Promise<boolean>((resolve, reject) => {
    loading.value = true
    createSpaceApi({
      ...formState.value
    })
      .then(() => {
        Message.success('添加成功')
        emit('reload')

        resolve(true)
      })
      .catch(() => reject())
      .finally(() => {
        loading.value = false
      })
  })
}

const handleBeforeOk = (done: (closed: boolean) => void) => {
  formRef.value
    ?.validate()
    .then(res => {
      if (!res) {
        return handleEditorSubmit()
      }
      done(false)
    })
    .then(() => done(true))
    .catch(() => done(false))
}
</script>
