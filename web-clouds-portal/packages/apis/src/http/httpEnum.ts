/**业务code */
export const WorkCode = 12156

const getCode = (code: number) => +`${WorkCode}${code}`

/**
 * @description: 请求结果集
 */
export enum ResultEnum {
  SUCCESS = getCode(200),
  ERROR = getCode(400),
  /**当前用户没有登录或者登录已失效，请重新登录 */
  UNAUTHORIZED = getCode(401),
  CERTNOEXIST = getCode(507),
  ErrUsernameExisted = getCode(701), // "该用户名已存在")
  ErrAccountNotExist = getCode(702), // "该账号不存在")
  ErrAccountDisabled = getCode(703), // "该账号已被禁用")
  ErrPasswordWrong = getCode(704), // "账号或密码不正确，请重新输入")
  ErrPasswordLock = getCode(705), // "密码错误次数达到上限，请24小时后重试")
  ErrOldPasswordWrong = getCode(706), // "原密码不正确，请重新输入")
  ErrPasswordSame = getCode(707), // "新密码不能与原密码相同")
  ErrPasswordWrongFour = getCode(708), // "密码已错误4次，再错误2次账号将被限制登录24小时")
  ErrPasswordWrongFive = getCode(709), // "密码已错误5次，再错误1次账号将被限制登录24小时")
  ErrEmailExisted = getCode(710), // "该邮箱已存在")
  ErrEmailInvalid = getCode(711), // "邮箱格式错误")
  ErrUsernameInvalid = getCode(712), // "用户名为4-18个字符，可包含英文字母、数字、下划线，不能为纯数字")
  ErrUsernameUsed = getCode(713), // "该用户名已被注册，请重新输入")
  ErrEmailUsed = getCode(714), // "该邮箱已被注册，请重新输入")
  ErrEmailBound = getCode(715), // "账号已绑定邮箱")
  ErrNotBindEmail = getCode(716), // "账号未绑定邮箱")
  ErrCaptchaFrequently = getCode(717), // "验证码请求频繁，请稍后重试")
  ErrVerificationCode = getCode(718), // "验证码输入错误，请重新输入")
  ErrCaptchaExpired = getCode(719), // "验证码错误或已失效，请重新输入")
  ErrUserNotExist = getCode(720), // "该用户不存在")
  ErrNotSupportEmailRegister = getCode(721), // "暂不支持邮箱注册")
  ErrNotSupportUsernameRegister = getCode(722), // "暂不支持用户名注册")
  ErrEmailCaptchaLimit = getCode(723), // "验证码发送次数超过限制，请24小时后再试")
  ErrUserApiStatusInvalid = getCode(724), // "暂不支持对外接口")
  ErrApikeyNotExist = getCode(725), // "apikey不存在")
  ErrorImageMax = getCode(726), // "图片不能大于2M")
  ErrorImageFormat = getCode(727), // "目前只支持jpeg,gif,jpg,png等格式图片")
  ErrOpenapiAddrUnset = getCode(728), // "启用失败，请先配置API接口域名")
  ErrDomainUnList = getCode(909), //域名未添加值dns服务器
  ErrNsStatus = getCode(917) //ns状态异常
}

// http://wiki.test.com/pages/viewpage.action?pageId=20515120
export const accountErrorMap = [
  getCode(601),
  // getCode(602),
  getCode(603)
]

export const passwordErrorMap = [
  getCode(604),
  getCode(605),
  getCode(608),
  getCode(609)
]

/**
 * @description: 请求方式
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

/**
 * @description:  headers contentType
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8'
}
