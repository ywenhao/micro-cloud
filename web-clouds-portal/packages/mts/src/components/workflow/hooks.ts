import { Message } from '@arco-design/web-vue'
import type {
  WorkflowConfList,
  WorkflowNodeConf,
  WorkflowOutPutConf,
  WorkflowScreenshotConf,
  WorkflowSpliceConf,
  WorkflowVideoConf
} from '@vcp/apis/mts'
import { isNil } from 'lodash-es'
import { generateUUID as uuidV4 } from 'vc-material'
import type { Ref } from 'vue'

import type X6Flow from '@/components/flow/X6Flow.vue'

import type { FromNodeData, NodeData, NodeTypeKeys } from '../flow/types'
import type { DataMap } from './edit/EditDrawer.vue'
import type EditDrawer from './edit/EditDrawer.vue'

/**
 * 工作流
 * @param isEdit 是否可以编辑
 * @returns
 */
export function useWorkFlow(isEdit?: boolean) {
  const activeNodeId = ref('')
  const flowRef = ref<InstanceType<typeof X6Flow>>()
  const drawerRef = ref<InstanceType<typeof EditDrawer>>()

  const flowDataMap = reactive<DataMap>([])
  const drawerVisible = ref(false)

  const onNodeClick = (data: NodeData) => {
    activeNodeId.value = data.nodeId
    drawerVisible.value = true
  }

  const onNodeDelete = (data: NodeData) => {
    const idx = flowDataMap.findIndex(v => v.id === data.nodeId)
    idx > -1 && flowDataMap.splice(idx, 1)
  }

  const onNodeAdd = (data: NodeData) => {
    if (data.type === 'start') return
    if (!flowDataMap.some(v => v.id! === data.nodeId)) {
      flowDataMap.push({ id: data.nodeId, type: data.type, data: {} })
    }
  }

  const getFatherId = (id: string) => {
    const data = flowRef.value!.getData()
    const source = data.find(v => v.children.includes(id))
    return source ? source.nodeId : ''
  }

  const getFatherFormData = (id: string) => {
    const fId = getFatherId(id)
    const data = getFlowFormData().find(v => v.id === fId)
    return data
  }

  const setNodeVerifyErrorMessage = (ids: string[]) => {
    if (ids.length) {
      ids.forEach(id => {
        flowRef.value?.setNodeData(id, {
          status: 'validate-error',
          verifyErrorMessage: '请正确填写参数值'
        })
      })
    } else {
      const data = getFlowNodeData()
      data
        .filter(v => v.status === 'validate-error')
        .forEach(v => {
          clearNodeVerifyError(v.nodeId)
        })
    }
  }

  // 清除节点验证错误
  const clearNodeVerifyError = (id: string) => {
    flowRef.value?.setNodeData(id, {
      status: 'normal',
      verifyErrorMessage: ''
    })
  }

  // 验证
  const check = async () => {
    const nodeData = getFlowNodeData()
    if (nodeData?.some(v => v.isLeaf && v.type !== 'output')) {
      Message.error('请为工作流添加输出节点')
      return false
    }
    // 有未填写的
    const validate = await drawerRef.value?.validate()!
    const errorDrawers = validate?.filter(v => v.err)
    setNodeVerifyErrorMessage(errorDrawers.map(v => v.id))
    if (errorDrawers.length) {
      Message.error('工作流未成功配置')
      return false
    }
    return true
  }

  const getFlowFormData = (isSubmit = false) =>
    drawerRef.value ? drawerRef.value?.getData(isSubmit)! : flowDataMap

  const getFlowNodeData = () => flowRef.value?.getData()!

  const getSubmitData = () => {
    const formData = getFlowFormData(true)
    const nodeData = getFlowNodeData()
    return getFormTreeData(formData, nodeData)
  }

  const getDataByResult = (data: WorkflowConfList) => getFlatData(data)

  const setFlowData = (
    data: WorkflowConfList,
    // 开始节点信息
    startInfo?: { isSuccess: boolean; errMsg?: string }
  ) => {
    const { formData, nodeData } = getDataByResult(data)
    flowDataMap.push(...formData)
    if (startInfo) {
      const start = nodeData.find(v => v.type === 'start')!
      if (startInfo.isSuccess) start.status = 'success'
      else if (startInfo.errMsg) {
        start.status = 'error'
        start.tooltipMessage = startInfo.errMsg
      }
    }
    flowRef.value?.fromData(nodeData)
  }

  watch(drawerVisible, async val => {
    if (!val) {
      flowRef.value?.clearActive()
      if (isEdit) {
        const err = await drawerRef.value?.validate(activeNodeId.value)!
        !err && clearNodeVerifyError(activeNodeId.value)
      }
      activeNodeId.value = ''
    }
  })

  provide('getFatherFormData', getFatherFormData)
  return {
    flowRef,
    drawerRef,
    activeNodeId,
    flowDataMap,
    drawerVisible,
    check,
    onNodeClick,
    onNodeDelete,
    onNodeAdd,
    getFatherId,
    getFatherFormData,
    getFlowFormData,
    getFlowNodeData,
    getSubmitData,
    setNodeVerifyErrorMessage,
    clearNodeVerifyError,
    getDataByResult,
    setFlowData
  }
}

const workflowConfTypeMap: Record<NodeTypeKeys, number> = {
  normalTranscode: 1,
  videoSplice: 2,
  screenshot: 3,
  output: 4
}

const workflowKeyMap: Record<NodeTypeKeys, string> = {
  normalTranscode: 'workflow_video_conf',
  videoSplice: 'workflow_splice_conf',
  screenshot: 'workflow_screenshot_conf',
  output: 'workflow_out_put_conf'
}

const workflowPresetKeyMap: Record<NodeTypeKeys, string> = {
  normalTranscode: 'video_preset',
  videoSplice: 'splice_preset',
  screenshot: 'screenshot_preset',
  output: ''
}

function getFormTreeData(formData: DataMap, nodeData: NodeData[]) {
  const start = nodeData.find(v => v.type === 'start')!
  const nodeIds = start.children

  const getData = (ids: string[], arr: WorkflowConfList = []) => {
    ids.forEach(id => {
      const node = nodeData.find(v => v.nodeId === id)!
      const form = formData.find(v => v.id === id)!
      const type = node.type as NodeTypeKeys
      const key = workflowKeyMap[type]
      const workflow_conf_type = workflowConfTypeMap[type]
      const item = { [key]: { ...form.data }, workflow_conf_type }
      if (node.children.length) {
        // 截图后面没有list
        if (type === 'screenshot') {
          // @ts-ignore
          item[key][workflowKeyMap.output] = getData(node.children)[0][
            workflowKeyMap.output
          ]
        } else {
          // @ts-ignore
          item[key]['workflow_conf_list'] = getData(node.children)
        }
      }
      arr.push(item as WorkflowConfList[number])
    })
    return arr
  }
  return getData(nodeIds)
}

const typeMap = Object.entries(workflowConfTypeMap).reduce(
  (acc, [k, v]) => ({ ...acc, [v]: k }),
  {}
)

function getFlatData(data: WorkflowConfList) {
  const formData: DataMap = []
  const nodeData: FromNodeData[] = []
  const startNode: FromNodeData = {
    nodeId: uuidV4(),
    type: 'start',
    status: 'normal',
    children: []
  }
  nodeData.push(startNode)

  const setData = (data: WorkflowConfList, fatherId = startNode.nodeId) => {
    const childrenIds: string[] = []
    data.forEach(v => {
      const id = uuidV4()
      childrenIds.push(id)
      const type = typeMap[
        v.workflow_conf_type as keyof typeof typeMap
      ] as NodeTypeKeys
      const key = workflowKeyMap[type as keyof typeof workflowKeyMap] as string
      const item = v[key as keyof typeof v] as Record<string, unknown>
      const item2 = (item ? { ...(item as object) } : {}) as WorkflowNodeConf
      Reflect.deleteProperty(item2, 'workflow_conf_list')
      formData.push({ id, type, data: item2 })
      const item3 = type === 'output' ? item : item[workflowPresetKeyMap[type]]
      const status =
        // @ts-ignore
        !item3.status ? 'normal' : item3.message ? 'error' : 'success'
      const tooltipMessage = (item3 as any).message as string
      const node: FromNodeData = {
        nodeId: id,
        status,
        tooltipMessage,
        type,
        children: []
      }
      nodeData.push(node)

      if (type === 'screenshot') {
        // @ts-ignore
        item.workflow_conf_list = [
          {
            workflow_conf_type: 4,
            // @ts-ignore
            [workflowKeyMap.output]: item[workflowKeyMap.output]
          }
        ]
      }
      const children = ((item as any)?.workflow_conf_list ||
        []) as WorkflowConfList
      children.length && setData(children, id)
    })

    const fatherNode = nodeData.find(v => v.nodeId === fatherId)!
    fatherNode.children.push(...childrenIds)
  }
  setData(data)
  return { formData, nodeData }
}

/**
 * 输出模块的后缀
 * @returns
 */
export function useSuffix(id: Ref<string>, state: Ref<WorkflowOutPutConf>) {
  const hlsSuffix = 'ts'

  const fatherData = shallowRef<DataMap[number]>()

  const getFatherFormData = inject('getFatherFormData') as (
    id: string
  ) => DataMap[number]

  const getFatherData = () => {
    fatherData.value = getFatherFormData(id.value)
  }

  const isManyScreenshot = computed(() => {
    if (!fatherData.value) return
    const { data, type } = fatherData.value
    if (type === 'screenshot') {
      return (
        (data as WorkflowScreenshotConf)?.screenshot_preset?.screenshot === 2
      )
    }
    return false
  })

  const format = computed(() => {
    if (!fatherData.value) return
    const { data, type } = fatherData.value
    if (type === 'normalTranscode') {
      const format = (data as WorkflowVideoConf)?.video_preset?.format
      if (isNil(format)) return
      const item = videoFormatOpts.find(item => item.value === format)
      return item?.label?.toLowerCase()
    }
    if (type === 'screenshot') {
      const format = (data as WorkflowScreenshotConf)?.screenshot_preset
        ?.screenshot_image
      if (isNil(format)) return
      const item = screenshotFormatOpts.find(item => item.value === format)
      return item?.label?.toLowerCase()
    }
    if (type === 'videoSplice') {
      const format = (data as WorkflowSpliceConf)?.splice_preset?.format
      if (isNil(format)) return
      const item = videoFormatOpts.find(item => item.value === format)
      return item?.label?.toLowerCase()
    }
  })

  const isHls = computed(() => {
    if (!fatherData.value) return
    const { type } = fatherData.value
    return (
      ['normalTranscode', 'videoSplice'].includes(type) &&
      format.value === 'hls'
    )
  })

  const fileName = computed(() => {
    const { name = '', name_suffix = '' } = state.value
    return `${name}${name_suffix}.${format.value}`
  })
  const hlsName = computed(() => {
    const { hls_name = '', hls_suffix } = state.value
    return `${hls_name}${hls_suffix}.${hlsSuffix}`
  })
  return {
    isManyScreenshot,
    isHls,
    fileName,
    hlsName,
    hlsSuffix,
    format,
    getFatherData
  }
}
