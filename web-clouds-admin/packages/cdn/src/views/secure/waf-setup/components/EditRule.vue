<template>
  <a-drawer
    :esc-to-close="false"
    :mask-closable="false"
    :model-value="visible"
    width="856px"
    class="is-admin"
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
      <a-form-item asterisk-position="end" label="执行策略" field="operation">
        <a-radio-group v-model="formState.operation">
          <a-radio
            v-for="item in OPERATION_LIST_NO_ALL"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
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
      <a-form-item asterisk-position="end" label="选择节点" field="node_ids">
        <div>
          <a-checkbox
            v-if="regionList.length"
            v-model="selectAll"
            :disabled="selectDisabled"
            :indeterminate="isIndeterminate"
            @change="selectAllChange"
            >全选</a-checkbox
          >
          <a-tree
            ref="treeRef"
            class="w-full"
            :data="customRegionList"
            checkable
            default-expand-all
            :default-checked-keys="formState.node_ids"
            :fieldNames="defaultProps"
            @check="handleChange"
          />
        </div>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>
<script setup lang="ts">
import type {
  FieldRule,
  FormInstance,
  TreeInstance
} from '@arco-design/web-vue'
import { Message } from '@arco-design/web-vue'
import {
  addCdnGlobalWafNodeApi,
  type NodeWafRuleModel,
  updateCdnGlobalWafNodeByIdApi
} from '@vca/apis/cdn'
import {
  getCdnGlobalWafNodeByIdApi,
  getCdnResolvRegionsNodesListApi
} from '@vca/apis/cdn'
import { v4 as uuidV4 } from 'uuid'
import { computed, nextTick, reactive, ref } from 'vue'

import MatchingRule from '@/components/MatchingRule/MatchingRule.vue'
import type { IMatchingGroup } from '@/components/MatchingRule/types'
import { siteStore } from '@/stores/modules/site'

import { OPERATION_LIST_NO_ALL } from '../state'
import type { ListData } from '../types'
// 刷新表格事件
const emit = defineEmits(['submit', 'closeDialog'])
interface IProps {
  modelValue: boolean
  direction?: string
  id?: string
}
const props = withDefaults(defineProps<IProps>(), {
  modelValue: false,
  direction: 'rtl'
})

const visible = useVModel(props, 'modelValue', emit)

const matchingRef = ref()
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
const defaultProps = {
  children: 'nodes',
  title: 'name',
  key: 'id'
}
const selectAll = ref(false)
const isIndeterminate = ref(false)
const treeRef = ref<TreeInstance>()
const checkNodes = ref<string[]>([])
const store = siteStore()
const activeSite = computed(() => store.siteInfo)
const regionKeysLength = ref(0)

const selectAllChange = () => {
  treeRef.value?.checkAll(selectAll.value)
  isIndeterminate.value = false
}
const handleChange = () => {
  formState.node_ids = treeRef.value
    ?.getCheckedNodes({ checkedStrategy: 'child' })
    .map(v => (v as any).id as string)

  selectAll.value = regionKeysLength.value === formState?.node_ids?.length

  const length = formState?.node_ids?.length as number
  isIndeterminate.value =
    length > 0 && length < getAllChildren(customRegionList.value).length
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
    value: 1,
    label: '优先级最高'
  },
  {
    value: 0,
    label: '优先级最低'
  }
]

const formRef = ref<FormInstance>()
const loading = ref(false)

interface WafData {
  rule_id?: string
  name?: string
  operation?: number | string
  expression?: string
  expression_template?: string
  priority?: number | string
  region_id?: string
  node_ids?: string[]
}

const formState = reactive<WafData>({
  rule_id: undefined,
  name: '',
  operation: '',
  expression: '',
  expression_template: '',
  region_id: '',
  priority: '',
  node_ids: []
})

const pageTitle = computed(() => (props.id ? '编辑规则' : '创建规则'))
// 获取详情
const getDetails = (rule_id: string) => {
  getCdnGlobalWafNodeByIdApi({ rule_id }).then(res => {
    // @ts-ignore
    const { id, name, operation, expression_template, priority, node_ids } =
      res.node_waf as NodeWafRuleModel
    formState.rule_id = id
    formState.name = name
    formState.operation = operation
    formState.priority = priority
    formState.node_ids = node_ids?.split(',').filter(Boolean)
    checkNodes.value = node_ids?.split(',') as string[]
    ruleGroups.value = JSON.parse(expression_template as string)
  })
}
const selectDisabled = ref(false)
// 获取区域列表
const getRegion = () => {
  getCdnResolvRegionsNodesListApi({})
    .then(res => {
      let list = res.list
      list = JSON.parse(
        JSON.stringify(list)
          .replaceAll('region_id', 'id')
          .replaceAll('region_name', 'name')
      )
      regionList.value = list!
      if (JSON.stringify(regionList.value).indexOf('nodes') === -1) {
        selectDisabled.value = true
      } else {
        selectDisabled.value = false
      }
      regionKeysLength.value = getAllChildren(customRegionList.value).length
    })
    .finally(() => {})
}
watch(
  () => customRegionList.value,
  val => {
    regionKeysLength.value = getAllChildren(val).length
    if (regionKeysLength.value === formState?.node_ids?.length) {
      selectAll.value = true
    } else {
      selectAll.value = false
    }
    const length = formState?.node_ids?.length as number
    isIndeterminate.value =
      length > 0 && length < getAllChildren(customRegionList.value).length
  },
  { deep: true }
)
const handleConfirm = async () => {
  const validate = await Promise.all([
    formRef.value?.validate(),
    matchingRef.value.validate()
  ])
  console.log('validate: ', validate)
  console.log(validate.flat(Infinity).filter(Boolean).length)

  if (validate.flat(Infinity).filter(Boolean).length) return false

  /**新增或编辑 */
  const { id } = activeSite.value

  const expression = matchingRef.value?.generateTemplate() as string
  const data = {
    site_id: id,
    rule_id: formState?.rule_id,
    name: formState?.name,
    operation: formState?.operation,
    expression,
    expression_template: JSON.stringify(ruleGroups.value),
    node_ids: treeRef.value
      ?.getCheckedNodes({ checkedStrategy: 'child' })
      .map(v => (v as any).id as string)
      .join(','),
    region_id: undefined,
    priority: formState.priority
  }
  if (data.expression) {
    handleEditorUser(data)
  } else {
    Message.error('请输入匹配规则')
  }
}
//抽屉打开
const handleOpen = () => {
  getRegion()
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
  Object.assign(formState, {
    rule_id: undefined,
    name: '',
    operation: '',
    expression: '',
    expression_template: '',
    region_id: '',
    priority: '',
    node_ids: []
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
const handleEditorUser = (formState: any) => {
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
const edit = (formState: ListData) => {
  const params = {
    rule_id: props.id!,
    rule: { ...formState }
  }
  loading.value = true
  // @ts-ignore
  updateCdnGlobalWafNodeByIdApi({ ...params })
    .then(() => {
      Message.success('修改成功')
      resetFunc()
    })
    .finally(() => {
      loading.value = false
    })
}
/**新增 */
const add = (formState: ListData) => {
  loading.value = true
  const params = {
    rule: { ...formState }
  }
  // @ts-ignore
  addCdnGlobalWafNodeApi({ ...params })
    .then(() => {
      Message.success('添加成功')
      resetFunc()
    })
    .finally(() => {
      loading.value = false
    })
}
</script>
../state
