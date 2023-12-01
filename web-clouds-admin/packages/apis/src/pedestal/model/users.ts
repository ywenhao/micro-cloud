import type { CommonReturn, CommonReturnListItem } from '../../_utils'

export type UserModel = CommonReturnListItem<'/v1/users', 'get'> & {}
export type UserInfo = CommonReturn<'/v1/user', 'get'> & {}
export type UserProduct = CommonReturn<'/v1/user/product', 'get'> & {}

// export type userRecordModel = CommonReturnListItem<'/v1/admins', 'get'>
