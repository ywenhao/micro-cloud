import { getCdnSiteResolveStatusApi } from '@vcp/apis/cdn'
import { isEqual } from 'lodash-es'
import { computed } from 'vue'

export type ResolveStats = {
  loading: boolean
  status?: number
}

export const useResolveStatus = () => {
  // 存储对应的所有的ID
  const keys = ref<string[]>([])
  // 存储id对应的状态(loading, status)
  const resolveStatsMap = reactive<Record<string, ResolveStats>>({})

  const resolveStats = computed<(record: { id: string }) => ResolveStats>(
    () => (record: { id: string }) => resolveStatsMap[record.id]
  )

  // 根据传入module 执行对应的方法

  // 异步获取解析状态
  const asyncGetResolveStatus = (key: string) => {
    resolveStatsMap[key] = {
      loading: true,
      status: 0
    }
    getCdnSiteResolveStatusApi({ site_id: key })
      .then(res => {
        resolveStatsMap[key].status = res.resolve_status
          ? Number(res.resolve_status)
          : 0
      })
      .catch(() => {
        resolveStatsMap[key].status = -1
      })
      .finally(() => {
        resolveStatsMap[key].loading = false
      })
  }

  // 遍历执行 获取状态方法
  const execute = () => keys.value.forEach(asyncGetResolveStatus)

  const setKeys = (value: string[]) => {
    // 当前数据和之前数据不相同, 并且 当前数据长度 > 0
    if (!isEqual(value, keys.value) && value.length > 0) {
      keys.value = value
      execute()
    }
  }

  return { resolveStats, asyncGetResolveStatus, setKeys }
}
