<template>
  <vc-dialog
    v-model="modelValue"
    title="上传文件"
    destroy-on-close
    ok-text="开始上传"
    :ok-btn-disabled="!filesList.length"
    @close="handleClose"
    :on-before-ok="handleOk"
    @open="handleBeforeOpen"
  >
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item
        class="mb-4!"
        field="key"
        asterisk-position="end"
        validate-trigger="input"
        :hide-asterisk="true"
      >
        <div class="flex flex-col w-full">
          <a-radio-group
            v-model="formState.catalogue"
            class="mb-2"
            @change="handleChange"
          >
            <a-radio :value="0" class="mr-6!">当前目录</a-radio>
            <a-radio :value="1">指定目录</a-radio>
          </a-radio-group>
          <div class="current-dir" v-if="!formState.catalogue">
            根目录/{{ formState.key }}
          </div>
          <a-input
            v-else
            class="file-input"
            v-model="formState.key"
            :disabled="!formState.catalogue"
            placeholder="请输入文件夹"
          >
            <template #prepend> 根目录/</template>
          </a-input>
        </div>
        <template v-if="formState.catalogue == 1" #help>
          <div class="mt-2 font-400! text-12px leading-18px">
            <div>
              1. 目录以 <span class="color-ct-2 font-500">/</span> 结尾，不以
              <span class="color-ct-2 font-500">/</span>
              结尾视为文件名前缀，可指定已有目录或创建新目录；
            </div>
            <div>
              2. 不能包含连续的
              <span class="color-ct-2 font-500">/</span> ，且每个
              <span class="color-ct-2 font-500">/</span> 前不可仅为英文句号
              <span class="color-ct-2 font-500">.</span>
            </div>
          </div>
        </template>
      </a-form-item>
      <a-form-item class="http-switch-item mb-0!">
        <div class="flex w-full items-center">
          <a-upload
            :key="fileKey"
            action="/"
            :auto-upload="false"
            class="mr-2! w-[88px]!"
            multiple
            @change="onChange"
            :show-file-list="false"
          >
            <template #upload-button>
              <a-button type="primary">选择文件</a-button>
            </template>
          </a-upload>
          <a-button v-if="filesList.length" type="outline" @click="handleClean"
            >清空文件</a-button
          >
        </div>
      </a-form-item>
      <div class="my-2 text-12px color-ct-3 leading-18px">
        若存在同名文件，默认新上传的文件将覆盖已存在文件，请注意！
      </div>
      <vc-table
        sticky-header
        v-if="filesList.length"
        class="mt-4 h-254px!"
        :data="filesList"
        :columns="[
          {
            dataIndex: 'name',
            title: '文件名',
            slotName: 'name',
            cellStyle: { minWidth: '200px' },
            ellipsis: true,
            tooltip: true
          },

          {
            dataIndex: 'file_size',
            slotName: 'file_size',
            title: '文件大小',
            cellStyle: { minWidth: '180px' }
          },
          {
            dataIndex: 'actions',
            title: '操作',
            width: 80,
            slotName: 'actions',
            cellClass: 'table-actions'
          }
        ]"
      >
        <template #name="{ record }">
          {{ record.file?.name }}
        </template>
        <template #file_size="{ record }">
          {{ convertByte(record.file?.size) }}
        </template>
        <template #actions="{ rowIndex }">
          <a-link
            :hoverable="false"
            @click="handleRemove(rowIndex)"
            type="primary"
            status="danger"
          >
            移除
          </a-link>
        </template>
      </vc-table>

      <a-upload
        v-else
        draggable
        multiple
        class="draggable-upload"
        action="/"
        @change="onChange"
        :show-file-list="false"
        :auto-upload="false"
        :key="fileKey + '1'"
      >
        <template #upload-button>
          <div class="draggable-upload-button">
            <vc-svg-icon prefix="oss" name="icon_upload" />
            <div class="mt-4 sub-title">未选择文件</div>
            <div class="mt-1 sub-text">支持拖拽文件到此处上传</div>
          </div>
        </template>
      </a-upload>
    </a-form>
  </vc-dialog>
</template>

<script setup lang="ts">
import {
  type FieldRule,
  type FileItem,
  type FormInstance
} from '@arco-design/web-vue'
import { convertByte } from 'vc-material'

import type { CustomFileItem } from '@/stores/modules/taskCenter'
import { useTaskCenterStore } from '@/stores/modules/taskCenter'

const modelValue = defineModel<boolean>({ required: true })
const taskCenterStore = useTaskCenterStore()

const route = useRoute()
const catalogUrl = defineModel<string>('catalogUrl', {
  required: true
})

const spaceName = defineModel<string>('spaceName')
const formRef = ref<FormInstance>()

const formState = ref({
  catalogue: 0,
  key: ''
})

const fileKey = ref(0)

const filesList = ref<FileItem[]>([])

const rules = computed<Record<string, FieldRule[]>>(() => {
  const res: Record<string, FieldRule[]> = {
    key: [
      {
        required: true,
        validator(value: string, callback) {
          if (!value) return true

          // 不能出现连续的 '/' ，且每个 '/' 前不可仅为英文句号 '.'
          if (value.includes('//') || value.includes('./')) {
            return callback('请输入正确的目录')
          }
          return true
        }
      }
    ]
  }
  return res
})

/**单选按钮改变时触发 */
const handleChange = () => {
  formState.value.key = catalogUrl.value
}

const handleClean = () => {
  filesList.value = []
  fileKey.value = Math.random()
}

const handleRemove = (index: number) => {
  filesList.value.splice(index, 1)
  fileKey.value = Math.random()
}

const onChange = (fileList: FileItem[]) => {
  if (!fileList.length) return
  const list = filesList.value.filter(
    item => !fileList.some(v => item.file?.name === v.file?.name)
  )

  filesList.value = [...list, ...fileList]
  // fileKey.value = Math.random()
}

const handleClose = () => {
  formRef.value?.resetFields()
  filesList.value = []
  formState.value.catalogue = 0
  fileKey.value = Math.random()
}

const handleOk = async () => {
  const err = await formRef.value?.validate()
  if (err) return false
  pushUploadFileList()
  handleClose()
  return true
}

const pushUploadFileList = () => {
  const bucket_id = route.params.id as string
  let data = filesList.value

  const getKey = (file: FileItem) => `${formState.value.key}${file.file!.name!}`
  const isExist = (key: string, item: CustomFileItem) =>
    item.params.key === key && item.params.bucket_id === bucket_id

  data.forEach(v => {
    const key = getKey(v)
    const index = taskCenterStore.taskFileList.findIndex(item =>
      isExist(key, item)
    )
    if (index !== -1) {
      // 取消上传，删除
      taskCenterStore.cancel(index)
      taskCenterStore.taskFileList.splice(index, 1)
    }
  })

  const list = data.map(item => {
    const key = getKey(item)
    const params = {
      key,
      bucket_id
    }
    return {
      params,
      etags: [],
      progress: 0,
      realProgress: 0,
      status: 'ready',
      file: item.file!,
      position: `${spaceName.value}/${formState.value.key}`
    } satisfies CustomFileItem
  })
  taskCenterStore.taskFileList.push(...list)
  // 开始上传
  taskCenterStore.start()
}

const handleBeforeOpen = () => {
  formState.value.key = catalogUrl.value
}

watch(catalogUrl, val => {
  if (val) {
    formState.value.catalogue = 0
    formState.value.key = val
  }
})
</script>

<style lang="less" scoped>
.file-input {
  :deep(.arco-input-prepend) {
    color: var(--color-text-3);
  }
}
.draggable-upload-button {
  &:hover {
    background-color: var(--color-fill-1);
  }
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 254px;
  border: 1px dashed var(--color-border-2, #e5e6eb);
  border-radius: 6px;
  transition: background-color 0.15s;
  flex-direction: column;
  .sub-text {
    font-size: 12px;
    line-height: 18px;
    color: var(--color-text-3);
  }
}

.current-dir {
  padding: 6px 12px;
  color: var(--color-text-3);
  background: var(--color-fill-2, #f2f3f5);
  border-radius: 6px;
}
</style>
