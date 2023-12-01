import { defHttp } from '../../http'
import type { CommonAPI } from '..'

/** 工单列表 */
export const workerOrderListApi: CommonAPI<
  '/v1/workerorder/list',
  'get'
> = params => defHttp.get('/v1/workerorder/list', { params })

/** 工单结单 */
export const updateWorkerOrderEndApi: CommonAPI<
  '/v1/workerorder/end',
  'post'
> = data => defHttp.post('/v1/workerorder/end', { data })

/** 工单详情 */
export const queryWorkerOrderDetailApi: CommonAPI<
  '/v1/workerorder',
  'get'
> = params =>
  defHttp.get('/v1/workerorder', { params }, { joinParamsToUrl: true })

// -------------

/** 发送工单消息 */
export const sendWorkerOrderMessageApi: CommonAPI<
  '/v1/workerorderdetails',
  'post'
> = data => defHttp.post('/v1/workerorderdetails', { data })

/** 工单消息已读 */
export const readWorkerOrderMessageApi: CommonAPI<
  '/v1/workerorderdetails/read',
  'post'
> = data => defHttp.post('/v1/workerorderdetails/read', { data })

/** 工单消息列表 */
export const queryWorkerOrderMessageListApi: CommonAPI<
  '/v1/workerorderdetails/list',
  'get'
> = params => defHttp.get('/v1/workerorderdetails/list', { params })

// -------------

/** 删除工单类型 */
export const delWorkerOrderTypeApi: CommonAPI<
  '/v1/workerordertype',
  'delete'
> = data =>
  defHttp.delete('/v1/workerordertype', { data }, { joinParamsToUrl: true })

/** 添加工单类型 */
export const addWorkerOrderTypeApi: CommonAPI<
  '/v1/workerordertype',
  'post'
> = data => defHttp.post('/v1/workerordertype', { data })

/** 修改工单类型 */
export const updateWorkerOrderTypeApi: CommonAPI<
  '/v1/workerordertype',
  'put'
> = data => defHttp.put('/v1/workerordertype', { data })

/** 工单类型列表 */
export const workerOrderTypeListApi: CommonAPI<
  '/v1/workerordertype/list',
  'get'
> = params => defHttp.get('/v1/workerordertype/list', { params })

/** 工单 产品列表 */
export const workerOrderProductListApi: CommonAPI<
  '/v1/workerordertype/product/list',
  'get'
> = params => defHttp.get('/v1/workerordertype/product/list', { params })

/** 根据产品Id获取工单类型 */
export const workerOrderTypeFilterApi: CommonAPI<
  '/v1/workerordertype/filter/list',
  'get'
> = params =>
  defHttp.get(
    '/v1/workerordertype/filter/list',
    { params },
    { joinParamsToUrl: true }
  )

/** 未读工单消息总数 */
export const workerOrderUnreadCountApi: CommonAPI<
  '/v1/workerorderdetails/unread/count',
  'get'
> = params => defHttp.get('/v1/workerorderdetails/unread/count', { params })
