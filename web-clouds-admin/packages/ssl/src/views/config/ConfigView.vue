<template>
  <vc-container header-bordered page-title="申请配置">
    <a-form
      ref="formRef"
      :model="formState"
      label-align="left"
      layout="vertical"
      style="width: 622px"
      class="config-form"
    >
      <a-form-item hide-asterisk label="证书品牌">
        <a-checkbox-group
          :model-value="formState.brand"
          class="w-full"
          @change="handleBrandChange"
        >
          <div class="flex flex-row gap-x-2">
            <div class="flex flex-1 flex-col gap-y-2">
              <a-checkbox value="1">ZeroSSL</a-checkbox>
              <a-form-item
                field="key"
                hide-asterisk
                hide-label
                :rules="[
                  {
                    required: true,
                    validator: secretValidate
                  }
                ]"
                class="brand-content-item"
              >
                <a-input v-model="formState.key"></a-input>
              </a-form-item>
            </div>
            <div class="flex flex-1 flex-col gap-y-2">
              <a-checkbox value="2">Let's Encrypt</a-checkbox>
              <a-form-item
                hide-asterisk
                hide-label
                field="email"
                :rules="[
                  {
                    required: true,
                    validator: emailValidate
                  }
                ]"
                class="brand-content-item"
              >
                <a-input v-model="formState.email"></a-input>
              </a-form-item>
            </div>
          </div>
          <div v-if="showPriority" class="flex flex-col mt-4">
            <span>优先使用</span>
            <span class="text-xs text-ct-3 mt-1 mb-2"
              >设置—个优先使用的证书品牌，证书申请时将优先使用，建议设置ZeroSSL</span
            >
            <a-radio-group v-model="masterBrand" :options="brandOptions">
            </a-radio-group>
          </div>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item
        field="algorithm"
        required
        asterisk-position="end"
        label="秘钥算法"
      >
        <template #extra>
          <span>用户申请证书时可选择的密钥算法</span>
        </template>
        <a-checkbox-group v-model="formState.algorithm" :default-value="[1]">
          <a-checkbox
            v-for="item in algorithmOptions"
            :key="item.label"
            :value="item.value"
            :disabled="checkboxDisabled(item.value)"
          >
            <template #checkbox="{ checked }">
              <a-tag
                :checked="checked"
                :checkable="isCheckable"
                size="large"
                class="checkbox-tag"
                >{{ item.label }}</a-tag
              >
            </template>
          </a-checkbox>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item
        field="auto_renew"
        asterisk-position="end"
        required
        class="auto-renew-item"
      >
        <template #extra>
          <span>关闭后，自动续期功能将不可使用</span>
        </template>
        <template #label>
          <span class="auto-renew-item__label">自动续期开关</span>
          <a-switch
            v-model="formState.auto_renew"
            :checked-value="1"
            :unchecked-value="2"
          ></a-switch>
        </template>
      </a-form-item>
      <a-form-item
        v-if="formState.auto_renew === 1"
        required
        asterisk-position="end"
        field="renew_days"
        label="执行自动续期时间"
      >
        <template #extra>
          <span
            >证书到期前多少日执行自动续期，建议≤证书即将到期时间（如续期失败，则会顺延至第二天重试续期直至到期为止）</span
          >
        </template>
        <div class="flex flex-row gap-x-14">
          <div class="time-input-container">
            <a-input-number
              v-model="formState!.renew_days"
              placeholder="请输入"
              class="time-input"
              :step="1"
              :precision="0"
              :min="3"
              :max="30"
              :formatter="
                (v:number) => {
                  if(v<3){
                    return `3`
                  }
                  return v
                }
              "
            />
            <a-tag color="gray" class="input-des">日</a-tag>
          </div>

          <div class="time-input-container">
            <a-input-number
              v-model="formState!.renew_hour"
              placeholder="请输入"
              class="time-input"
              :step="1"
              :precision="0"
              :min="0"
              :max="24"
              :formatter="
                (v:number) => {
                  if(v<10){
                    return `0${v}`
                  }
                  return v
                }
              "
            />
            <a-tag color="gray" class="input-des">时</a-tag>
          </div>
        </div>
      </a-form-item>
      <a-form-item
        field=""
        required
        asterisk-position="end"
        label="证书即将到期时间"
      >
        <template #extra>
          <span>证书到期前多少日展示为“即将到期”状态，并可发起续期申请</span>
        </template>

        <div class="time-input-container">
          <a-input-number
            v-model="formState!.expire_show"
            placeholder="请输入"
            class="time-input"
            :step="1"
            :precision="0"
            :min="3"
            :max="30"
            :formatter="
                (v:number) => {
                  if(v<3){
                    return `3`
                  }
                  return v
                }
              "
          />
          <a-tag color="gray" class="input-des">日</a-tag>
        </div>
      </a-form-item>
      <a-form-item
        field=""
        required
        asterisk-position="end"
        label="失败重试机制"
      >
        <template #extra>
          <span
            >申请/续期证书请求失败后，系统将基于本次申请发起重试，当超过配置的次数后，不再发起重试</span
          >
        </template>
        <div class="flex flex-row">
          <div class="time-input-container">
            <a-input-number
              v-model="formState!.retry_times"
              placeholder="请输入"
              class="time-input"
              :step="1"
              :precision="0"
              :min="1"
              :max="5"
              :formatter="
                (v:number) => {
                  if(v<1){
                    return `1`
                  }
                  return v
                }
              "
            />
            <a-tag color="gray" class="input-des">次</a-tag>
          </div>

          <a-tag color="gray" class="input-des ml-14 mr-2">间隔</a-tag>

          <div class="time-input-container">
            <a-input-number
              v-model="formState!.retry_delay"
              placeholder="请输入"
              class="time-input"
              :step="1"
              :precision="0"
              :min="3"
              :max="60"
              :formatter="
                (v:number) => {
                  if(v<3){
                    return `3`
                  }
                  return v
                }
              "
            />
            <a-tag color="gray" class="input-des">秒</a-tag>
          </div>
        </div>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="saveConfig" :loading="loading"
          >保存配置</a-button
        >
      </a-form-item>
    </a-form>
  </vc-container>
</template>
<script lang="ts" setup>
// import { FieldRule } from '@arco-design/web-vue'`
import { type FormInstance, Message } from '@arco-design/web-vue'
import { getSystemConfigApi, saveSystemConfigApi } from '@vca/apis/src/ssl'
import { pick } from 'vc-material'

import { algorithmOptions } from '@/config'
import type { SystemConfig } from '@/types/config'
const formState = reactive({
  brand: ['1'],
  key: '',
  email: '',
  auto_renew: 1,
  renew_days: 7,
  renew_hour: 0,
  expire_show: 7,
  retry_times: 5,
  retry_delay: 10,
  algorithm: [1]
})
const transformListKey = ['brand', 'algorithm'] //需要转换为数组的字段
//需要转为数字类型的字段
const stringKey = [
  'renew_days',
  'renew_hour',
  'expire_show',
  'retry_times',
  'retry_delay'
]
const loading = ref<boolean>(false)
const formRef = ref<FormInstance>()
// 证书品牌多选时，优先使用的品牌
const masterBrand = ref<string>('1')
const brandOptions = [
  {
    label: 'ZeroSSL',
    value: '1'
  },
  {
    label: "Let's Encrypt",
    value: '2'
  }
]

//处理品牌优先使用
const handleBrandMaster = (brands: string[]): string => {
  // 品牌，多个用逗号分隔,主在前
  if (brands.length > 1) {
    return masterBrand.value === '1' ? '1,2' : '2,1'
  } else {
    return brands.toString()
  }
}
const handleBrandChange = (v: (string | number | boolean)[]) => {
  if (v.length < 1) {
    return
  } else {
    formState.brand = v as string[]
  }
  if (!v.includes('1')) {
    formRef.value?.clearValidate('key')
  } else if (!v.includes('2')) {
    formRef.value?.clearValidate('email')
  }
}

// 数据转换
const dataTransform = (res: SystemConfig) => {
  for (const key in formState) {
    if (Object.hasOwnProperty.call(res, key)) {
      if (transformListKey.includes(key)) {
        // @ts-ignore
        formState[key] = res[key]?.split(',') ?? ['1']
      } else if (stringKey.includes(key)) {
        // @ts-ignore
        formState[key] = Number(res[key] ?? '3')
      } else {
        // @ts-ignore
        formState[key] = res[key] ?? ''
      }
    }
  }
  formState.algorithm = formState.algorithm.map(item => Number(item))
  masterBrand.value = formState.brand[0]
}

// 算法禁止选中
const isCheckable = computed(() => formState.algorithm.length > 0)
const checkboxDisabled = computed(
  () => (value: number) =>
    formState.algorithm.length === 1 && formState.algorithm.indexOf(value) > -1
)

const showPriority = computed(() => {
  return (
    formState.brand.length === 2 &&
    formState.brand.includes('1') &&
    formState.brand.includes('2')
  )
})

//密钥校验
const secretValidate = (
  value: any,
  callback: (error?: string | undefined) => void
) => {
  const reg = /^[A-Za-z0-9]{1,50}$/
  if (!value && formState.brand.indexOf('1') > -1) {
    callback('请输入密钥')
  } else if (!reg.test(value)) {
    callback('密钥格式不正确')
  } else {
    callback()
  }
}
// 邮箱校验
const emailValidate = (
  value: any,
  callback: (error?: string | undefined) => void
) => {
  const reg =
    /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
  if (!value && formState.brand.indexOf('2') > -1) {
    callback('请输入邮箱')
  } else if (!reg.test(value) && formState.brand.indexOf('2') > -1) {
    callback('邮箱格式不正确')
  } else {
    callback()
  }
}

//获取配置
const getConfig = () => {
  getSystemConfigApi().then(res => {
    dataTransform(res as SystemConfig)
  })
}
//保存配置
const saveConfig = async () => {
  const valid = await formRef.value?.validate()

  if (valid) return
  if (formState.brand.length < 1) {
    Message.error('请至少配置一个证书品牌')
    return
  }
  const query = {}
  for (const key in formState) {
    if (stringKey.includes(key)) {
      // @ts-ignore
      query[key] = formState[key].toString()
    }
  }
  const data = {
    ...pick(formState, ['key', 'email', 'auto_renew']),
    ...query,
    brand: handleBrandMaster(formState.brand),
    algorithm: formState.algorithm.toString()
  }
  loading.value = true
  saveSystemConfigApi(data)
    .then(() => {
      Message.success('保存成功')
      getConfig()
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getConfig()
})
</script>
<style lang="less" scoped>
:deep(.config-form) {
  .brand-content-item {
    margin-bottom: 0;
  }
  .arco-form-item-label-col {
    margin-bottom: 4px;
  }
  .arco-form-item-extra {
    order: 1;
    margin-top: 0;
    margin-bottom: 8px;
  }
  .arco-form-item-content-wrapper {
    order: 2;
  }
  .arco-form-item-message {
    order: 3;
  }
  .arco-checkbox,
  .arco-radio {
    padding-left: 0;
  }
  .arco-checkbox {
    margin-right: 8px !important;
  }
  .checkbox-tag {
    padding: 4px 12px;
    width: 88px;
    background-color: white;
    border: 1px solid #e5e6eb;
    border-radius: 6px;
    &.arco-tag-checked {
      color: rgb(var(--primary-6));
      background-color: #e8f3ff;
      border-color: rgb(var(--primary-6));
    }
  }
  .auto-renew-item {
    .arco-form-item-wrapper-col {
      min-height: 14px;
    }
    .arco-form-item-label {
      display: flex;
      align-items: center;
      pointer-events: none;

      .arco-switch {
        pointer-events: all;
        order: 3;
        margin-left: 8px;
      }
    }
    .arco-form-item-content-wrapper {
      display: none;
    }
  }
  .time-input-container {
    display: flex;
    width: 136px;
    flex-direction: row;
    .time-input {
      border-radius: 6px 0 0 6px;
      .arco-input-suffix {
        border-radius: 6px 0 0 6px;
        .arco-input-number-step-button,
        .arco-input-number-step {
          border-radius: 0;
        }
        visibility: hidden;
      }
      &:hover .arco-input-suffix {
        visibility: visible;
      }
    }
    .input-des {
      width: 40px;
      height: 32px;
      border-radius: 0 6px 6px 0;
      flex-shrink: 0;
    }
  }
  // .time-input {
  //   width: 136px;
  //   .arco-input-append {
  //     @apply text-ct-3;
  //   }
  // }
}
</style>
