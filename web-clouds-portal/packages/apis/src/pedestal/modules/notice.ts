import { type CommonAPI, defHttp } from '..'

/**获取公告 */
export const queryAnnouncementListApi: CommonAPI<
  '/v1/announcement',
  'get'
> = params =>
  defHttp.get('/v1/announcement', {
    params
  })

/**公告弹窗 */
export const queryAnnouncementAlertApi: CommonAPI<
  '/v1/announcement/alert',
  'get'
> = params =>
  defHttp.get('/v1/announcement/alert', {
    params
  })

/**公告详情 */
export const queryAnnouncementInfoApi: CommonAPI<
  '/v1/announcement/info',
  'get'
> = params =>
  defHttp.get('/v1/announcement/info', {
    params
  })

/**公告详情 */
export const updateAnnouncementUserApi: CommonAPI<
  '/v1/UpsertAnnouncementUser',
  'put'
> = data =>
  defHttp.put('/v1/UpsertAnnouncementUser', {
    data
  })
