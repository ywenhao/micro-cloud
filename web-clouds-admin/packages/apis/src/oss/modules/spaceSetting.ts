import { defHttp } from '../../http'
import type { CommonAPI } from '..'

/**生命周期设置列表 */
export const lifeCycleApi: CommonAPI<'/v1/buckets/lifecycle', 'get'> = params =>
  defHttp.get('/v1/buckets/lifecycle', { params })

/**新增或更新、删除生命周期 */
export const editCycleApi: CommonAPI<'/v1/buckets/lifecycle', 'put'> = data =>
  defHttp.put('/v1/buckets/lifecycle', { data })

/**事件通知规则 */
export const eventListApi: CommonAPI<
  '/v1/buckets/notification',
  'get'
> = params => defHttp.get('/v1/buckets/notification', { params })

/**新增事件通知规则 */
export const addEventApi: CommonAPI<
  '/v1/buckets/notification',
  'post'
> = data => defHttp.post('/v1/buckets/notification', { data })

/**修改事件通知规则 */
export const editEventApi: CommonAPI<
  '/v1/buckets/notification',
  'put'
> = data => defHttp.put('/v1/buckets/notification', { data })

/**删除事件通知规则 */
export const delEventApi: CommonAPI<
  '/v1/buckets/notification',
  'delete'
> = data =>
  defHttp.delete(
    '/v1/buckets/notification',
    { data },
    { joinParamsToUrl: true }
  )

/**跨域通知规则 */
export const corsListApi: CommonAPI<'/v1/buckets/cors', 'get'> = params =>
  defHttp.get('/v1/buckets/cors', { params })

/**修改、添加、删除跨域通知规则 */
export const editCorsApi: CommonAPI<'/v1/buckets/cors', 'put'> = data =>
  defHttp.put('/v1/buckets/cors', { data })

/**清空全部跨域设置规则 */
export const cleanCorsApi: CommonAPI<'/v1/buckets/cors', 'delete'> = data =>
  defHttp.delete('/v1/buckets/cors', { data }, { joinParamsToUrl: true })

/**修改访问权限 */
export const updateAcl: CommonAPI<'/v1/buckets/acl', 'put'> = data =>
  defHttp.put('/v1/buckets/acl', { data })

/** 获取referer */
export const refererListApi: CommonAPI<'/v1/buckets/referer', 'get'> = params =>
  defHttp.get('/v1/buckets/referer', { params })

/** 修改referer */
export const editReferApi: CommonAPI<'/v1/buckets/referer', 'put'> = data =>
  defHttp.put('/v1/buckets/referer', { data })

/** 修改空间备注 */
export const updateSpaceRemarkApi: CommonAPI<
  '/v1/buckets/remark',
  'put'
> = data => defHttp.put('/v1/buckets/remark', { data })

/**删除空间 */
export const delSpaceApi: CommonAPI<'/v1/buckets', 'delete'> = data =>
  defHttp.delete('/v1/buckets', { data }, { joinParamsToUrl: true })

/** 获取标签 */
export const tagListApi: CommonAPI<'/v1/buckets/tag', 'get'> = params =>
  defHttp.get('/v1/buckets/tag', { params })

/**添加标签 */
export const addTagApi: CommonAPI<'/v1/buckets/tag', 'post'> = data =>
  defHttp.post('/v1/buckets/tag', { data })

/**修改标签 */
export const updateTagApi: CommonAPI<'/v1/buckets/tag', 'put'> = data =>
  defHttp.put('/v1/buckets/tag', { data })

/**删除标签 */
export const delTagApi: CommonAPI<'/v1/buckets/tag', 'delete'> = data =>
  defHttp.delete('/v1/buckets/tag', { data }, { joinParamsToUrl: true })

/** 修改maxage */
export const updateSpaceMaxAgeApi: CommonAPI<
  '/v1/buckets/max_age',
  'put'
> = data => defHttp.put('/v1/buckets/max_age', { data })
