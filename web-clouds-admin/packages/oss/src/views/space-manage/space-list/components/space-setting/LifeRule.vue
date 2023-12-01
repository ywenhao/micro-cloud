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
        field="name"
        label="规则名称"
        asterisk-position="end"
        validate-trigger="input"
        class="mb-8!"
      >
        <a-input
          v-model.trim="formState.name"
          placeholder="请输入名称"
          :max-length="20"
          :disabled="!!record"
          show-word-limit
        />
      </a-form-item>
      <a-form-item
        label="规则策略"
        field="content"
        asterisk-position="end"
        validate-trigger="input"
        :help="errorMessage"
        :hide-asterisk="true"
        class="mb-8! radio-item-tactics"
      >
        <div class="flex flex-col flex-1">
          <a-radio-group
            v-model="formState.tacticsRadio"
            @change="handleChange"
          >
            <a-radio :value="0" class="mr-6!">对整个空间生效</a-radio>
            <a-radio :value="1">对前缀生效</a-radio>
          </a-radio-group>
          <a-input
            v-if="formState.tacticsRadio === 1"
            v-model.trim="formState.content"
            :max-length="256"
            placeholder="请输入前缀"
            class="mt-2"
          />
        </div>
      </a-form-item>
      <a-form-item label="删除文件">
        <a-input-number
          v-model="formState.expire_days"
          hide-button
          :min="1"
          :precision="0"
          :max="36500"
          placeholder="请输入"
        >
        </a-input-number>
        <span
          class="px-3 py-[6px] bg-[var(--color-fill-2)] text-[var(--color-text-1)] rounded-tr rounded-br"
          >天</span
        >
        <template #extra>
          <span>请设定时间（天），新创建的文件将在设定的时间之后自动删除</span>
        </template>
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
import { editCycleApi, type LifeCycleModel } from '@vca/apis/oss'
import { cloneDeep } from 'lodash-es'
import { useRoute } from 'vue-router'

const record = defineModel<any>('record')

const list = defineModel<LifeCycleModel[]>('list', { required: true })
const modelValue = defineModel<boolean>()
const loading = defineModel<boolean>('loading', { default: false })
const route = useRoute()

const formState = ref<any>({
  tacticsRadio: undefined,
  content: '',
  expire_days: 180
})

const formRef = ref<FormInstance>()

const emit = defineEmits<{
  (event: 'reload'): void
}>()

const title = computed(() => (record?.value ? '编辑规则' : '创建规则'))
const onText = computed(() => (record?.value ? '保存' : '创建'))

const repeatIndex = ref<number>(-1)

const rules = computed<Record<string, FieldRule[]>>(() => {
  const res: Record<string, FieldRule[]> = {
    name: [
      {
        required: true,
        validator(value, callback) {
          const reg = /^[A-Za-z0-9_]{1,20}$/
          if (!value) {
            return callback('规则名称不能为空')
          }
          if (!reg.test(value)) {
            return callback('请输入字符，可包含英文字母、数字、下划线')
          }
          const isShowName = list.value.some(({ name }) => name === value)
          if (isShowName && !record.value?.created_at) {
            return callback('该名称已存在')
          }
          return callback()
        }
      }
    ],
    content: [
      {
        required: true,
        validator(value, callback) {
          if (formState.value.tacticsRadio) {
            if (!value) return callback('前缀不能为空')
            const domainReg = /^(?!\/|\\)\S(?!.*\s{2})[\w\-_\u4e00-\u9fff\S]+$/
            if (!domainReg.test(value)) return callback('前缀格式错误')
            const lifeList = cloneDeep(list.value)
            if (repeatIndex.value !== -1 && !record.value?.created_at) {
              lifeList.splice(repeatIndex.value as number, 1)
            }
            const isShowPrefix = lifeList.some(item => item?.prefix === value)
            return isShowPrefix ? callback('该前缀已存在') : callback()
          }
          return callback()
        }
      }
    ]
  }
  return res
})

const errorMessage = ref<string>('')

const handleChange = () => {
  formState.value.content = ''
  formRef.value?.clearValidate(['content'])
  checkRules()
}

const checkRules = () => {
  errorMessage.value = ''
  if (
    !formState.value?.tacticsRadio &&
    formState.value.tacticsRadio !== old_tacticsRadio.value
  ) {
    const allSpace = list.value.some(item => !item?.prefix)
    allSpace
      ? (errorMessage.value = '生命周期规则策略已存在')
      : (errorMessage.value = '')
  }
}

const getRulesList = () => {
  let listIndex = 0
  list.value.some((item, index) => {
    if (formState.value.name === item.name) {
      listIndex = index
    }
  })
  list.value[listIndex] = {
    ...formState.value,
    tacticsRadio: undefined,
    content: undefined
  }
  if (record.value) {
    repeatIndex.value = list.value.findIndex(
      item => item.name === record.value.name
    )
  }
  return list.value
}

const handleEditorSubmit = () => {
  return new Promise<boolean>((resolve, reject) => {
    const { tacticsRadio, content } = formState.value

    tacticsRadio === 0
      ? (formState.value.prefix = '')
      : (formState.value.prefix = content)

    loading.value = true
    const obj_data = {
      bucket_id: route.params.id as string,
      rules: record.value
        ? getRulesList()
        : [
            {
              ...formState.value,
              tacticsRadio: undefined,
              content: undefined
            }
          ].concat(list.value)
    }
    editCycleApi(obj_data)
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

watchEffect(() => {
  if (!modelValue.value) {
    formRef.value?.resetFields()
    errorMessage.value = ''
  }
})

const handleBeforeOk = async () => {
  checkRules()
  const validate = await formRef.value?.validate()
  if (validate || errorMessage.value) return false
  return handleEditorSubmit()
}

const handleBeforeClose = () => {
  modelValue.value = false
  return false
}

const old_tacticsRadio = ref<number>(1)

const handleDrawerOpen = () => {
  if (record.value) {
    formState.value = { ...record.value }
    getRulesList()
    record.value?.prefix
      ? (formState.value.tacticsRadio = 1)
      : (formState.value.tacticsRadio = 0)
    old_tacticsRadio.value = record.value?.prefix ? 1 : 0
    formState.value.content = formState.value?.prefix || ''
  } else {
    formState.value.name = ''
    formState.value.tacticsRadio = 0
    formState.value.content = ''
    formState.value.expire_days = 180
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
:deep(.arco-form-item-message-help) {
  font-size: 12px;
  color: rgb(var(--danger-6)) !important;
}
</style>
