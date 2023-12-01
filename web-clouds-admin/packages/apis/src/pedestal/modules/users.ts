import { defHttp } from '../../http'
import type { CommonAPI } from '..'
/**
 * @description: 用户管理
 */

/** 获取用户信息 */
export const getUserDetailApi: CommonAPI<'/v1/user', 'get'> = params =>
  defHttp.get(`/v1/user`, { params })

/** 添加用户 */
export const addUserApi: CommonAPI<'/v1/user', 'post'> = data =>
  defHttp.post(`/v1/user`, { data })

/** 更新用户 */
export const updateUserApi: CommonAPI<'/v1/user', 'put'> = data =>
  defHttp.put(`/v1/user`, { data })

/** 查询用户登录记录 */
export const getUserLoginRecordsApi: CommonAPI<
  '/v1/user/login_records',
  'get'
> = params => defHttp.get(`/v1/user/login_records`, { params })

/** 重置用户密码 */
export const updateUserPasswordResetApi: CommonAPI<
  '/v1/user/password/reset',
  'put'
> = data => defHttp.put(`/v1/user/password/reset`, { data })

/** 获取用户产品信息 */
export const getUserProductDetailApi: CommonAPI<
  '/v1/user/product',
  'get'
> = params => defHttp.get(`/v1/user/product`, { params })

/** 获取用户列表 */
export const getUsersListApi: CommonAPI<'/v1/users', 'get'> = params =>
  defHttp.get(`/v1/users`, { params })

/** 更新多个用户分组 */
export const updateUsersGroupApi: CommonAPI<'/v1/users/group', 'put'> = data =>
  defHttp.put(`/v1/users/group`, { data })
