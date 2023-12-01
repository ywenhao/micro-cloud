import { Message } from '@arco-design/web-vue'
import {
  getCdnGlobalStorageConfigApi,
  getCdnnodeNodesBasicConfigByIdApi,
  getCdnnodeNodesBasicConfigResetByIdApi,
  type NodeBasicConfig,
  postCdnGlobalStorageConfigApi,
  type StorageConfig,
  updateCdnnodeNodesBasicConfigByIdApi
} from '@vca/apis/cdn'
import { convertByte } from 'vc-material'
import type { Ref } from 'vue'

import { UNITS } from '@/utils/utils'

import type { FormState } from './useFormState'

export function useHandle(
  loading: Ref<boolean>,
  formState: FormState,
  node_id?: string
) {
  const templateData = ref<NodeBasicConfig>()
  // 组装返回数据到 formState
  const setFormState = (storageConfig?: StorageConfig) => {
    const { memory, disk } = storageConfig || { memory: {}, disk: {} }

    formState.memory.memory_usage = memory?.memory_usage || undefined
    formState.disk.disk_path = disk?.disk_path || ''
    formState.disk.disk_usage = disk?.disk_usage || 0
    const memory_file = convertByte(
      memory?.memory_max_file_size as unknown as number
    ) as string
    formState.memory.memory_max_file_size =
      Number(String(memory_file).split(' ')[0]) || 4

    formState.memory.memory_max_file_size_unit =
      UNITS.labels.indexOf(memory_file.split(' ')[1]) === -1
        ? 0
        : UNITS.labels.indexOf(memory_file.split(' ')[1])
    const disk_file = convertByte(
      disk?.disk_max_file_size as unknown as number
    ) as string
    formState.disk.disk_max_file_size = Number(disk_file.split(' ')[0]) || 500
    formState.disk.disk_max_file_size_unit =
      UNITS.labels.indexOf(disk_file.split(' ')[1]) === -1
        ? 0
        : UNITS.labels.indexOf(disk_file.split(' ')[1])
  }

  /** 获取配置 */
  const getCacheTemplate = () => {
    if (node_id) {
      getCdnnodeNodesBasicConfigByIdApi({ node_id }).then(res => {
        setFormState(res.info?.storage_config)
        templateData.value = res?.info
      })
    } else {
      getCdnGlobalStorageConfigApi().then(res => {
        setFormState(res.storageConfig)
      })
    }
  }
  /** 重置配置 */
  const resetConfig = (
    node_id: string,
    config_key: '0' | '1' | '2' | undefined
  ) => {
    loading.value = true
    getCdnnodeNodesBasicConfigResetByIdApi({
      node_id: node_id,
      config_key: config_key
    })
      .then(() => {
        Message.success('重置成功')
      })
      .finally(() => {
        loading.value = false
      })
  }
  // 组装数据

  const getParams = () => {
    const { memory, disk } = formState
    const { memory_usage, memory_max_file_size, memory_max_file_size_unit } =
      memory
    const {
      disk_max_file_size_unit,
      disk_max_file_size,
      disk_path,
      disk_usage
    } = disk
    const storageConfig = {
      memory: {
        memory_usage: memory_usage,
        memory_max_file_size: String(
          (memory_max_file_size as number) *
            UNITS.values[memory_max_file_size_unit || 0]
        )
      },
      disk: {
        disk_max_file_size: String(
          (disk_max_file_size as number) * UNITS.values[disk_max_file_size_unit]
        ),
        disk_path: disk_path,
        disk_usage: disk_usage
      }
    }
    if (node_id) {
      return { ...templateData.value, storage_config: storageConfig, node_id }
    }
    return { storageConfig }
  }

  const handleSubmit = () => {
    loading.value = true
    const params = getParams()
    const action = node_id
      ? updateCdnnodeNodesBasicConfigByIdApi
      : postCdnGlobalStorageConfigApi
    action(params as any)
      .then(() => {
        getCacheTemplate()
        Message.success('保存成功')
      })
      .finally(() => {
        loading.value = false
      })
  }
  return { getCacheTemplate, resetConfig, handleSubmit }
}
