import type { CommonReturn } from '../../_utils'

export type AdminModel = CommonReturn<'/v1/admin', 'get'> & {
  password?: string
}

// export type AdminRecordModel = CommonReturnListItem<'/v1/admins', 'get'>

export type SignInApi = CommonReturn<'/v1/admin/login', 'post'>
