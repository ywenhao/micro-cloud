import {
  outDomainListApi,
  regionListApi,
  spaceDomainApi,
  spaceListApi
} from '@vca/apis/oss'

export interface SelectData {
  value: string | number
  label: string
  user_id?: string
  ip?: string
  id?: string
  is_default?: number
}

export const REGION_LIST_DATA = ref<SelectData[]>([])

export const GET_REGION_DATA_LIST = () => {
  REGION_LIST_DATA.value = [
    {
      value: '',
      label: '全部区域'
    }
  ]
  regionListApi({}).then(res => {
    const list_data = res?.list?.map(({ id, name, ip }) => ({
      label: name!,
      value: id!,
      ip: ip
    })) as SelectData[]

    REGION_LIST_DATA.value = REGION_LIST_DATA.value.concat(list_data)
  })
}

/**空间列表 */
// export const SPACE_LIST_DATA = ref<SelectData>()

export const GET_SPACE_LIST_DATA_LIST = async (data: any) => {
  const { list } = await spaceListApi({ ...data })
  const list_data = list?.map(({ id, name, user_id }) => ({
    label: name!,
    value: id!,
    user_id: user_id!
  })) as SelectData[]
  return list_data
}

/**可选的外链域名 */
export const OUT_LINK_DOMAIN = ref<SelectData[]>([])

export const GET_LINK_DOMAIN_LIST = () => {
  outDomainListApi({}).then(res => {
    OUT_LINK_DOMAIN.value = res?.list?.map(({ id, name }) => ({
      value: id!,
      label: name!
    })) as SelectData[]
  })
}

/**空间下的外链域名 */
export const SPACE_OUT_LINK_DOMAIN = ref<SelectData[]>([])

export const GET_SPACE_LINK_DOMAIN_LIST = (bucket_id: string) => {
  spaceDomainApi({ bucket_id, limit: 100 }).then(res => {
    SPACE_OUT_LINK_DOMAIN.value = (res?.list ?? []).map(
      //@ts-ignore
      ({ name, ssl_status, is_default, id }) => ({
        value: `${ssl_status === 1 ? 'http' : 'https'}://${name}`,
        label: name!,
        is_default,
        id
      })
    ) as SelectData[]
  })
}

/**事件下拉选择 */
export const EVENT_LIST_DATA = ref<SelectData[]>([
  { value: 'put', label: 'put(创建、覆盖文件：简单上传)' },
  { value: 'delete', label: 'delete(删除文件)' },
  { value: 'multipart', label: 'multipart(分片上传完成)' }
])

export const SSL_STATUS_LIST = ref<SelectData[]>([
  { value: 1, label: '未绑定' },
  { value: 2, label: '使用中' },
  { value: 3, label: '已到期' },
  { value: 4, label: '已吊销' },
  { value: 5, label: '已删除' },
  { value: 6, label: '已删除(未到期)' },
  { value: 7, label: '已删除(已到期)' }
])
