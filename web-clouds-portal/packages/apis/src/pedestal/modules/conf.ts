import { type CommonAPI, defHttp } from '..'

/**上传 */
export const uploadApi: CommonAPI<'/v1/upload', 'post'> = (data, config) =>
  defHttp.post('/v1/upload', {
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...config
  })

export const queryConfApi: CommonAPI<'/v1/conf', 'get'> = params =>
  defHttp.get('/v1/conf', { params })
