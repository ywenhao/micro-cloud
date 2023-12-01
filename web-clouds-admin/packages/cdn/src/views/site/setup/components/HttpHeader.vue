<template>
  <a-form
    ref="formRef"
    :model="data"
    :rules="formRules"
    layout="inline"
    class="flex mt-4 px-4 items-start http-header"
  >
    <a-form-item hide-label hide-asterisk field="action">
      <a-select v-model="data.action" placeholder="请选择">
        <a-option label="添加标头" :value="1"></a-option>
        <a-option label="移除标头" :value="3"></a-option>
      </a-select>
    </a-form-item>

    <a-form-item field="name" validate-trigger="blur" hide-label hide-asterisk>
      <a-input
        v-model="data.name"
        class="header-input"
        placeholder="请输入"
      ></a-input>
    </a-form-item>

    <a-form-item
      hide-label
      hide-asterisk
      field="value"
      validate-trigger="blur"
      class="value-item"
    >
      <a-input
        v-model="data.value"
        :disabled="data.action === 3"
        class="value value-input"
        placeholder="请输入"
      ></a-input>
    </a-form-item>
    <!-- 
    <a-link
      class="ml-4"
      type="danger"
      :underline="false"
      icon
    >
  
  </a-link> -->
    <a-button type="outline" @click="emit('delete')" class="delete-btn">
      <icon-close />
    </a-button>
    <!-- <icon-delete
      :disabled="disableDelete"
      :size="16"
      class="delete-icon"
    ></icon-delete> -->
  </a-form>
</template>

<script setup lang="ts">
import type { FieldRule, FormInstance } from '@arco-design/web-vue'
import { IconClose } from '@arco-design/web-vue/es/icon'

interface HeaderRule {
  uuid: string
  action: number | undefined
  name: string
  value: string
}
interface IEmit {
  (event: 'update:header', value: HeaderRule): void
  (event: 'add'): void
  (event: 'delete'): void
}

interface IProps {
  header: HeaderRule
  disableDelete?: boolean
}

const emit = defineEmits<IEmit>()
const props = defineProps<IProps>()

const formRef = ref<FormInstance>()

const data = useVModel(props, 'header', emit)
const formRules = computed<{ [key: string]: FieldRule[] }>(() => {
  const nameRules: FieldRule[] = [
    { required: true, message: '请输入标头名称' },
    { max: 128, message: '标头长度不能超过128位' },
    {
      validator(value, callback) {
        const reg =
          /^([a-zA-Z]+|[a-zA-Z]{2}|[a-zA-Z]([a-zA-Z0-9\-_]+)[a-zA-Z])$/
        callback(regExpValidateHandler(value, reg, '标头格式错误'))
      }
    }
  ]
  const valueRules: FieldRule[] = []

  if (data.value.action !== 3) {
    valueRules.push({ required: true, message: '请输入数值' })
    if (data.value.name.toLowerCase() === 'user-agent') {
      valueRules.push({ max: 255, message: 'User-Agent输入上限为255个字符' })
    } else {
      valueRules.push({ max: 2048, message: '输入上限为2048个字符' })
    }
  }

  return {
    action: [{ required: true, message: '请选择操作' }],
    name: nameRules,
    value: valueRules
  }
})

watch(
  () => data.value.action,
  val => {
    if (val === 3) {
      data.value.value = ''
    }
    nextTick(() => {
      formRef.value?.clearValidate(['name', 'value'])
    })
  }
)

async function validate() {
  await formRef.value?.validate()
}

defineExpose({ validate })
</script>

<style scoped lang="less">
.http-header {
  @apply mb-4;
  .arco-form-item {
    margin: 0 !important;
  }
  .value {
    @apply relative;
    &::before {
      @apply w-[10px] h-[1px] bg-[#DBDDE2] absolute left-[-8px] top-[50%];
      content: '';
    }
  }
  :deep(.arco-select) {
    width: 200px !important;
  }
  .value-item {
    @apply flex-1;
  }
  .value-input {
    flex: 1;
    margin-left: 8px;
  }
  .header-input {
    width: 120px !important;
    margin-left: 8px;
  }
  .delete-btn {
    @apply px-2 ml-2;
  }
}
</style>
