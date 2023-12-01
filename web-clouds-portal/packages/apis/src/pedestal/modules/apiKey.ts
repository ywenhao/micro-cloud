import { type CommonAPI, defHttp } from '..'

/**apiKey list */
export const apiKeyListApi: CommonAPI<'/v1/apikeys', 'get'> = params =>
  defHttp.get('/v1/apikeys', { params })

export const apiKeyAddApi: CommonAPI<'/v1/apikey', 'post'> = data =>
  defHttp.post('/v1/apikey', { data })

export const apiKeyEditApi: CommonAPI<'/v1/apikey', 'put'> = data =>
  defHttp.get('/v1/apikey', { data })
