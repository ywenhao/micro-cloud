import type { CommonReturn, CommonReturnListItem } from '../../_utils'

export type RegionModel = CommonReturn<'/v1/message/info', 'get'>

export type UserDomainModel = CommonReturn<'/v1/sys_conf/user_domain', 'get'>

export type RegionTypeModel = CommonReturnListItem<'/v1/regions', 'get'>
