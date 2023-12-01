/** 单位常量 */
export const UNITS = {
  values: [1024 * 1024, 1024 * 1024 * 1024],
  labels: ['MB', 'GB']
}
/** 单位常量 */
export const COMPRESS_UNITS = {
  values: [1024, 1024 * 1024, 1024 * 1024 * 1024],
  labels: ['KB', 'MB', 'GB']
}
export const OPERATION = {
  0: '允许',
  1: '阻止'
}
export const OPERATION_LIST = [
  {
    value: -1,
    label: '全部执行策略'
  },
  {
    value: 0,
    label: '允许'
  },
  {
    value: 1,
    label: '阻止'
  }
]
export const OPERATION_LIST_NO_ALL = [
  {
    value: 1,
    label: '阻止'
  },
  {
    value: 0,
    label: '允许'
  }
]
export const FIELDS_LIST = [
  {
    value: 'ip.geoip.country',
    label: '国家/地区'
  },
  {
    value: 'ip.geoip.continent',
    label: '洲'
  },
  {
    value: 'http.host',
    label: '主机名（域名）'
  },
  {
    value: 'ip.src',
    label: 'IP源地址'
  },
  {
    value: 'http.referer',
    label: 'Referer'
  },
  {
    value: 'http.request.method',
    label: '请求方法'
  },
  {
    value: 'ssl',
    label: 'SSL/HTTPS'
  },
  {
    value: 'http.request.full_uri',
    label: 'URL完整'
  },
  {
    value: 'http.request.uri',
    label: 'URL'
  },
  {
    value: 'http.request.uri.path',
    label: 'URL路径'
  },
  {
    value: 'http.request.uri.query',
    label: 'URL查询字符串'
  },
  {
    value: 'http.request.version',
    label: 'HTTP版本'
  },
  {
    value: 'http.user_agent',
    label: 'User-Agent'
  },
  {
    value: 'http.x_forwarded_for',
    label: 'X-Forwarded-For'
  }
]
export const operatorListOne = [
  {
    value: '$(value) eq $(list)',
    label: '等于'
  },
  {
    value: '$(value) ne $(list)',
    label: '不等于'
  },
  {
    value: '$(value) in $(InList)',
    label: '包含'
  },
  {
    value: 'not $(value) in $(InList)',
    label: '不包含'
  }
]

export const operatorListTwo = [
  {
    value: '$(value) eq $(list)',
    label: '等于'
  },
  {
    value: '$(value) ne $(list)',
    label: '不等于'
  },
  {
    value: '$(value) contains $(containsList)',
    label: '包含'
  },
  {
    value: 'not $(value) contains $(containsList)',
    label: '不包含'
  }
  //   {
  //     value: '$(value) matches $(regular)',
  //     label: '与正则表达式匹配'
  //   },
  //   {
  //     value: 'not $(value) matches $(regular)',
  //     label: '与正则表达式不匹配'
  //   }
]
export const LEVEL: Record<number, any> = {
  0: '低',
  1: '中',
  2: '高'
}
