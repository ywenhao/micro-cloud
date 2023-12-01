import { type CommonAPI, defHttp } from '..'

/**获取消息 */
export const queryMessageApi: CommonAPI<'/v1/message', 'get'> = params =>
  defHttp.get('/v1/message', {
    params
  })

/**系统消息已读或删除*/
export const updateMessageSysApi: CommonAPI<'/v1/message', 'put'> = data =>
  defHttp.put('/v1/message', { data })

/**所有系统消息已读或删除*/
export const updateMessageSysAllApi: CommonAPI<
  '/v1/message/all',
  'put'
> = data => defHttp.put('/v1/message/all', { data })

/**获取系统消息 */
export const queryMessageSysInfoApi: CommonAPI<
  '/v1/message/info',
  'get'
> = params =>
  defHttp.get('/v1/message/info', {
    params
  })

/**获取系统消息类型 */
export const queryMessageSysTypeApi: CommonAPI<
  '/v1/message/type',
  'get'
> = params =>
  defHttp.get('/v1/message/type', {
    params
  })

/**获取系统消息汇总 */
export const queryMessageSummaryApi: CommonAPI<
  '/v1/message/summary',
  'get'
> = params =>
  defHttp.get('/v1/message/summary', {
    params
  })
