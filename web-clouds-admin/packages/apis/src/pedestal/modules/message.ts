import { defHttp } from '../../http'
import type { CommonAPI } from '..'

/** 查询消息 */
export const messageListApi: CommonAPI<'/v1/message', 'get'> = params =>
  defHttp.get('/v1/message', { params })

/** 删除消息 */
export const messageDelApi: CommonAPI<'/v1/message', 'delete'> = params =>
  defHttp.delete('/v1/message', { params }, { joinParamsToUrl: true })

/** 创建消息 */
export const messageCreateApi: CommonAPI<'/v1/message', 'post'> = data =>
  defHttp.post('/v1/message', { data })

/** 修改消息 */
export const messageUpdateApi: CommonAPI<'/v1/message', 'put'> = params =>
  defHttp.put('/v1/message', { params })

/** 消息详情 */
export const messageInfoApi: CommonAPI<'/v1/message/info', 'get'> = params =>
  defHttp.get('/v1/message/info', { params }, { joinParamsToUrl: true })

/** 消息类型 */
export const messageTypesApi: CommonAPI<'/v1/message/type', 'get'> = params =>
  defHttp.get('/v1/message/type', { params })

/** 删除消息类型 */
export const messageTypeDelApi: CommonAPI<
  '/v1/message/type',
  'delete'
> = params =>
  defHttp.delete('/v1/message/type', { params }, { joinParamsToUrl: true })

/** 创建消息类型 */
export const messageTypeCreateApi: CommonAPI<
  '/v1/message/type',
  'post'
> = data => defHttp.post('/v1/message/type', { data })

/** 修改消息类型 */
export const messageTypeUpdateApi: CommonAPI<
  '/v1/message/type',
  'put'
> = params => defHttp.put('/v1/message/type', { params })

/** 批量操作系统消息类型 */
export const messageTypeBachApi: CommonAPI<
  '/v1/message/type/bach',
  'put'
> = data => defHttp.put('/v1/message/type/bach', { data })
