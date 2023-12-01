import { defHttp } from '../../http'
import type { CommonAPI } from '..'
/**
 * @description: 用户分组管理
 */

/** 获取单个分组信息 */
export const getUserGroupDetailApi: CommonAPI<
  '/v1/user/group',
  'get'
> = params => defHttp.get(`/v1/user/group`, { params })

/** 删除单个分组 */
export const deleteUserGroupApi: CommonAPI<'/v1/user/group', 'delete'> = data =>
  defHttp.delete(`/v1/user/group`, { data })

/** 创建分组 */
export const addUserGroupApi: CommonAPI<'/v1/user/group', 'post'> = data =>
  defHttp.post(`/v1/user/group`, { data })

/** 更新单个分组信息 */
export const updateUserGroupApi: CommonAPI<'/v1/user/group', 'put'> = data =>
  defHttp.put(`/v1/user/group`, { data })

/** 获取最大排序序号 */
export const getUserGroupMaxSortNumberApi: CommonAPI<
  '/v1/user/group/max_sort_number',
  'get'
> = params => defHttp.get(`/v1/user/group/max_sort_number`, { params })

/** 获取分组列表 */
export const getUserGroupsListApi: CommonAPI<
  '/v1/user/groups',
  'get'
> = params => defHttp.get(`/v1/user/groups`, { params })
