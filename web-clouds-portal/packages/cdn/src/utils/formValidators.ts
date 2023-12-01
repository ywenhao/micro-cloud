export type FormValidator = (
  value: number | string | string[] | number[],
  callback: (err?: string) => void
) => void

// 正则通用验证器
export const regExpValidateHandler = (
  value: string | number,
  reg: RegExp,
  errMsg: string
) => {
  if (!reg.test(value.toString())) {
    return errMsg
  }
  return undefined
}

export const validateHandler = <T = string | number | string[] | number[]>(
  value: T,
  handler: (data: string) => string | undefined
): string | undefined => {
  if (!Array.isArray(value)) {
    return handler((value as string | number).toString())
  }
  let errMsg: string | undefined
  value.find(item => {
    errMsg = handler(item)
    if (errMsg) {
      return true
    }
    return false
  })
  return errMsg
}

// 验证正则
export const regexpMap = {
  // ipv4地址
  ipv4: /^((1?[1-9]?\d|[1-2][0-4]\d|25[0-5])\.){3}(1?[1-9]?\d|[1-2][0-4]\d|25[0-5])$/,
  // ipv6地址
  ipv6: /(^(?:(?:(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$)|(^\[(?:(?:(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))\](?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$)/,
  // 域名
  domain:
    /^(?=^.{3,255}$)([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-z]{2,11}$/,
  // 域名（可校验端口号）
  domainAndPort:
    /^(?=^.{3,255})([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-z]{2,11}(:([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/,
  // url地址
  url: /^http(s)?:\/\/([\w-]+\.)+[\w-]+(:([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?(\/\S*)?$/,
  // 无协议url地址
  noProtocolUrl:
    /^([\w-]+\.)+[\w-]+(:([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?(\/\S*)?$/,
  // 无端口号url地址
  noPortUrl: /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/\S*)?$/,
  // 无协议无端口号url地址
  noProtocolAndPortUrl: /^([\w-]+\.)+[\w-]+(\/\S*)?$/
}

// 验证端口号
export const validateSitePort: FormValidator = (value, callback) => {
  callback(
    validateHandler(value, data => {
      const port = Number(data)
      if (isNaN(port)) {
        return '端口号格式错误'
      }
      if (port < 1 || port > 65535) {
        return '端口范围：1~65535'
      }
    })
  )
}

// 验证IPv4地址
export const validateIpv4: FormValidator = (value, callback) => {
  callback(
    validateHandler(value, data =>
      regExpValidateHandler(data, regexpMap.ipv4, 'IP地址格式错误')
    )
  )
}

// 验证IPv6地址
export const validateIpv6: FormValidator = (value, callback) => {
  callback(
    validateHandler(value, data =>
      regExpValidateHandler(data, regexpMap.ipv4, 'IP地址格式错误')
    )
  )
}

// 验证域名
export const validateDomain: FormValidator = (value, callback) => {
  callback(
    validateHandler(value, data =>
      regExpValidateHandler(data, regexpMap.domain, '域名格式错误')
    )
  )
}

// 验证域名，可携带端口号
export const validateDomainAndPort: FormValidator = (value, callback) => {
  callback(
    validateHandler(value, data =>
      regExpValidateHandler(
        data,
        regexpMap.domainAndPort,
        data.includes(':') ? '域名格式错误，端口范围为1~65535' : '域名格式错误'
      )
    )
  )
}

// 验证泛域名，包括正常域名
export const validatePanDomain: FormValidator = (
  value: number | string | string[] | number[],
  callback
) => {
  callback(
    validateHandler(value, data => {
      const error = '域名格式错误'
      if (data.startsWith('*.')) {
        data = data.substring(2, data.length - 1)
      }
      return regExpValidateHandler(data, regexpMap.domain, error)
    })
  )
}

// 验证账号
export const validateAccount: FormValidator = (value, callback) => {
  const reg = /^[0-9A-Za-z_@]{4,18}$/
  callback(
    validateHandler(value, data =>
      regExpValidateHandler(
        data,
        reg,
        '请输入4-18个字符，可包含英文字母、数字、下划线'
      )
    )
  )
}

// 验证密码
export const validatePassword: FormValidator = (value, callback) => {
  const reg = /^[0-9a-zA-Z_()`!@#$%^&*_\-+=|{}[\]:;'<>,.?]{6,64}$/
  callback(
    validateHandler(value, data =>
      regExpValidateHandler(
        data,
        reg,
        '请输入6-64个字符，可包含英文字母、数字和标点符号'
      )
    )
  )
}

// 验证 验证码
export const validateVerifyCode: FormValidator = (value, callback) => {
  const reg = /^\d{6}$/
  callback(
    validateHandler(value, data =>
      regExpValidateHandler(data, reg, '请输入6位数字验证码')
    )
  )
}

// 验证URL地址
export const validateURL: FormValidator = (value, callback) => {
  callback(
    validateHandler(value, data => {
      if (data.length > 2048) {
        return '长度不可超过2048位字符'
      }
      return regExpValidateHandler(
        data,
        regexpMap.url,
        '请输入格式正确并带有协议的URL'
      )
    })
  )
}

// 验证URL路径
export const validateUrlPath: FormValidator = (value, callback) => {
  callback(
    validateHandler(value, data => {
      if (data.length > 2048) {
        return '长度不可超过2048位字符'
      }
      if (!data.startsWith('/') || data.includes('?')) {
        return '路径配置必须以/开头，不支持携带参数'
      }
    })
  )
}

// 验证URL查询参数
export const validateUrlQueryString: FormValidator = (value, callback) => {
  const reg = /^(([a-zA-Z_][\w]*)+=\S*&?)+$/
  callback(
    validateHandler(value, data => {
      if (data.length > 2048) {
        return '长度不可超过2048位字符'
      }
      return regExpValidateHandler(data, reg, 'URL查询字符串格式错误')
    })
  )
}

// 验证标题
export const validateTitle: FormValidator = (value, callback) => {
  const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,30}$/
  callback(
    validateHandler(value, data => {
      if (data.length > 30) {
        return '标题长度为30位以内的字母，数字和汉字'
      }
      return regExpValidateHandler(
        data,
        reg,
        '标题为长度30位以内的汉字，字母和数字'
      )
    })
  )
}
