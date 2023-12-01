<template>
  <a-modal
    modal-class="vc-dialog form-dialog"
    title-align="start"
    v-model:visible="modelValue"
    :esc-to-close="false"
    :mask-closable="false"
    :cancel-button-props="{ loading }"
    title="清除缓存"
    :width="480"
    @before-ok="handleConfirm"
    @before-close="handleBeforeClose"
    @cancel="handleCancel"
    okText="确定"
    cancelText="取消"
  >
    <a-form ref="formRef" :model="clearForm" :rules="rules" layout="vertical">
      <a-form-item label="清除方式" field="method">
        <a-radio-group
          direction="horizontal"
          v-model="clearForm.method"
          placeholder="请选择"
          @change="clearForm.url = ''"
          :options="[
            { label: '自定义清除', value: 1 },
            { label: '全部清除', value: 2 }
          ]"
        >
        </a-radio-group>
      </a-form-item>
      <a-form-item
        v-if="clearForm.method === 1"
        label="输入URL"
        field="url"
        ref="urlRef"
        class="mb-0"
        :help="urlHelp"
      >
        <a-textarea
          v-model="clearForm.url"
          :auto-size="{
            maxRows: 7,
            minRows: 7
          }"
          placeholder="一行一个支持多个"
        ></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {
  type FormInstance,
  type FormItemInstance,
  Message
} from '@arco-design/web-vue'
import { postCdnSiteClearCacheByIdApi } from '@vca/apis/cdn'
import { computed } from 'vue'

const formRef = ref<FormInstance>()
const modelValue = defineModel()
const siteId = defineModel<string>('siteId')
const domain = defineModel<string>('domain')
const loading = defineModel<boolean>('loading', { default: false })

const urlRef = ref<FormItemInstance>()

const clearForm = reactive<{
  method: number
  site_id: string
  url: string
}>({ method: 2, site_id: '', url: '' })
const urlHelp = ref<string | undefined>('示例：https://www.example.com/cat.jpg')
watchEffect(() => {
  urlHelp.value = urlRef.value?.isError
    ? undefined
    : '示例：https://www.example.com/cat.jpg'
})
const urls = computed(() => {
  return clearForm.url.split('\n').filter(item => item.length)
})

const rules: Rules = {
  url: [
    { required: true, message: '请输入域名相关URL' },
    {
      validator(_value, callback) {
        const errs = urls.value.filter(url => {
          const errMsg = regExpValidateHandler(
            url,
            regexpMap.noPortUrl,
            'url错误'
          )
          if (errMsg) {
            return true
          }
          const obj = new URL(url)
          if (obj.hostname !== domain.value!) {
            return true
          }
          return false
        })
        if (errs.length) {
          callback('域名格式错误，请输入该站点域名相关的URL地址')
          return
        }
        callback()
      }
    }
  ]
}
const handleCancel = () => {
  modelValue.value = false
}

const handleBeforeClose = (done: any) => {
  formRef.value?.resetFields()
  nextTick(done)
}

/** 编辑提交事件 */
const handleEditorSubmit = async () => {
  return new Promise<boolean>((resolve, reject) => {
    postCdnSiteClearCacheByIdApi({
      site_id: siteId.value!
    })
      .then(() => {
        Message.success('清除成功')
        resolve(true)
      })
      .catch(() => {
        reject(false)
      })
  })
}

const handleConfirm = async () => {
  const errors = await formRef.value?.validate()
  if (errors) {
    return false
  }
  return handleEditorSubmit()
}
</script>
