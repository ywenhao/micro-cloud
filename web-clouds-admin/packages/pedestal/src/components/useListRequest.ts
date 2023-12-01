import type { PaginationProps } from '@arco-design/web-vue'
import type { Ref } from 'vue'
import { computed, nextTick, reactive, ref, watch } from 'vue'

export type PromiseFn = (...args: any) => Promise<any>

export type LabelValue = {
  label: string
  value: string | number
}

export interface PaginationState {
  page: number
  limit: number
  offset: number
  total: number
}
export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Array<any> ? DeepReadonly<T[K]> : T[K]
}

export type NoReadonly<T> = {
  -readonly [K in keyof T]: T[K] extends ReadonlyArray<any>
    ? NoReadonly<T[K]>
    : T[K]
}

export type RequiredUtils<T> = T extends undefined ? never : T

type GetDataByRequest<T> = T extends (...args: any[]) => Promise<infer R>
  ? R extends { list?: infer D }
    ? D
    : never
  : never

type DefaultParams = Partial<PaginationState> & Record<string, any>

type RunParams<T extends PromiseFn, P> =
  | (Parameters<T>[0] & Partial<P>)
  | Parameters<T>[0]

/**
 * 通用list请求函数
 * @param fn 请求函数
 * @param defaultParams 默认可选参数
 * @returns
 */
export function useListRequest<T extends PromiseFn, D extends DefaultParams>(
  fn: T,
  defaultParams?: D,
  paginationProps?: PaginationProps
) {
  const loading = ref(false)
  const data = ref([]) as Ref<GetDataByRequest<T>>
  const pagination = reactive<PaginationState>({
    page: 1,
    limit: 20,
    offset: 0,
    total: 0
  })

  watch(
    () => pagination.page,
    page => {
      pagination.offset = (page - 1) * pagination.limit
    },
    { immediate: true }
  )

  const run = async (params?: RunParams<T, D>, ...args: any[]) => {
    loading.value = true
    try {
      await nextTick()
      const { offset, limit } = pagination

      const res = await fn(
        { ...unref(defaultParams), offset, limit, ...params },
        ...args
      )

      data.value = res.list
      pagination.total = res.total
    } finally {
      loading.value = false
    }
  }

  const arcoPagination = reactive<Partial<PaginationProps>>({
    current: 1,
    pageSize: 20,
    total: 0
  })

  watch(
    () => pagination,
    val => {
      const { page, limit, total } = val

      Object.assign(arcoPagination, {
        ...paginationProps,
        current: page,
        pageSize: limit,
        total
      })
    },
    { immediate: true, deep: true }
  )

  watch(
    () => arcoPagination,
    val => {
      const { current, pageSize } = val
      const { page, limit } = pagination
      if (current !== page) {
        pagination.page = current!
        pagination.offset = (current! - 1) * pagination.limit
      }

      if (limit !== pageSize) {
        pagination.limit = pageSize || 20
      }
    },
    { immediate: true, deep: true }
  )

  return { loading, run, data, pagination, arcoPagination }
}

type GetSwitchData<K, T> = T extends (
  | [K, PromiseFn]
  | [K, PromiseFn, DefaultParams]
)[]
  ? GetDataByRequest<T[number][1]>
  : never

type GetSwitchRun<K, T> = T extends (
  | [K, infer R extends PromiseFn]
  | [K, infer R extends PromiseFn, infer D extends DefaultParams]
)[]
  ? (params?: RunParams<R, D>, ...args: any[]) => Promise<void>
  : never

type SwitchFnList<T> = DeepReadonly<
  ([T, PromiseFn, DefaultParams] | [T, PromiseFn])[]
>

/**
 * 多个请求函数切换
 * @param active 切换的值
 * @param switchFnList 切换的函数列表,参数后加 as const, [active, fn][] | [active, fn, defaultParams][]
 * @returns
 * @example
 * ```ts
 * const request = useSwitchRequest(active, [
 *   [active1, fn1, state1],
 *   [active2, fn2, state2],
 * ])
 * ```
 */
export function useSwitchRequest<T, S extends SwitchFnList<T>>(
  active: Ref<T>,
  switchFnList: S
) {
  const requestList = switchFnList.map(([a, b, c]) => [
    a,
    useListRequest(b, c)
  ]) as [keyof T, ReturnType<typeof useListRequest>][]

  const request = computed(() => {
    const item = requestList.find(([a]) => a === active.value)!
    return item[1]
  })

  const loading = computed(() => request.value.loading.value)
  const data = computed(
    () => request.value.data.value as unknown as GetSwitchData<T, NoReadonly<S>>
  )

  const run = computed(
    () => request.value.run as unknown as GetSwitchRun<T, NoReadonly<S>>
  )

  const pagination = computed(() => request.value.pagination)

  // watch(active, () => {
  //   pagination.value.page = 1
  // })
  return { loading, data, run, pagination }
}
