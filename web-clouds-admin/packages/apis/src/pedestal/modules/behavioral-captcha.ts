import { defHttp } from '../../http'
import type { CommonParams, CommonReturn, Result } from '..'

/**
 * @description: 行为验证码
 */

/** 生成行为验证码 */
export const getBehavioralCaptchaApi = (
  params: CommonParams<'/v1/behavioral_captcha', 'get'>
) =>
  defHttp.get(
    `/v1/behavioral_captcha`,
    { params },
    { isTransformResponse: false }
  ) as Promise<Result<CommonReturn<'/v1/behavioral_captcha', 'get'>>>

/** 验证行为验证码 */
export const postBehavioralCaptchaVerifyApi = (
  data: CommonParams<'/v1/behavioral_captcha/verify', 'post'>
) =>
  defHttp.post(
    `/v1/behavioral_captcha/verify`,
    { data },
    { isTransformResponse: false }
  ) as Promise<Result<CommonReturn<'/v1/behavioral_captcha/verify', 'post'>>>
