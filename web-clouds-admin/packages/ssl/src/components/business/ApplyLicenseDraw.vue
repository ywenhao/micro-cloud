<template>
  <a-drawer
    :width="600"
    :title="title"
    :mask-closable="false"
    :ok-loading="loading"
    :visible="visible"
    unmount-on-close
    destroy-on-close
    class="vc-drawer"
    @beforeOpen="handleOpen"
    @beforeCancel="handleCancel"
  >
    <a-steps :current="currentStep" class="apply-steps">
      <a-step>
        填写申请
        <template #icon>
          <vc-svg-icon
            prefix="ssl"
            :name="
              currentStep === 1 ? 'fill_apply_active' : 'fill_apply_default'
            "
            :size="20"
          ></vc-svg-icon>
        </template>
      </a-step>
      <a-step>
        验证信息
        <template #icon>
          <vc-svg-icon
            prefix="ssl"
            :name="
              currentStep === 2 ? 'verify_info_active' : 'verify_info_default'
            "
            :size="20"
          ></vc-svg-icon>
        </template>
      </a-step>
    </a-steps>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
      class="apply-form"
    >
      <template v-if="currentStep === 1">
        <a-form-item
          asterisk-position="end"
          field="domain"
          label="证书绑定域名"
          class="domain-item"
          required
        >
          <a-textarea
            v-if="isBatch"
            v-model="formState.domain"
            :max-length="10000"
            :disabled="command === 'renew'"
            show-word-limit
            placeholder="请输入域名，一行一个，最多添加500个"
            class="domain-area"
          />
          <a-input
            v-else
            v-model.trim="formState.domain"
            show-word-limit
            placeholder="请输入域名"
            :disabled="command === 'renew'"
            :max-length="100"
            @blur="domainDnsAutoVerify"
            @focus="clearTimer"
          ></a-input>

          <template #extra>
            <span
              >输入google.com、ssl.google.com、www.google.com，为申请单个域名证书；
              输入*.google.com时，则为申请google.com及其泛域名证书；</span
            >
            <common-banner
              v-if="domainState.showBanner"
              :status="domainState.status"
              :content="domainState.content"
              :record="formState"
            ></common-banner>
          </template>
        </a-form-item>
        <a-form-item
          asterisk-position="end"
          field="desc"
          label="证书备注名"
          :class="{ 'remark-item': isBatch }"
        >
          <template v-if="isBatch" #label>
            <span>证书备注名：系统自动生成</span>
          </template>

          <a-input
            v-if="!isBatch"
            v-model.trim="formState.desc"
            show-word-limit
            placeholder="请输入证书备注名"
            :max-length="20"
          ></a-input>
        </a-form-item>
        <a-form-item
          asterisk-position="end"
          field="is_verify"
          label="域名验证方式"
          :class="{ 'csr-item': isBatch }"
        >
          <template v-if="isBatch" #label>
            <div class="flex flex-row gap-x-1">
              <span>域名验证方式：NS自动验证</span>
              <a-tooltip
                background-color="white"
                content-class="tool-content"
                position="right"
              >
                <vc-svg-icon
                  prefix="ssl"
                  name="question"
                  :size="16"
                  class="mt-[2px]"
                ></vc-svg-icon>
                <template #content>
                  <span>需要在DNS控制台添加域名</span><br />
                  <span>并登录域名控制台修改域名的NS服务器地址</span>
                </template>
              </a-tooltip>
            </div>
          </template>
          <template v-if="isBatch" #extra>
            <span>批量申请证书仅支持NS自动验证</span>
          </template>
          <template v-if="!isBatch">
            <a-select
              v-model="formState.is_verify"
              placeholder="请选择"
              :disabled="command !== 'apply'"
              @change="v => handleSelectChange(v as string)"
            >
              <a-option :value="1" :disabled="verifyDisabled"
                >NS自动验证</a-option
              >
              <a-option :value="2">手动DNS验证</a-option>
            </a-select>
          </template>
        </a-form-item>
        <a-form-item
          asterisk-position="end"
          field="brand"
          label="证书品牌"
          class="brand-item"
        >
          <template #label>
            <span>证书品牌：{{ showBrand }} </span>
            <span></span>
          </template>
          <template #extra>有效期3个月</template>
        </a-form-item>
        <a-form-item asterisk-position="end" field="algorithm" label="加密算法">
          <a-radio-group v-model="formState.algorithm" size="mini">
            <a-radio
              v-for="item in algorithmList"
              :key="item.label"
              :value="item.value"
              >{{ item.label }}</a-radio
            >
          </a-radio-group>
        </a-form-item>
        <a-form-item
          asterisk-position="end"
          field=""
          label="CSR生成：在线生成"
          class="csr-item"
        >
          <template #extra>
            平台生成和管理您的私钥和公钥证书文件，避免秘钥文件丢失。
          </template>
        </a-form-item>
      </template>
      <template v-else>
        <p class="mt-0 mb-6 text-ct-2">三步完成DNS验证</p>
        <a-steps direction="vertical" class="verify-steps">
          <a-step status="wait">
            登录域名控制台
            <template #description>
              登录注册域名所对应厂商的域名管理控制台
            </template>
          </a-step>
          <a-step status="wait">
            在域名控制台添加DNS解析记录
            <template #description>
              请按以下提示，在您的域名控制台添加DNS解析配置
              <verify-table :record="formState" class="mb-6"></verify-table>
            </template>
          </a-step>
          <a-step status="wait">
            验证DNS信息是否填写正确
            <template #description>
              如果您已在域名控制台配置好DNS解析，请点击“验证”检查信息是否正确
              <br />
              <a-button
                type="primary"
                :loading="verifyBtnState.loading"
                :disabled="verifyBtnState.disabled"
                class="mt-2"
                @click="handleDnsVerify"
              >
                {{ verifyBtnState.btnText }}
              </a-button>
              <common-banner
                v-if="dnsState.showBanner"
                :status="dnsState.status"
                :content="dnsState.content"
                :record="formState"
              ></common-banner>
            </template>
          </a-step>
        </a-steps>
      </template>
    </a-form>
    <template #footer>
      <template v-if="currentStep === 1">
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" :loading="loading" @click="handleSubmit"
          >提交申请</a-button
        >
      </template>
      <template v-else>
        <a-button @click="handleCancel">取消</a-button>
        <a-button @click="backApply">修改申请</a-button>
        <a-button
          type="primary"
          :loading="loading"
          :disabled="!verifyBtnState.disabled"
          @click="submitApply"
          >{{ command === 'renew' ? '续期' : '确认' }}</a-button
        >
      </template>
    </template>
  </a-drawer>
</template>
<script lang="ts" setup>
import type { FieldRule, FormInstance } from '@arco-design/web-vue'
import { cloneDeep } from 'lodash-es'

import { CommonBanner } from '@/components/business'
import { VerifyTable } from '@/components/business/'
import type { FormState } from '@/hooks/useApplyLicense'
import useApplyLicense from '@/hooks/useApplyLicense'
import type {
  ApplyCommand,
  ApplyListItem,
  LicenseInfo
} from '@/types/applyList'
import { domainValid } from '@/utils/domainValid'

/** props_start*/

interface IProps {
  visible: boolean
  title: string
  command: ApplyCommand
  isBatch: boolean // true:批量,false:单个申请
  data: ApplyListItem | ApplyListItem[] | undefined
}
interface IEmits {
  (event: 'update:visible', value: boolean): void
  (event: 'update-list'): void
  (event: 'update:data', value: undefined): void
}
const props = withDefaults(defineProps<IProps>(), {
  visible: false,
  title: '申请证书',
  command: 'apply',
  isBatch: false
})
const emits = defineEmits<IEmits>()
/** props_end*/

const formRef = ref<FormInstance>()

const domainValidator = (
  value: any,
  callback: (error?: undefined | string) => void
) => {
  const message = domainValid(value)
  callback(message)
}

const rules = computed<
  Record<
    keyof Pick<FormState, 'domain' | 'is_verify' | 'desc' | 'algorithm'>,
    FieldRule[]
  >
>(() => {
  return {
    domain: props.isBatch
      ? [{ required: true, message: '请输入域名' }]
      : [
          {
            required: true,
            validator: domainValidator
          }
        ],
    desc: props.isBatch
      ? []
      : [{ required: true, message: '请输入证书备注名', match: /\S/ }],
    is_verify: props.isBatch ? [] : [{ required: true }],
    algorithm: [{ required: true }]
  }
})

// 证书申请验证的hooks
const {
  algorithmList,
  brandList,
  domainState,
  dnsState,
  formState,
  loading,
  currentStep,
  verifyBtnState,
  actionState,
  verifyDisabled,
  isEdit,
  handleDnsVerify,
  getConfig,
  handleSelectChange,
  domainDnsAutoVerify,
  clearTimer,
  submitApply,
  backApply,
  reset,
  domainVerifyPass,
  dnsLogVerifyPass,
  dnsLogVerifyFail
} = useApplyLicense(handleClose, getList)

// 打开前处理上层传递的数据
const handleOpenData = () => {
  if (props.data && Array.isArray(props.data)) {
    const temData = props.data as ApplyListItem[]
    const temp = temData
      .map(item => {
        return item.domain
      })
      .filter(Boolean)
    const idList = temData
      .map(item => {
        return item.id!
      })
      .filter(Boolean)
    const domain = temp.join('\n')

    formState.value = {
      is_verify: 1,
      domain: domain,
      desc: '系统自动生成',
      algorithm: 1,
      id_list: idList,
      user_id: temData[0].user_id
    }
  } else if (props.data && !Array.isArray(props.data)) {
    const tem = props.data as ApplyListItem
    currentStep.value =
      tem.is_verify === 1 ? 1 : props.command == 'verify' ? 2 : 1
    formState.value = cloneDeep(tem)
    isEdit.value = tem.is_verify === 1 ? true : false
    if (tem.primary_domain) {
      formState.value.domain = tem.primary_domain
    }
    handleVerify(formState.value)
  }
}

// 验证或续期证书时，检查是否通过dns验证
function handleVerify(row: LicenseInfo) {
  if (row.is_challenged === 2) {
    if (row.is_verify === 1) {
      domainDnsAutoVerify()
      return
    }
    dnsLogVerifyFail()
  } else {
    if (row.is_verify === 1) {
      domainVerifyPass()
    } else {
      dnsLogVerifyPass()
    }
  }
}

const handleOpen = () => {
  actionState.command = props.command
  actionState.isBatch = props.isBatch
  getConfig()
  handleOpenData()
}

const handleSubmit = () => {
  formRef.value?.validate().then(valid => {
    if (!valid) {
      submitApply()
    }
  })
}

//关闭抽屉
const handleCancel = () => {
  formRef.value?.resetFields()
  reset()
  emits('update:visible', false)
  return true
}
function handleClose() {
  formRef.value?.resetFields()
  reset()
  getList()
  emits('update:visible', false)
}
function getList() {
  emits('update-list')
}

//展示证书品牌
const showBrand = computed(() => {
  if (brandList.value.length === 2) {
    return `${brandList.value[0].label} / ${brandList.value[1].label}`
  } else if (brandList.value.length === 1) {
    return brandList.value[0].label
  } else {
    return 'ZeroSSL'
  }
})
</script>
<style lang="less" scoped>
.apply-form {
  margin-top: 32px;
  :deep(.arco-form-item-wrapper-col) {
    min-height: 20px;
  }
  :deep(.arco-form-item-content) {
    order: 1;
    min-height: 20px;
  }
  :deep(.arco-form-item-extra) {
    width: 100%;
    order: 2;
  }
  :deep(.arco-form-item-message) {
    order: 3;
  }
  .csr-item,
  .brand-item {
    :deep(.arco-form-item-label-col) {
      margin-bottom: 0;
    }
    :deep(.arco-form-item-content) {
      display: none !important;
    }
  }
  .remark-item {
    :deep(.arco-form-item-wrapper-col) {
      display: none !important;
    }
  }
  :deep(.domain-area) {
    height: 160px;
    .arco-textarea {
      height: 160px;
    }
  }
  .dns-verify-error {
    padding: 6px 16px;
  }
  .arco-radio-group {
    height: 20px;
    .arco-radio {
      height: 20px;
    }
  }
}
</style>
