<template>
  <vc-container
    admin
    header-bordered
    class="rounded-sm! storage-limit"
    page-title="存储限制"
  >
    <div class="pt-4">
      <div class="text-[var(--color-text-1)] text-base leading-4 font-medium">
        空间访问限制
        <span class="text-[var(--color-text-3)] text-xs pl-2"
          >注：限速生效跨度为1分钟</span
        >
      </div>
      <div class="pt-4 text-[var(--color-text-3)] text-sm font-medium">
        单位时间：1分
      </div>
      <a-form
        ref="formRef"
        :model="formState"
        layout="vertical"
        :rules="rules"
        class="mt-4"
      >
        <div class="flex">
          <a-form-item
            field="max_write_ops"
            label="写最大请求数"
            asterisk-position="end"
            required
            class="w-[136px]! mr-14 flex"
          >
            <a-input-number
              v-model="formState.max_write_ops"
              placeholder="请输入"
              :min="5000"
              :default-value="60000"
              :max="100000"
              :precision="0"
              class="flex-1 input-demo"
              :hide-button="!editShow"
              :key="String(editShow)"
              :disabled="!editShow"
            >
            </a-input-number>
            <span class="request-count">次</span>
          </a-form-item>
          <a-form-item
            field="max_write_bytes"
            label="写最大请求量"
            asterisk-position="end"
            required
            class="w-[136px]! mr-14 flex"
          >
            <a-input-number
              v-model="formState.max_write_bytes"
              placeholder="请输入"
              :min="1"
              :default-value="7"
              :precision="0"
              :max="1024"
              class="flex-1"
              :key="String(editShow)"
              :hide-button="!editShow"
              :disabled="!editShow"
            >
            </a-input-number>
            <a-select
              v-model="wirte_unit"
              class="vc-request-select w-[62px]!"
              :disabled="!editShow"
            >
              <a-option value="MB">MB</a-option>
              <a-option value="GB">GB</a-option>
            </a-select>
          </a-form-item>
          <a-form-item
            field="max_read_ops"
            label="读最大请求数"
            validate-trigger="input"
            asterisk-position="end"
            required
            class="w-[136px]! mr-14 flex"
          >
            <a-input-number
              v-model="formState.max_read_ops"
              placeholder="请输入"
              :min="5000"
              :default-value="60000"
              :precision="0"
              :max="100000"
              class="flex-1"
              :hide-button="!editShow"
              :key="String(editShow)"
              :disabled="!editShow"
            >
            </a-input-number>
            <span class="request-count">次</span>
          </a-form-item>
          <a-form-item
            field="max_read_bytes"
            label="读最大请求量"
            validate-trigger="input"
            asterisk-position="end"
            required
            class="w-[136px]! mr-14 flex"
          >
            <a-input-number
              v-model="formState.max_read_bytes"
              placeholder="请输入"
              :min="1"
              :default-value="7"
              :precision="0"
              :max="1024"
              class="flex-1"
              :hide-button="!editShow"
              :key="String(editShow)"
              :disabled="!editShow"
            >
            </a-input-number>
            <a-select
              v-model="read_unit"
              class="vc-request-select w-[62px]!"
              :disabled="!editShow"
            >
              <a-option value="MB">MB</a-option>
              <a-option value="GB">GB</a-option>
            </a-select>
          </a-form-item>
        </div>
      </a-form>
      <div
        class="pt-6 vc-storage-driver pb-31px"
        :class="time_type === 1 && !editShow ? 'pb-0! border-b-none!' : ''"
      >
        <span v-if="showTime || editShow" class="flex flex-col">
          <span
            class="text-[var(--color-text-1)] text-base leading-4 font-medium"
            >生效时间</span
          >
          <span
            v-if="!editShow"
            class="pt-[22px] text-[var(--color-text-1)] text-sm"
          >
            {{ formatUnix(Number(formState?.effect_at)) }}
          </span>
        </span>
        <div v-if="editShow" class="mt-4">
          <a-select
            v-model="time_type"
            class="w-[136px]!"
            :disabled="!editShow"
          >
            <a-option :value="1">保存立即生效</a-option>
            <a-option :value="0">自定义</a-option>
          </a-select>
          <a-date-picker
            v-if="time_type === 0"
            showTime
            v-model="formState.effect_at"
            value-format="X"
            :show-now-btn="false"
            :timePickerProps="{ hideDisabledOptions: true }"
            :disabled-date="disabledDate"
            :disabledTime="disabledCurrentAfter.time"
            class="w-[200px]! ml-2"
            placeholder="请选择生效时间"
          />
        </div>
      </div>
      <a-button
        v-if="!editShow"
        type="primary"
        class="mt-4!"
        @click="editShow = !editShow"
        >修改</a-button
      >
      <div v-else class="mt-4!">
        <a-button type="primary" @click="handlOk" :loading="loading"
          >保存</a-button
        >
        <a-button type="outline" class="ml-2" @click="handleCancle"
          >取消</a-button
        >
      </div>
    </div>
  </vc-container>
</template>

<script setup lang="ts">
import { type FieldRule } from '@arco-design/web-vue'
import { Message } from '@arco-design/web-vue'
import { editStorageLimitApi, storageLimitApi } from '@vca/apis/oss'
import { cloneDeep } from 'lodash-es'
import { convertByte, disabledCurrentAfter, formatUnix } from 'vc-material'

import type { ByteConverNode } from '@/types/node-manage'
import type { StorageLimitData } from '@/types/storage-limit'
import { getUnixZero } from '@/utils'

const formState = ref<StorageLimitData>({
  id: '',
  max_read_ops: 0,
  max_write_bytes: 0,
  max_storage_bytes: '0',
  max_bucket_num: 0,
  max_write_ops: 0,
  max_read_bytes: 0,
  effect_at: '1'
})

const disabledDate = (current: Date | undefined) => {
  return (
    disabledCurrentAfter.date(current) ||
    getUnixZero(current as unknown as number) * 1000 - getUnixZero(Date.now()) >
      366 * 24 * 60 * 60 * 1000
  )
}

const wirte_unit = ref<string>('GB')
const read_unit = ref<string>('GB')
const time_type = ref<number>(1)
const showTime = ref<boolean>(false)
const loading = ref<boolean>(false)
let old_data = reactive({})

const rules = computed<Record<string, FieldRule[]>>(() => {
  const res: Record<string, FieldRule[]> = {
    max_write_ops: [{ required: true, message: '请输入写最大请求数' }],
    max_write_bytes: [{ required: true, message: '请输入写最大请求量' }],
    max_read_ops: [{ required: true, message: '请输入读最大请求数' }],
    max_read_bytes: [{ required: true, message: '请输入读最大请求量' }]
  }
  return res
})

const editShow = ref<boolean>(false)
const formRef = ref()

const handleCancle = () => {
  formState.value = { ...old_data } as StorageLimitData
  editShow.value = false
}

const getBytesData = (data: number, unit: string) => {
  return unit === 'GB'
    ? Number(data) * 1024 * 1024 * 1024
    : Number(data) * 1024 * 1024
}

const handlOk = () => {
  formRef.value?.validate().then(() => {
    loading.value = true
    const { max_write_bytes, max_read_bytes, effect_at } = formState.value
    const obj_data: any = { ...formState.value }
    obj_data.max_write_bytes = String(
      getBytesData(max_write_bytes, wirte_unit.value)
    )

    obj_data.max_read_bytes = String(
      getBytesData(max_read_bytes, read_unit.value)
    )
    obj_data.effect_at = time_type.value === 1 ? '1' : effect_at
    editStorageLimitApi({ ...obj_data })
      .then(() => {
        editShow.value = false
        Message.success('修改成功')
        getLimitData()
      })
      .finally(() => {
        loading.value = false
      })
  })
}

const getMaxData = (bytes: string) => {
  return convertByte(Number(bytes), 'B', false, false) as ByteConverNode
}

const getLimitData = () => {
  storageLimitApi()
    .then(res => {
      Object.assign(formState.value, {
        ...res,
        max_write_bytes: Number(res.max_write_bytes),
        max_read_bytes: Number(res.max_read_bytes)
      })

      const { max_read_bytes, max_write_bytes, effect_at } = res
      const max_read = getMaxData(max_read_bytes)
      const max_write = getMaxData(max_write_bytes)
      formState.value.max_read_bytes = Number(max_read.value)
      read_unit.value = max_read.symbols
      formState.value.max_write_bytes = Number(max_write.value)
      wirte_unit.value = max_write.symbols
      time_type.value = effect_at !== '1' ? 0 : 1
      showTime.value = effect_at !== '1'
      formState.value.effect_at = effect_at !== '1' ? effect_at : undefined
      old_data = cloneDeep(formState.value)
    })
    .finally(() => {})
}

onMounted(() => {
  getLimitData()
})
</script>

<style scoped lang="less">
.storage-limit {
  &.vc-container {
    @apply px-6!;
  }
  .vc-storage-driver {
    border-top: 1px solid var(--color-border-1);
    border-bottom: 1px solid var(--color-border-1);
  }
  .arco-form-item {
    @apply mb-6;
    .request-count {
      @apply text-sm leading-8 rounded-tr-md rounded-br-md px-3 h-8;
      color: var(--color-text-3);
      background: var(--color-fill-2);
      border: 1px solid var(--color-border-2);
      border-left: 0px;
    }
    :deep(.vc-request-select) {
      background: var(--color-fill-2);
      border: 1px solid var(--color-border-2);
      @apply rounded-tl-none rounded-bl-none border-l-none;
      .arco-select-view-value {
        @apply text-sm;
      }
      .arco-select-view-suffix {
        @apply pl-1;
      }
    }
  }
  :deep(.arco-input-wrapper) {
    @apply pr-0 rounded-tr-none rounded-br-none;
    &:hover {
      border-color: var(--color-border-2);
    }
    &.arco-input-disabled {
      background: var(--color-fill-1);
    }
    .arco-input-number-step {
      @apply rounded-none;
      button {
        @apply border-none! bg-white;
      }
    }
  }
  :deep(.arco-picker-suffix-icon) {
    color: var(--color-text-3);
  }
}
</style>
