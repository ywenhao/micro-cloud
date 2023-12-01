<template>
  <a-drawer
    :esc-to-close="false"
    :mask-closable="false"
    :model-value="visible"
    width="856px"
    :ok-loading="loading"
    v-model:visible="visible"
    @close="handleClose"
    :title="pageTitle"
    @before-open="handleOpen"
    :cancel-button-props="{ type: 'outline' }"
    :on-before-ok="handleConfirm"
  >
    <a-form layout="vertical" ref="formRef" :rules="rules" :model="formState">
      <a-form-item asterisk-position="end" label="规则名称" field="name">
        <a-input
          v-model.trim="formState.name"
          :max-length="30"
          show-word-limit
          placeholder="请输入规则名称"
          class="w-344px!"
        />
      </a-form-item>
      <a-form-item asterisk-position="end" label="匹配规则" required>
        <matching-rule ref="matchingRef" v-model="ruleGroups"></matching-rule>
      </a-form-item>
      <template v-if="rule_type === 3">
        <a-form-item
          field="url_rewrite_rule.path"
          :rules="pathRule"
          label="路径"
          asterisk-position="end"
        >
          <div class="flex flex-col gap-y-2">
            <a-radio-group
              v-model="urlRadioState.path"
              @change="(v)=>handleRadioChange(v as number,'path')"
            >
              <a-radio :value="1">保留（原始请求中的路径）</a-radio> <br />
              <a-radio :value="2"
                >重写到（例如，content/images/thumbnails）</a-radio
              >
            </a-radio-group>
            <a-input
              v-if="urlRadioState.path == 2"
              v-model="formState.url_rewrite_rule!.path"
              placeholder="请填写路径"
            >
              <template #prepend>
                <a-tag color="gray">/</a-tag>
              </template>
            </a-input>
          </div>
        </a-form-item>
        <a-form-item
          field="url_rewrite_rule.query"
          label="查询"
          :rules="queryRule"
          asterisk-position="end"
        >
          <div class="flex flex-col gap-y-2">
            <a-radio-group
              v-model="urlRadioState.query"
              @change="(v)=>handleRadioChange(v as number,'query')"
            >
              <a-radio :value="1">保留（原始请求中的查询）</a-radio> <br />
              <a-radio :value="2">重写到（例如，page=1234）</a-radio>
            </a-radio-group>
            <a-input
              v-if="urlRadioState.query == 2"
              v-model="formState.url_rewrite_rule!.query"
              placeholder="请填写查询信息"
            >
              <template #prepend>
                <a-tag color="gray">?</a-tag>
              </template>
            </a-input>
          </div>
        </a-form-item>
      </template>
      <template v-else>
        <http-header-view
          v-model:headers="headers"
          ref="httpHeaderViewRef"
        ></http-header-view>
      </template>
      <a-form-item
        asterisk-position="end"
        v-if="!props.id"
        label="优先级"
        field="priority"
      >
        <a-radio-group v-model="formState.priority">
          <a-radio
            v-for="item in orderList"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>
<script setup lang="ts">
import type { FieldRule, FormInstance } from '@arco-design/web-vue'
import { Message } from '@arco-design/web-vue'
import {
  addCdnSiteTransformRuleByIdApi,
  getCdnSiteTransformRuleDetailByIdApi,
  updateCdnSiteTransformRuleByIdApi
} from '@vcp/apis/cdn'
import { omit } from 'lodash-es'
import { v4 as uuidV4 } from 'uuid'
import { computed, nextTick, reactive, ref } from 'vue'

import MatchingRule from '@/components/MatchingRule/MatchingRule.vue'
import type { IMatchingGroup } from '@/components/MatchingRule/types'

import HttpHeaderView from './HttpHeaderView.vue'

// 刷新表格事件
const emit = defineEmits(['submit', 'closeDialog'])
interface HeaderRule {
  uuid: string
  action: number | undefined
  name: string
  value: string
}
interface TransFormRule {
  rule_id?: string
  site_id?: string
  name?: string
  status?: number
  priority?: string
  match_rule?: string
  url_rewrite_rule?: {
    path?: string
    query?: string
  }
  head_rewrite_rule?: [
    {
      action?: number
      name?: string
      value?: string
    }
  ]
  rule_type?: number
  match_rule_template?: string
  created_at?: string
  updated_at?: string
}
interface IProps {
  modelValue: boolean
  direction?: string
  id?: string
  rule_type: number
}
const props = withDefaults(defineProps<IProps>(), {
  modelValue: false,
  direction: 'rtl'
})

const httpHeaderViewRef = ref<InstanceType<typeof HttpHeaderView>>()
const headers = ref<HeaderRule[]>([
  { uuid: uuidV4(), action: undefined, name: '', value: '' }
])
const visible = useVModel(props, 'modelValue', emit)

const matchingRef = ref()

const selectAll = ref(false)
const isIndeterminate = ref(false)
const route = useRoute()
const siteId = route.params.id as string
const regionKeysLength = ref(0)
const loading = ref(false)
const formRef = ref<FormInstance>()

//类型为重写url时，路径和参数状态
const urlRadioState = reactive({
  path: 1,
  query: 1
})

const pathRule = computed<FieldRule>(() => {
  if (props.rule_type === 3 && urlRadioState.path === 2) {
    return {
      required: true,
      validator: (value: string, callback: (value?: string) => void) => {
        if (!value) {
          callback('请填写路径')
        }
        if (value.startsWith('/')) {
          callback('路径格式错误，不能以/开头')
        }
      }
    }
  }
  return {}
})

const queryRule = computed<FieldRule>(() => {
  if (props.rule_type === 3 && urlRadioState.query === 2) {
    return {
      required: true,
      validator: (value: any, callback: (value?: string) => void) => {
        if (!value) {
          callback('请填写参数')
        }

        if (value.charAt(0) === '/') {
          callback('路径格式错误，不能以?开头')
        }
      }
    }
  }
  return {
    validator: (_value: any, callback: (value?: string) => void) => {
      if (urlRadioState.path === 1 && urlRadioState.query === 1) {
        callback('路径和查询不能两个都为保留')
      }
    }
  }
})

const ruleGroups = ref<IMatchingGroup[]>([
  {
    uuid: uuidV4(),
    rules: [
      {
        uuid: uuidV4(),
        field: '',
        operator: '',
        value: ''
      }
    ]
  }
])
const disabledFn = (data: any): boolean => {
  if (data.nodes) {
    if (data.nodes.length < 1) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

const handleRadioChange = (_v: number, type: 'path' | 'query') => {
  if (type == 'path') {
    formState.url_rewrite_rule!.path = ''
  } else {
    formState.url_rewrite_rule!.query = ''
  }
}
//获取所有子节点数据
const getAllChildren = (nodeArr: any = [], arr: any = []) => {
  for (const item of nodeArr) {
    if (item.disabled) continue
    if (!item.nodes && item.id) arr.push(item.id)
    if (item.nodes && item.nodes.length) {
      getAllChildren(item.nodes, arr)
    }
  }
  return arr
}

// 校验表单
const rules = reactive<Record<string, FieldRule[]>>({
  name: [
    { required: true, message: '请输入规则名称' },
    { validator: validateTitle }
  ],
  // rule: [{ required: false, message: '请选择匹配规则', }],
  operation: [{ required: true, message: '请选择' }],
  priority: [{ required: true, message: '请选择' }]
})

const regionList = ref<any[]>([])
const customRegionList = computed(() =>
  regionList.value.map(v => ({
    ...v,
    disabled: disabledFn(v)
  }))
)

const orderList = [
  {
    value: '1',
    label: '优先级最高'
  },
  {
    value: '0',
    label: '优先级最低'
  }
]

const formState = reactive<TransFormRule>({
  rule_id: '',
  site_id: '',
  name: '',
  status: 2,
  priority: '1',
  match_rule: '',
  url_rewrite_rule: {
    path: '',
    query: ''
  },
  head_rewrite_rule: [
    {
      action: 0,
      name: '',
      value: ''
    }
  ],
  rule_type: props.rule_type,
  match_rule_template: ''
})

const pageTitle = computed(() => (props.id ? '编辑规则' : '创建规则'))
// 获取详情
const getDetails = (rule_id: string) => {
  getCdnSiteTransformRuleDetailByIdApi({ rule_id, site_id: siteId }).then(
    res => {
      const rule = res.rule ?? {}
      const { match_rule_template, head_rewrite_rule, url_rewrite_rule } = rule

      for (const key in formState) {
        if (Object.hasOwnProperty.call(rule, key)) {
          // @ts-ignore
          formState[key] = res.rule[key]
        }
      }
      if (url_rewrite_rule?.path) {
        urlRadioState.path = 2
      }
      if (url_rewrite_rule?.query) {
        urlRadioState.query = 2
      }
      ruleGroups.value = JSON.parse(match_rule_template as string)
      headers.value = (
        head_rewrite_rule as unknown as {
          action: number
          name: string
          value: string
        }[]
      ).map(item => {
        return { uuid: uuidV4(), ...item }
      })
    }
  )
}
// const selectDisabled = ref(false)
watch(
  () => customRegionList.value,
  val => {
    regionKeysLength.value = getAllChildren(val).length
    // if (regionKeysLength.value === formState?.node_ids?.length) {
    //   selectAll.value = true
    // } else {
    //   selectAll.value = false
    // }
    isIndeterminate.value =
      length > 0 && length < getAllChildren(customRegionList.value).length
  },
  { deep: true }
)
const handleConfirm = async () => {
  let validate: any

  validate = await Promise.all([
    formRef.value?.validate(),
    matchingRef.value.validate()
  ])

  if (props.rule_type != 3) {
    validate = await Promise.all([
      formRef.value?.validate(),
      matchingRef.value.validate(),
      httpHeaderViewRef.value?.validate()
    ])
  }
  if (validate.flat(Infinity).filter(Boolean).length) return false

  /**新增或编辑 */

  const match_rule = matchingRef.value?.generateTemplate() as string

  const headerRules = httpHeaderViewRef.value?.generate()
  const data = {
    ...omit(formState, 'head_rewrite_rule'),
    site_id: siteId,
    rule_id: formState?.rule_id,
    name: formState?.name,
    // operation: formState?.operation,
    match_rule,
    match_rule_template: JSON.stringify(ruleGroups.value),
    head_rewrite_rule: headerRules,
    priority: Number(formState.priority)
    // is_enable: formState.is_enable ?? 1
  }
  if (data.match_rule) {
    // @ts-ignore
    handleEditorUser(data)
  } else {
    Message.error('请输入匹配规则')
  }
}
//抽屉打开
const handleOpen = () => {
  if (props.id) {
    nextTick(() => {
      getDetails(props.id as string)
    })
  }
}
// 抽屉关闭
const handleClose = () => {
  emit('closeDialog')
  formRef.value?.resetFields()
  httpHeaderViewRef.value?.reset()
  Object.assign(formState, {
    rule_id: undefined,
    name: '',
    operation: '',
    rule: '',
    match_rule_template: '',
    region_id: '',
    priority: ''
  })
  ruleGroups.value = [
    {
      uuid: uuidV4(),
      rules: [
        {
          uuid: uuidV4(),
          field: '',
          operator: '',
          value: ''
        }
      ]
    }
  ]
  regionKeysLength.value = 0
  regionList.value = []
  selectAll.value = false
  isIndeterminate.value = false
}
const handleEditorUser = (formState: TransFormRule) => {
  if (formState?.rule_id) {
    edit(formState)
  } else {
    add(formState)
  }
}
//重置
const resetFunc = () => {
  emit('closeDialog')
  emit('submit')
}

/**编辑 */
const edit = (formState: TransFormRule) => {
  const params = {
    site_id: siteId,
    rule_id: props.id!,
    rule: { ...formState }
  }

  loading.value = true
  // @ts-ignore
  updateCdnSiteTransformRuleByIdApi({ ...params })
    .then(() => {
      Message.success('修改成功')
      resetFunc()
    })
    .finally(() => {
      loading.value = false
    })
}
/**新增 */
const add = (formState: TransFormRule) => {
  loading.value = true
  const params = {
    site_id: siteId,
    rule_type: props.rule_type,
    rule: { ...formState, rule_id: '0' }
  }

  // @ts-ignore
  addCdnSiteTransformRuleByIdApi({ ...params })
    .then(() => {
      Message.success('添加成功')
      resetFunc()
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<style lang="less" scoped>
:deep(.arco-input-append) {
  padding: 0 6px;
}
:deep(.arco-input-wrapper) {
  width: 284px;
}
</style>
