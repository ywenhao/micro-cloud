<template>
  <a-drawer
    v-model:visible="modelValue"
    :title="title"
    :width="600"
    :esc-to-close="false"
    :mask-closable="false"
    :closable="!loading"
    @before-open="handleDrawerOpen"
    @before-cancel="handleBeforeClose"
    destroy-on-close
    cancel-text="取消"
    :ok-text="onText"
    class="is-admin"
    @before-ok="handleBeforeOk"
  >
    <a-form ref="formRef" :model="formState" layout="vertical" :rules="rules">
      <a-form-item
        field="allowed_origins"
        label="来源"
        asterisk-position="end"
        class="mb-8!"
      >
        <a-textarea
          v-model="formState.allowed_origins"
          placeholder="请输入来源"
          :max-length="253"
        />
        <template #extra>
          <span>来源可以设置多个，每行一个，每行最多能有一个通配符[*]</span>
        </template>
      </a-form-item>
      <a-form-item
        field="allowed_methods"
        label="允许Methods"
        asterisk-position="end"
        class="mb-8! radio-item-tactics"
      >
        <a-checkbox-group
          v-model="formState.allowed_methods"
          :options="plainOptions"
        />
      </a-form-item>
      <a-form-item
        field="allowed_headers"
        asterisk-position="end"
        :hide-asterisk="true"
        validate-trigger="change"
        label="允许Headers"
        class="mb-8!"
      >
        <a-textarea
          v-model="formState.allowed_headers"
          placeholder="请输入允许Headers"
        />
        <template #extra>
          <span
            >允许 Headers
            可以设置多个，每行一个，如果有通配符[*]，则单行只能是通配符[*]</span
          >
        </template>
      </a-form-item>
      <a-form-item
        label="暴露Headers"
        field="expose_headers"
        asterisk-position="end"
        :hide-asterisk="true"
        validate-trigger="change"
        class="mb-8!"
      >
        <a-textarea
          v-model="formState.expose_headers"
          placeholder="请输入暴露Headers"
        />
        <template #extra>
          <span>暴露 Headers 可以设置多个，每行一个，不允许出现通配符[*]</span>
        </template>
      </a-form-item>
      <a-form-item label="缓存时间（秒）">
        <a-input-number
          v-model="formState.max_age"
          :min="0"
          :precision="0"
          :max="3600"
          placeholder="请输入"
        >
        </a-input-number>
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
import { type CorsListModel, editCorsApi } from '@vca/apis/oss'
import { domainReg, domainSplitReg } from 'vc-material'
import { useRoute } from 'vue-router'

const record = defineModel<any>('record')
const list = defineModel<CorsListModel[]>('list', { required: true })

const props = withDefaults(defineProps<{ rowIndex?: number }>(), {
  rowIndex: undefined
})

const modelValue = defineModel<boolean>()
const loading = defineModel<boolean>('loading', { default: false })
const route = useRoute()

const emit = defineEmits<{
  (event: 'reload'): void
}>()

const formState = ref<any>({
  allowed_origins: '',
  allowed_methods: [],
  allowed_headers: '',
  expose_headers: '',
  max_age: 100
})

const handleBeforeClose = () => {
  modelValue.value = false
  return false
}

const formRef = ref<FormInstance>()

watchEffect(() => {
  if (!modelValue.value) {
    formRef.value?.resetFields()
  }
})

const title = computed(() => (record?.value ? '编辑跨域规则' : '创建跨域规则'))
const onText = computed(() => (record?.value ? '保存' : '创建'))

const rules = computed<Record<string, FieldRule[]>>(() => {
  const res: Record<string, FieldRule[]> = {
    allowed_origins: [
      { required: true, message: '请输入域名' },
      {
        validator(value: string, callback) {
          const list = value.split('\n')
          const old_list: string[] = []
          const domain_start = /(http|https):\/\/\S*/
          list.map((v: string) => {
            v.trim()
            if (v.length > 253) {
              return callback('域名总长度不能超过253个字符')
            }
            if (!domain_start.test(v)) {
              return callback('请输入 http(s) 协议头')
            }
            if (v.includes('*') && v.split('*').length > 2) {
              return callback('每行最多一个 *')
            }

            if (old_list.includes(v)) {
              return callback('请检查是否有重复的输入')
            }
            old_list.push(v)

            const new_v = v.replace(/^(https|http)?:\/\//, '').replace('*', '')

            if (new_v.includes('.')) {
              const split = new_v.split('.').filter(item => item) as string[]

              for (const item of split) {
                if (!domainSplitReg.test(item)) {
                  return callback(
                    '每一级域名为字母、数字、“-”、“_”的组合且长度不能超过63字符'
                  )
                }
              }
            }

            if (!domainReg.test(new_v)) {
              return callback('域名格式错误')
            }
            return true
          })
        }
      }
    ],
    allowed_methods: [{ required: true, message: '请选择' }],
    allowed_headers: [
      {
        required: true,
        validator: (value: string, callback) => {
          const list = value?.split('\n')
          list.map((v: string) => {
            v.trim()
            if (v.includes('*') && v.replace('*', '')) {
              return callback('请检查你的输入')
            }
            return true
          })
        }
      }
    ],
    expose_headers: [
      {
        required: true,
        validator: (value: string, callback) => {
          const list = value?.split('\n')
          list.map((v: string) => {
            v.trim()
            if (v.includes('*') && v.replace('*', '')) {
              return callback('请检查你的输入')
            }
            return true
          })
        }
      }
    ]
  }
  return res
})

const plainOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'PUT', value: 'PUT' },
  { label: 'POST', value: 'POST' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'HEAD', value: 'HEAD' }
]

const getCorsList = () => {
  const { allowed_origins, allowed_headers, expose_headers } = formState.value
  list.value[props?.rowIndex as number] = {
    ...formState.value,
    allowed_origins: allowed_origins.split('\n'),
    allowed_headers: allowed_headers.split('\n'),
    expose_headers: expose_headers.split('\n')
  }
  return list.value
}

const handleEditorSubmit = () => {
  return new Promise<boolean>((resolve, reject) => {
    const { allowed_origins, allowed_headers, expose_headers } = formState.value

    loading.value = true
    const obj_data = {
      bucket_id: route.params.id as string,
      rules: record.value
        ? getCorsList()
        : [
            {
              ...formState.value,
              allowed_origins: allowed_origins
                ? allowed_origins.split('\n')
                : [],
              allowed_headers: allowed_headers
                ? allowed_headers.split('\n')
                : [],
              expose_headers: expose_headers ? expose_headers.split('\n') : []
            }
          ].concat(list.value)
    }
    editCorsApi(obj_data)
      .then(() => {
        Message.success(record.value ? '修改成功' : '添加成功')
        emit('reload')
        loading.value = false
        resolve(true)
      })
      .catch(() => {
        reject(false)
      })
  })
}

const handleBeforeOk = async () => {
  const validate = await formRef.value?.validateField([
    'allowed_origins',
    'allowed_methods'
  ])
  if (validate) return false

  return handleEditorSubmit()
}

const handleDrawerOpen = () => {
  if (record.value) {
    const { allowed_origins, allowed_headers, expose_headers } = record.value
    formState.value = { ...record.value }
    formState.value.allowed_origins = allowed_origins.join('\n')
    formState.value.allowed_headers = allowed_headers.join('\n')
    formState.value.expose_headers = expose_headers.join('\n')
  } else {
    formState.value.allowed_origins = ''
    formState.value.allowed_methods = []
    formState.value.allowed_headers = ''
    formState.value.expose_headers = ''
    formState.value.max_age = 100
  }
}
</script>

<style scoped lang="less">
:deep(.radio-item-tactics) {
  .arco-form-item-wrapper-col,
  .arco-form-item-content {
    min-height: 20px !important;
  }
}
:deep(.arco-input-number) {
  @apply rounded-tr-none! rounded-br-none!;
}
</style>
