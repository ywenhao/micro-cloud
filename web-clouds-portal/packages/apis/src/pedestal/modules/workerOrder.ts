import { type CommonAPI, defHttp } from '..'

/**创建工单 */
export const addWorkerOrderApi: CommonAPI<'/v1/workerorder', 'post'> = data =>
  defHttp.post('/v1/workerorder', { data })

export const queryWorkerOrderApi: CommonAPI<
  '/v1/workerorder',
  'get'
> = params => defHttp.get('/v1/workerorder', { params })

/**工单类型 */
export const queryWorkerOrderTypeByIdApi: CommonAPI<
  '/v1/workerordertype/filter/list',
  'get'
> = params => defHttp.get('/v1/workerordertype/filter/list', { params })

/**工单list */
export const queryWorkerOrderListApi: CommonAPI<
  '/v1/workerorder/list',
  'get'
> = params => defHttp.get('/v1/workerorder/list', { params })

/**工单结算 */
export const updateWorkerOrderEndApi: CommonAPI<
  '/v1/workerorder/end',
  'post'
> = data => defHttp.post('/v1/workerorder/end', { data })

/**工单详情 */
export const queryWorkerOrderDetailApi: CommonAPI<
  '/v1/workerorder',
  'get'
> = params => defHttp.get('/v1/workerorder', { params })

/**发送工单消息 */
export const sendWorkerOrderMessageApi: CommonAPI<
  '/v1/workerorderdetails',
  'post'
> = data => defHttp.post('/v1/workerorderdetails', { data })

/**工单消息列表 */
export const queryWorkerOrderMessageListApi: CommonAPI<
  '/v1/workerorderdetails/list',
  'get'
> = params => defHttp.get('/v1/workerorderdetails/list', { params })

/**工单消息已读 */
export const readWorkerOrderMessageApi: CommonAPI<
  '/v1/workerorderdetails/read',
  'post'
> = data => defHttp.post('/v1/workerorderdetails/read', { data })

/**工单消息未读总数 */
export const queryWorkerOrderMessageUnreadCountApi: CommonAPI<
  '/v1/workerorderdetails/unread/count',
  'get'
> = params => defHttp.get('/v1/workerorderdetails/unread/count', { params })

/**工单产品列表 */
export const queryWorkerProductListApi: CommonAPI<
  '/v1/workerordertype/product/list',
  'get'
> = params => defHttp.get('/v1/workerordertype/product/list', { params })
