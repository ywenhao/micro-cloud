<template>
  <a-form
    class="max-w-[450px] absolute-msg"
    layout="vertical"
    :model="formState"
    :rules="rules"
    ref="formRef"
  >
    <a-form-item
      validate-trigger="input"
      field="content_str"
      :hide-asterisk="true"
      asterisk-position="end"
    >
      <template #label>
        <div class="flex items-center gap-x-1">
          <span>压缩类型</span>
          <vc-required-symbol class="cursor-pointer" />
          <a-popover position="right">
            <template #title>
              <span class="text-xs">可参考值</span>
            </template>
            <vc-svg-icon prefix="cdn" name="question"></vc-svg-icon>
            <template #content>
              <div
                class="max-w-[372px] text-xs text-[var(--color-text-3)] break-all"
              >
                text/html, text/xml, text/plain, text/css, text/javascript,
                text/json, application/json, application/javascript,
                application/x-javascript, application/xml, application/rss+xml,
                application/xhtml+xml, application/xmltext, image/svg+xml,
                image/tiff
              </div>
            </template>
          </a-popover>
        </div>
      </template>
      <a-textarea
        v-model="formState.content_str"
        :auto-size="{ minRows: 5 }"
        placeholder="内容可多个值，用英文逗号隔开。"
        allow-clear
      />
    </a-form-item>
    <a-form-item
      asterisk-position="end"
      field="rank"
      validate-trigger="change"
      label="压缩级别"
      help="压缩级别数值越高，表示压缩比越大，文件压缩后体积越小，但占用CPU时间更长。"
    >
      <a-select :options="ranks" v-model="formState.rank"></a-select>
    </a-form-item>
    <a-form-item
      asterisk-position="end"
      label="压缩大小"
      required
      field="compress_size"
      :help="
        minSizeRef?.isError || maxSizeRef?.isError
          ? undefined
          : '当文件体积在设置的阈值内时，才会进行压缩，压缩可配置范围1KB-1GB。'
      "
    >
      <div class="flex gap-x-2">
        <a-form-item
          class="mb-0!"
          field="min_size"
          hide-asterisk
          ref="minSizeRef"
          validate-trigger="input"
          asterisk-position="end"
          label="最小文件大小"
        >
          <a-input-group>
            <a-input-number
              v-model="formState.min_size"
              :min="1"
              :step="1"
              :max="max.start"
              @blur="handleSizeMessage('min')"
            ></a-input-number>
            <a-select
              v-model="formState.min_size_unit"
              class="w-[70px]!"
              @change="handleCompressSizeUnitChange('min')"
            >
              <a-option
                v-for="(item, index) in COMPRESS_UNITS.labels"
                :key="item"
                :label="item"
                :value="index"
              />
            </a-select>
          </a-input-group>
        </a-form-item>
        <a-form-item
          class="mb-0!"
          field="max_size"
          hide-asterisk
          ref="maxSizeRef"
          validate-trigger="input"
          asterisk-position="end"
          label="最大文件大小"
        >
          <a-input-group>
            <a-input-number
              v-model="formState.max_size"
              :step="1"
              :min="1"
              :max="max.end"
              @blur="handleSizeMessage('max')"
            ></a-input-number>
            <a-select
              v-model="formState.max_size_unit"
              class="w-[70px]!"
              default-value="GB"
              @change="handleCompressSizeUnitChange('max')"
            >
              <a-option
                v-for="(item, index) in COMPRESS_UNITS.labels"
                :key="item"
                :label="item"
                :value="index"
              />
            </a-select>
          </a-input-group>
        </a-form-item>
      </div>
    </a-form-item>

    <a-form-item hide-label class="mt-6">
      <a-button type="primary" :loading="loading" @click="handleSubmit"
        >保存配置</a-button
      >
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import {
  type FormInstance,
  type FormItemInstance,
  Message
} from '@arco-design/web-vue'
import {
  getCdnGlobalCompressConfigApi,
  postCdnGlobalCompressConfigApi
} from '@vca/apis/cdn'
import { useFormField } from 'vc-material'

import { COMPRESS_UNITS } from '../state'
import type { CompressConfig } from '../types'
import { byteConvertCompress } from '../utils'

const formRef = ref<FormInstance>()
const minSizeRef = ref<FormItemInstance>()
const maxSizeRef = ref<FormItemInstance>()

const formState = reactive({
  content: [] as string[],
  content_str: '',
  rank: 6,
  min_size: 1,
  min_size_unit: 0,
  max_size: 1,
  max_size_unit: 2,
  name: '系统默认压缩规则',
  compress_size: true // 用于form校验
})

type FieldKey = 'max_size' | 'min_size'
const { setFieldError } = useFormField<FieldKey>(formRef)

const sizeMaxMessage = ref('')
const sizeMinMessage = ref('')
watch(sizeMaxMessage, msg => setFieldError('max_size', msg))
watch(sizeMinMessage, msg => setFieldError('min_size', msg))

const rules: Rules = {
  content_str: [
    { required: true, message: '请输入压缩类型' },
    {
      validator(value, callback) {
        // eslint-disable-next-line no-useless-escape
        const reg = /^(([\w\+\-]+\/[\w\+\-]+),?)+(?<!,)$/
        if (!reg.test(value)) {
          return callback('压缩类型格式错误，多个以“,”隔开')
        }
        return true
      }
    },
    {
      // 重复检测
      validator(value, callback) {
        const arr = value.split(',')
        if (arr.length < 2) {
          return true
        }
        const last = arr.pop()
        if (arr.includes(last)) {
          return callback(`${last}已重复`)
        }
        return true
      }
    },
    {
      // 检测受支持的压缩类型
      validator(value, callback) {
        const arr = value.split(',')
        const supportList = [
          'text/html',
          'text/xml',
          'text/plain',
          'text/css',
          'text/javascript',
          'text/json',
          'application/json',
          'application/javascript',
          'application/x-javascript',
          'application/xml',
          'application/rss+xml',
          'application/xhtml+xml',
          'application/xmltext',
          'image/svg+xml',
          'image/tiff'
        ]
        const last = arr.pop()
        if (!supportList.includes(last)) {
          return callback(`${last}暂不支持压缩`)
        }
        return true
      }
    }
  ],
  max_size: [
    { required: true, message: '请输入最大文件大小' },
    {
      validator: checkMaxSize
    }
  ],
  min_size: [
    { required: true, message: '请输入最小文件大小' },
    {
      validator: checkMinSize
    }
  ]
}

function checkMaxSize(value: any, callback: ValidateCallback) {
  if (
    value * COMPRESS_UNITS.values[formState.max_size_unit] <
    formState.min_size * COMPRESS_UNITS.values[formState.min_size_unit]
  ) {
    return callback('压缩范围结束值不能小于开始值')
  }
  return true
}
function checkMinSize(value: any, callback: ValidateCallback) {
  if (
    value * COMPRESS_UNITS.values[formState.min_size_unit] >
    formState.max_size * COMPRESS_UNITS.values[formState.max_size_unit]
  ) {
    return callback('压缩范围开始值不能大于结束值')
  }
  return true
}

/** 计算出输入框最大值 */
const max = reactive({
  start: computed(() => {
    if (formState.min_size_unit === 0) return 1024
    if (formState.min_size_unit === 1) return 1024
    return 1
  }),
  end: computed(() => {
    if (formState.max_size_unit === 0) return 1024
    if (formState.max_size_unit === 1) return 1024
    return 1
  })
})

const ranks = Array.from({ length: 9 }, (_, i) => ({
  label: `${i + 1}级`,
  value: i + 1
}))

const handleSizeMessage = (type: string) => {
  if (type === 'max') {
    if (!formState.max_size) {
      sizeMaxMessage.value = '请输入最大文件大小'
    } else if (formState.max_size > 1 && formState.max_size_unit === 2) {
      formState.max_size = 1
      // return ToastUtils.warning('压缩范围不在取值范围')
    } else if (
      (formState.max_size >= 1024 && formState.max_size_unit === 1) ||
      (formState.max_size >= 1024 && formState.max_size_unit === 0)
    ) {
      formState.max_size = 1
      formState.max_size_unit += 1
      // return ToastUtils.warning('压缩范围不在取值范围')
    } else {
      sizeMaxMessage.value = ''
    }
  } else {
    if (!formState.min_size) {
      sizeMinMessage.value = '请输入最小文件大小'
    } else if (formState.min_size > 1 && formState.min_size_unit === 2) {
      formState.min_size = 1
      // return ToastUtils.warning('压缩范围不在取值范围')
    } else if (
      (formState.min_size >= 1024 && formState.min_size_unit === 1) ||
      (formState.min_size >= 1024 && formState.min_size_unit === 0)
    ) {
      formState.min_size = 1
      formState.min_size_unit += 1
      // return ToastUtils.warning('压缩范围不在取值范围')
    } else {
      sizeMinMessage.value = ''
    }
  }
  formRef?.value?.validate()
}

const handleCompressSizeUnitChange = (module: string) => {
  const map: Record<string, () => void> = {
    max: () => {
      if (formState.max_size > max.end) {
        formState.max_size = max.end
      }
    },
    min: () => {
      if (formState.min_size > max.start) {
        formState.min_size = max.start
      }
    }
  }
  formRef?.value?.validate()
  if (map[module]) map[module]()
}

//修改节点基础配置
const handleSubmit = () => {
  formRef.value?.validate().then(res => {
    if (res) return
    formState.content = formState.content_str
      ?.split(',')
      .filter(Boolean) as string[]
    const { min_size, max_size, content, rank, max_size_unit, min_size_unit } =
      formState
    const params: CompressConfig = {
      compress: {
        min_size: String(min_size * COMPRESS_UNITS.values[min_size_unit]),
        max_size: String(max_size * COMPRESS_UNITS.values[max_size_unit]),
        content,
        rank
      }
    }
    loading.value = true
    postCdnGlobalCompressConfigApi({
      ...params
    })
      .then(() => {
        Message.success('保存成功')
        getNodeData()
      })
      .finally(() => (loading.value = false))
  })
}

const loading = ref(false)
//查询节点基础配置
function getNodeData() {
  loading.value = true
  getCdnGlobalCompressConfigApi()
    .then(res => {
      const {
        compress: { content, rank, min_size, max_size }
      } = res as any
      formState.content_str = content.join(',') as string
      formState.rank = rank || 6
      const size_min = byteConvertCompress(min_size)
      const isMinUnit = COMPRESS_UNITS.labels.indexOf(size_min.split(' ')[1])
      formState.min_size = Number(size_min.split(' ')[0])
      formState.min_size_unit = isMinUnit === -1 ? 0 : isMinUnit
      const size_max = byteConvertCompress(max_size)
      const isMaxUnit = COMPRESS_UNITS.labels.indexOf(size_max.split(' ')[1])
      formState.max_size = Number(size_max.split(' ')[0])
      formState.max_size_unit = isMaxUnit === -1 ? 0 : isMaxUnit
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getNodeData()
})
</script>
