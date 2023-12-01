<template>
  <vc-dialog
    title="添加域名"
    :loading="loading"
    v-model="visible"
    width="596px"
    @close="handleClose"
    :okBtnDisabled="!formState.domains"
    :on-before-ok="handleSubmit"
    @open="handleOpen"
  >
    <a-form class="w-full" ref="formRef" :model="formState" :rules="rules">
      <a-form-item :row-props="{ span: 24 }" hide-label field="domains">
        <domain-input-vue v-model="inputValue" />
      </a-form-item>
      <a-form-item
        field="rr_value"
        hide-asterisk
        :label-col-props="{ span: 24 }"
        :label-col-style="{
          marginTop: '16px',
          lineHeight: '20px',
          pointerEvents: 'none',
          marginBottom: isForce ? '16px' : '8px',
          justifyContent: 'flex-start'
        }"
        :wrapper-col-props="{ span: 24 }"
        :wrapper-col-style="{ display: !isForce ? 'none' : void 0 }"
      >
        <template #label>
          <div class="flex w-full">
            <a-checkbox v-model="isForce" class="pointer-events-auto pl-0!" />
            <div ml-8px select-none>同时为新域名添加 @ 和 WWW 的 A 记录</div>
          </div>
        </template>
        <a-input
          v-model="formState.rr_value"
          placeholder="请输入记录数值，如：1.2.3.4"
        />
      </a-form-item>
    </a-form>

    <div select-none class="more">
      更多批量添加域名操作，请点击<span class="link" @click="toBatchAddPage"
        >批量添加域名</span
      >
    </div>
    <add-domain-error-modal v-model="errorDialogVisible" :state="errorState" />
  </vc-dialog>
</template>

<script setup lang="tsx">
import {
  type FieldRule,
  type FormInstance,
  Message
} from '@arco-design/web-vue'
import { domainNsAddApi } from '@vcp/apis/dns'
import { getTrimValue, ipv4Reg } from 'vc-material'

import { domainRules } from '@/rules/domain'

import DomainInputVue from '../DomainInput.vue'
import AddDomainErrorModal from '../error-dialog/AddDomainErrorModal.vue'

interface IProps {
  domains: string
  modelValue: boolean
}

interface IEmits {
  (event: 'submit'): void
  (event: 'update:modelValue', value: boolean): void
}

const router = useRouter()
const props = defineProps<IProps>()
const emit = defineEmits<IEmits>()
const visible = useVModel(props, 'modelValue')

const loading = ref(false)
const isForce = ref(false)
const inputValue = ref<string>('')

const formRef = ref<FormInstance>()

const formState = reactive({
  domains: computed(() => inputValue.value),
  rr_value: ''
})

const domainsTrim = computed(() => getTrimValue(formState.domains))

const rules = computed(
  () =>
    ({
      domains: [...domainRules],
      rr_value: isForce.value
        ? [
            {
              required: true,
              message: '请输入记录值'
            },
            {
              validator(value, callback) {
                if (!ipv4Reg.test(value)) {
                  return callback('记录值格式错误')
                }
              }
            }
          ]
        : []
    } as Record<string, FieldRule[]>)
)

const errorDialogVisible = ref(false)
const errorState = reactive({
  success_rr_count: '0',
  fail_domains: [] as string[],
  success_count: '0'
})

/**添加域名 */
const addDomain = async () => {
  try {
    const res = await domainNsAddApi({
      names: domainsTrim.value,
      rr_value: isForce.value ? formState.rr_value : void 0
    })
    const successRrCount = +(res.success_rr_count ?? '0')
    const successDomainCount = +(res.success_count ?? '0')
    const domainTotalCount = +(res.domain_count ?? '0')
    // @ , www
    const rrsTotalCount = isForce.value && formState.rr_value ? 2 : 0
    let isError = false
    if (isForce.value) {
      isError = domainTotalCount * rrsTotalCount !== successRrCount
    }
    if (!res.fail_domains?.length && !isError) {
      Message.success({
        content: () => (
          <div class="text-left">
            <div class="pb-1">添加成功</div>
            <div>
              共添加{successDomainCount}个域名，{successRrCount}条记录
            </div>
          </div>
        )
      })
    } else {
      errorState.success_rr_count = res.success_rr_count ?? '0'
      errorState.fail_domains = res.fail_domains ?? []
      errorState.success_count = res.success_count ?? '0'
      errorDialogVisible.value = true
    }
    emit('submit')
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  const err = await formRef.value?.validate()
  if (err) return false
  loading.value = true
  return addDomain()
}

function handleOpen() {
  inputValue.value = props.domains
}

function handleClose() {
  formState.rr_value = ''
  isForce.value = false
  formRef.value?.clearValidate()
  inputValue.value = ''
}

function toBatchAddPage() {
  visible.value = false
  router.push({ name: 'DomainBatchAdd' })
}
</script>

<style lang="less" scoped>
.more {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.link {
  margin-left: 4px;
  color: rgb(var(--primary-6));
  cursor: pointer;
}
</style>
