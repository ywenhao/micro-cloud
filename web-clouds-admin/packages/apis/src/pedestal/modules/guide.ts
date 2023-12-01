import qs from 'qs'

import { defHttp } from '../../http'
import type { CommonAPI } from '..'

export const guideListApi: CommonAPI<'/v1/guide', 'get'> = params =>
  defHttp.get('/v1/guide', { params })

export const guideAddApi: CommonAPI<'/v1/guide', 'post'> = data =>
  defHttp.post('/v1/guide', { data })

export const guideDeleteApi: CommonAPI<'/v1/guide', 'delete'> = params =>
  defHttp.delete(
    '/v1/guide?',
    { params: qs.stringify(params, { arrayFormat: 'repeat' }) },
    { joinTime: false }
  )

export const guideUpdateIndexApi: CommonAPI<'/v1/guide/index', 'put'> = data =>
  defHttp.put('/v1/guide/index', { data })
