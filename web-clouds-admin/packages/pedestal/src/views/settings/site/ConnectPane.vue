<template>
  <a-spin class="w-full" :loading="loading">
    <a-form
      :rules="rules"
      :model="formState"
      layout="vertical"
      @submit-success="handleSubmitSuccess"
    >
      <a-form-item
        validate-trigger="blur"
        class="mb-8!"
        asterisk-position="end"
        field="phone"
        label="联系电话"
      >
        <a-textarea
          :auto-size="{ minRows: 5, maxRows: 5 }"
          v-model="formState.phone"
          class="max-w-[400px] w-full"
          placeholder="请输入电话（一行一个，最多5个）"
        ></a-textarea>
      </a-form-item>

      <a-form-item
        validate-trigger="blur"
        class="mb-8!"
        asterisk-position="end"
        field="email"
        label="联系邮箱"
      >
        <a-textarea
          :auto-size="{ minRows: 5, maxRows: 5 }"
          v-model="formState.email"
          class="max-w-[400px] w-full"
          placeholder="请输入邮箱（一行一个，最多5个）"
        ></a-textarea>
      </a-form-item>

      <a-form-item
        validate-trigger="blur"
        class="mb-8!"
        asterisk-position="end"
        field="qq"
        label="联系QQ"
      >
        <a-textarea
          :auto-size="{ minRows: 5, maxRows: 5 }"
          v-model="formState.qq"
          class="max-w-[400px] w-full"
          placeholder="请输入QQ（一行一个，最多5个）"
        ></a-textarea>
      </a-form-item>

      <a-form-item
        validate-trigger="blur"
        class="mb-8!"
        asterisk-position="end"
        field="telegram"
        label="Telegram"
      >
        <a-textarea
          :auto-size="{ minRows: 5, maxRows: 5 }"
          v-model="formState.telegram"
          class="max-w-[400px] w-full"
          placeholder="请输入Telegram分享地址（一行一个，最多5个）"
        ></a-textarea>
      </a-form-item>

      <a-form-item
        validate-trigger="blur"
        class="mb-8!"
        asterisk-position="end"
        field="skype"
        label="Skype"
      >
        <a-textarea
          :auto-size="{ minRows: 5, maxRows: 5 }"
          v-model="formState.skype"
          class="max-w-[400px] w-full"
          placeholder="请输入Skype分享地址（一行一个，最多5个）"
        ></a-textarea>
      </a-form-item>
      <a-form-item validate-trigger="blur">
        <a-button type="primary" html-type="submit">保存配置</a-button>
      </a-form-item>
    </a-form>
  </a-spin>
</template>

<script setup lang="ts">
import { type FieldRule, Message } from '@arco-design/web-vue'
import { confApi, confUpdateApi } from '@vca/apis/pedestal'

const MODULE_TYPE = 4

const loading = ref(false)
const formState = reactive<Record<string, string>>({
  phone: '',
  email: '',
  qq: '',
  telegram: '',
  skype: ''
})

const validator = (
  value: string,
  callback: (...args: any[]) => void,
  prop: string
) => {
  const map: Record<string, Record<string, any>> = {
    phone: {
      reg: /^(?=^.{7,24}$)(?!(^\d{5,} ))(?!^0+$)(\+?\d{1,4} )?(\d{1,4} )?(\d{1,11} )*\d{1,11}$/,
      error: '电话号码格式不正确'
    },
    email: {
      reg: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,
      error: '邮箱格式不正确'
    },
    qq: {
      reg: /^([1-9])[0-9]{4,11}$/,
      error: 'QQ格式不正确'
    },
    telegram: {
      reg: /^(?=^.{0,100}$)(https|http):\/\/t\.me\/\S+$/,
      error: 'Telegram格式不正确'
    },
    skype: {
      reg: /^(?=^.{0,100}$)(https|http):\/\/join\.skype\.com\/invite\/\S+$/,
      error: 'Skype格式不正确'
    }
  }
  const reg: RegExp = map[prop].reg
  if (!value?.trim()) {
    callback()
    return
  }
  const arr = value.split('\n').filter(item => item)
  if (arr.length > 5) {
    callback('最多只能输入5个')
    return
  }
  for (const item of arr) {
    if (!reg.test(item)) {
      callback(map[prop].error)
      return
    }
  }
  callback()
}
const rules: Record<string, FieldRule[]> = {
  phone: [
    {
      validator: (value: string, callback: (...args: any[]) => void) =>
        validator(value, callback, 'phone')
    }
  ],
  email: [
    {
      validator: (value: string, callback: (...args: any[]) => void) =>
        validator(value, callback, 'email')
    }
  ],
  qq: [
    {
      validator: (value: string, callback: (...args: any[]) => void) =>
        validator(value, callback, 'qq')
    }
  ],
  telegram: [
    {
      validator: (value: string, callback: (...args: any[]) => void) =>
        validator(value, callback, 'telegram')
    }
  ],
  skype: [
    {
      validator: (value: string, callback: (...args: any[]) => void) =>
        validator(value, callback, 'skype')
    }
  ]
}
const handleSubmitSuccess = () => {
  loading.value = true
  confUpdateApi({ conf_type: MODULE_TYPE, connect_conf: formState })
    .then(() => {
      Message.success('保存成功')
    })
    .finally(() => {
      loading.value = false
    })
}

const getConfigInfo = () => {
  loading.value = true
  confApi({ type: MODULE_TYPE })
    .then(res => {
      Object.assign(formState, res.connect_conf)
    })
    .finally(() => {
      loading.value = false
    })
}
onMounted(() => {
  getConfigInfo()
})
</script>
