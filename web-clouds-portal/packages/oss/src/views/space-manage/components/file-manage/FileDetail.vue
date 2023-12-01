<template>
  <a-drawer
    v-model:visible="modelValue"
    title="文件详情"
    :width="600"
    :esc-to-close="false"
    :mask-closable="false"
    :closable="!loading"
    :ok-loading="loading"
    @before-open="handleDrawerOpen"
    @before-cancel="handleBeforeClose"
    destroy-on-close
    :footer="false"
    class="vc-drawer"
  >
    <div class="rounded p-4 bg-[#F7F8FA] flex flex-col gap-y-2">
      <span class="flex items-center">
        <span
          class="pr-1 text-[var(--color-text-1)] font-medium text-sm leading-5"
          >{{ catalogUrl! }} {{ record?.key }}
        </span>
        <vc-svg-icon
          name="copy"
          prefix="oss"
          class="cursor-pointer"
          @click="handleCopyData(catalogUrl.concat(record?.key))"
        ></vc-svg-icon>
      </span>
      <span class="text-[var(--color-text-2)] text-sm leading-5"
        >Etag：{{ record?.etag }}</span
      >
      <span class="flex text-[var(--color-text-2)]">
        <span class="px-1 bg-[#E5E6EB] rounded-sm!"
          >文件类型：{{ record?.content_type }}</span
        >

        <span class="px-1 bg-[#E5E6EB] ml-1 rounded-sm!"
          >大小：{{ convertByte(Number(record?.size)) }}</span
        >
      </span>
    </div>
    <a-form ref="formRef" :model="formState" layout="vertical">
      <a-form-item label="外链域名" class="mb-8!">
        <a-select
          v-model="formState.base_url"
          placeholder="请选择"
          :options="options"
          @change="handleLinkDomain"
        >
        </a-select>
      </a-form-item>
      <a-form-item label="" class="mb-8! file-detail-link">
        <template #label>
          <div class="flex items-center justify-between">
            <span>文件链接</span>
            <span class="flex items-center">
              <span
                class="flex items-center cursor-pointer"
                @click="handleDownload"
              >
                <vc-svg-icon
                  name="download"
                  class="mr-1"
                  prefix="oss"
                ></vc-svg-icon>
                <span class="text-[rgb(var(--primary-6))]!">下载</span>
              </span>
              <span
                class="flex items-center pl-4 cursor-pointer"
                @click="handleCopyData(formState.fileUrl)"
              >
                <vc-svg-icon
                  name="file_copy"
                  class="mr-1"
                  prefix="oss"
                ></vc-svg-icon>
                <span class="text-[rgb(var(--primary-6))]!">复制文件URL</span>
              </span>
            </span>
          </div>
        </template>
        <a-textarea
          v-model="formState.fileUrl"
          placeholder="请输入"
          :auto-size="{ minRows: 4 }"
        />
      </a-form-item>
      <a-form-item
        v-if="space_role"
        field="name"
        label="访问过期时间（秒)"
        class="mb-8!"
      >
        <a-input-number
          v-model="formState.expire_sec"
          placeholder="Please Enter"
          class="input-demo"
          :min="1"
          :max="3600"
          @change="handleLinkDomain"
        />
      </a-form-item>
      <div
        v-if="Number(formState.expiredTime)"
        class="mb-8 text-[var(--color-text-1)] text-sm"
      >
        文件过期时间：{{ formatUnix(Number(formState.expiredTime)) }}
      </div>
      <a-form-item field="name" label="" class="mb-8!">
        <template #label>
          <div>
            <span>元数据定义</span>
            <div class="text-xs text-[var(--color-text-3)]">
              自定义元数据，在 Header 中返回时均会冠以 x-amz-meta
              的前缀，例如，name: value 的元数据，会以 x-amz-meta-name: value 在
              Header 中返回。
            </div>
          </div>
        </template>
        <div class="file-detail-table flex-1">
          <a-row class="file-detail-header">
            <a-col :span="10">参数</a-col>
            <a-col :span="10">值</a-col>
            <a-col :span="4" class="pl-2!">操作</a-col>
          </a-row>
          <a-row
            v-for="(item, index) in formState.tableList"
            :key="index"
            class="file-detail-row"
          >
            <a-col :span="10">
              <a-form-item
                :field="`tableList[${index}].label`"
                :hide-asterisk="true"
                hide-label
                :rules="[{ required: true, validator: handleValidator }]"
                validate-trigger="change"
                class="flex flex-col mb-0! flex-1"
              >
                <a-input
                  v-model="item.label"
                  :disabled="item.edit"
                  :max-length="50"
                  placeholder="请输入参数"
                />
              </a-form-item>
            </a-col>
            <a-col :span="10" class="pl-2">
              <a-form-item
                :field="`tableList[${index}].value`"
                :hide-asterisk="true"
                hide-label
                :rules="[{ required: true, validator: handleValidatorValue }]"
                validate-trigger="change"
                class="flex flex-col mb-0! flex-1"
              >
                <a-input
                  v-model="item.value"
                  :disabled="item.edit"
                  :max-length="100"
                  placeholder="请输入值"
                />
              </a-form-item>
            </a-col>
            <a-col
              :span="4"
              class="pl-2! flex items-center gap-x-4"
              :class="!item.edit ? ' h-8 leading-8' : ''"
            >
              <div
                v-if="item.edit"
                class="icon-container"
                @click="handleEdit(item)"
              >
                <vc-svg-icon
                  prefix="oss"
                  name="icon_edit"
                  :size="16"
                ></vc-svg-icon>
              </div>
              <div v-else class="icon-container" @click="handleOk(item, index)">
                <vc-svg-icon
                  prefix="oss"
                  name="icon_save"
                  :size="16"
                ></vc-svg-icon>
              </div>
              <div class="icon-container" @click="handleDelete(item, index)">
                <vc-svg-icon
                  prefix="oss"
                  name="icon_delete"
                  :size="16"
                ></vc-svg-icon>
              </div>
            </a-col>
          </a-row>
          <div class="add-file-btn">
            <a-button
              type="outline"
              class="flex items-center cursor-pointer border-primary!"
              @click="handleClick"
              :disabled="formState.tableList?.length > 9"
            >
              <vc-svg-icon
                prefix="oss"
                name="add_file"
                class="mr-1"
              ></vc-svg-icon>
              <a-link :hoverable="false" type="primary"> 添加 </a-link>
            </a-button>
          </div>
        </div>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
import { type FormInstance } from '@arco-design/web-vue'
import { Message } from '@arco-design/web-vue'
import {
  getObjectsMetadataDetailApi,
  getObjectsPreSignApi,
  setDomainApi,
  updateObjectsMetadataApi
} from '@vcp/apis/oss'
import { cloneDeep } from 'lodash-es'
import { convertByte, formatUnix, useClipboard } from 'vc-material'
import { useRoute } from 'vue-router'

import type { SelectData } from '@/components/SelectData'
import { SPACE_OUT_LINK_DOMAIN } from '@/components/SelectData'
import { type IDownLoadList } from '@/hooks/useDownloadCsv'

const record = defineModel<any>('record', {
  required: true
})
const options = defineModel<SelectData[]>('options', {
  required: true
})

const space_role = defineModel<boolean>('space_role', {
  required: true
})

const catalogUrl = defineModel<string>('catalogUrl', {
  required: true
})

const baseOutDomain = defineModel<string>('baseOutDomain', {
  required: true
})

const emit = defineEmits<{
  (event: 'update-domain'): void
}>()

const formRef = ref<FormInstance>()

const { copy: handleCopy } = useClipboard()

const handleCopyData = (copyData: string) => {
  try {
    handleCopy(copyData)
    Message.success('复制成功')
  } catch (e) {
    Message.error('复制失败')
  }
}
const modelValue = defineModel<boolean>()
const loading = defineModel<boolean>('loading', { default: false })
const route = useRoute()

const formState = ref<any>({
  id: '',
  base_url: '',
  expire_sec: 300,
  download: '',
  fileUrl: '',
  expiredTime: 0,
  tableList: []
})

const handleBeforeClose = (): boolean => {
  formRef.value?.resetFields()
  formState.value.tableList = []
  emit('update-domain')
  return true
}

const dataCsv = ref<IDownLoadList[]>([])

/** 获取外链 */
const handleLinkDomain = () => {
  const domain_id = SPACE_OUT_LINK_DOMAIN.value.find(
    item => item?.value === formState.value.base_url
  )?.id
  domain_id
    ? setDomainApi({
        bucket_id: route.params.id as string,
        domain_id: domain_id
      })
    : Message.error('设置默认域名失败')

  getObjectsPreSignApi({
    bucket_id: route.params?.id as string,
    keys: [catalogUrl.value.concat(record.value?.key)],
    expire_sec: formState.value.expire_sec,
    base_url: formState.value.base_url ? formState.value.base_url : undefined
  }).then(res => {
    const list = res?.list || []
    formState.value.fileUrl = list[0].url
    formState.value.download = list[0].download_url
    formState.value.expiredTime = Number(list[0].expire_time)
    dataCsv.value.push({
      key: list[0].key,
      url: list[0].download_url
    })
  })
}

const handleValidator = (value: any, callback: ValidateCallback) => {
  const domainReg = /^[a-zA-Z0-9]{1,20}$/
  if (!value) {
    return callback('不允许为空')
  }
  if (!domainReg.test(value)) {
    return callback('包含非法字符')
  }
  return true
}

const handleValidatorValue = (value: any, callback: ValidateCallback) => {
  const domainReg = /^[a-zA-Z0-9]{1,20}$/
  if (!value) {
    return callback('不允许为空')
  }
  if (!domainReg.test(value)) {
    return callback('包含非法字符')
  }
  return true
}

const handleDelete = (item: any, index: number) => {
  if (item.id) {
    const list = cloneDeep(formState.value.tableList)
    list.splice(index, 1)
    const meta: Record<string, any> = {}
    list.map((item: any) => {
      //@ts-ignore
      meta[item.label] = item.value
    })
    handleEditMetaData(item, meta, index + 1)
    return
  }
  formState.value.tableList.splice(index, 1)
}

/**添加元信息 */
const handleClick = () => {
  formState.value?.tableList.push({
    label: '',
    value: '',
    edit: false
  })
}

const handleDownload = () => {
  window.open(formState.value.download)
}

/**获取元数据 */
const getMetadata = () => {
  loading.value = true
  getObjectsMetadataDetailApi({
    bucket_id: route.params?.id as string,
    key: catalogUrl.value.concat(record.value?.key)
  })
    .then(res => {
      for (const key in res.list) {
        formState.value.tableList.push({
          id: key,
          label: key,
          value: res.list[key],
          edit: true
        })
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const handleDrawerOpen = () => {
  formState.value.base_url = baseOutDomain.value
  getMetadata()
  handleLinkDomain()
}

const handleEdit = (v: any) => {
  v.edit = !v.edit
}

const handleOk = async (item: any, index: number) => {
  const error = await formRef.value?.validateField([
    `tableList[${index}].label`,
    `tableList[${index}].value`
  ])
  if (error) return
  const { tableList } = formState.value
  const meta = {}
  tableList.map((item: any) => {
    //@ts-ignore
    meta[item.label] = item.value
  })
  handleEditMetaData(item, meta)
}

const handleEditMetaData = (item: any, meta: any, index?: number) => {
  updateObjectsMetadataApi({
    bucket_id: route.params?.id as string,
    key: catalogUrl.value.concat(record.value?.key),
    meta
  }).then(() => {
    item.edit = true
    item.id = item.label
    if (index) {
      formState.value.tableList.splice(index - 1, 1)
    }
  })
}
</script>

<style scoped lang="less">
.file-detail-link {
  :deep(.arco-form-item-label) {
    @apply w-full;
  }
}

.file-detail-table {
  @apply rounded;
  border: 1px solid #f2f3f5;
  .file-detail-header {
    @apply flex h-10 leading-10 font-medium w-full mb-4 bg-[#F2F3F5];
    color: var(--color-text-1);
    .arco-col {
      @apply pl-4;
    }
  }
  .file-detail-row {
    @apply items-start px-4;
    // border-bottom: 1px solid #f2f3f5;
    &:last-child {
      @apply border-b-none;
    }

    .icon-container {
      @apply flex items-center justify-center w-8 h-8 rounded-md border border-solid border-[#E5E6EB]  cursor-pointer;
    }
  }
  .add-file-btn {
    @apply h-10 leading-10 m-4 mt-2 flex items-center justify-start;
  }
}
</style>
