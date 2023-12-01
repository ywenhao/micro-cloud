import { type CommonAPI, defHttp } from '..'

/**验证凭证 */
export const ssoTicketVerifyApi: CommonAPI<
  '/v1/sso/ticket/verify',
  'post'
> = data => defHttp.post('/v1/sso/ticket/verify', { data })

export const ssoLogoutApi: CommonAPI<'/v1/sso/logout', 'delete'> = () =>
  defHttp.delete('/v1/sso/logout')

/**用户登录记录 */
export const userLoginLogApi: CommonAPI<
  '/v1/user/login_records',
  'get'
> = params => defHttp.get('/v1/user/login_records', { params })

/**用户信息 */
export const userInfoApi: CommonAPI<'/v1/user', 'get'> = params =>
  defHttp.get('/v1/user', { params })

/**发送验证码 */
export const captchaSendApi: CommonAPI<'/v1/captcha', 'post'> = data =>
  defHttp.post('/v1/captcha', { data })

/**验证验证码 */
export const captchaValidateApi: CommonAPI<
  '/v1/captcha/verify',
  'post'
> = data =>
  defHttp.post(
    '/v1/captcha/verify',
    { data },
    {
      isTransformResponse: false
    }
  )

export const adminEditApi: CommonAPI<'/v1/user', 'put'> = data =>
  defHttp.put('/v1/user', { data })

/**更新账户密码 */
export const updatePasswordApi: CommonAPI<'/v1/user/password', 'put'> = data =>
  defHttp.put(
    'v1/user/password',
    { data },
    {
      isTransformResponse: false
    }
  )

/** 用户访问事件 */
export const postUserVisitEventApi: CommonAPI<
  '/v1/user/visit/event',
  'post'
> = data => defHttp.post(`/v1/user/visit/event`, { data })
