import { defHttp } from '../../http'
import type { CommonAPI } from '..'

/** 查询公告 */
export const announcementListApi: CommonAPI<
  '/v1/announcement',
  'get'
> = params => defHttp.get('/v1/announcement', { params })

/** 删除公告 */
export const announcementDelApi: CommonAPI<
  '/v1/announcement',
  'delete'
> = params =>
  defHttp.delete('/v1/announcement', { params }, { joinParamsToUrl: true })

/** 创建公告 */
export const announcementCreateApi: CommonAPI<
  '/v1/announcement',
  'post'
> = data => defHttp.post('/v1/announcement', { data })

/** 修改公告 */
export const announcementUpdateApi: CommonAPI<
  '/v1/announcement',
  'put'
> = data => defHttp.put('/v1/announcement', { data })

/** 公告详情 */
export const announcementInfoApi: CommonAPI<
  '/v1/announcement',
  'get'
> = params =>
  defHttp.get('/v1/announcement', { params }, { joinParamsToUrl: true })
