import { useConfigStore } from '@/stores/modules/config'
import {
  regexpMap,
  regExpValidateHandler,
  validateDomain,
  validateHandler,
  validateIpv4,
  validateURL,
  validateUrlPath
} from '@/utils/formValidators'

import type {
  IMatchConfig,
  MultipleOperatorType,
  OperatorOption
} from './types'

/**
 * 根据不同字段动态生成运算符
 * 因为现阶段的包含有 2层 含义，一个是 in，一个是 contains，不同字段的包含所用的符号不一致。
 * @param type
 * @returns
 */
export function generateOperatorOptions(type: MultipleOperatorType) {
  const arr: OperatorOption[] = [
    { label: '等于', value: 'eq', template: '$field eq $value' },
    { label: '不等于', value: 'ne', template: '$field ne $value' },
    {
      label: '包含',
      value: type,
      template: `$field ${type} $value`
    },
    {
      label: '不包含',
      value: type === 'in' ? 'not_in' : 'not_contains',
      template: `not $field ${type} $value`
    }
  ]
  return arr
}

export const matchConfig: IMatchConfig[] = [
  {
    label: '国家/地区',
    value: 'ip.geoip.country',
    operatorOptions: generateOperatorOptions('in'),
    field: {
      type: 'select',
      placeholder: '请选择',
      options: () => {
        const configStore = useConfigStore()
        return Promise.resolve(configStore.config.countryList)
      }
    }
  },
  {
    label: '州',
    value: 'ip.geoip.continent',
    operatorOptions: generateOperatorOptions('in'),
    field: {
      type: 'select',
      placeholder: '请选择',
      options: () => {
        const configStore = useConfigStore()
        return Promise.resolve(configStore.config.continentList)
      }
    }
  },
  {
    label: '域名',
    value: 'http.host',
    operatorOptions: generateOperatorOptions('contains'),
    field: {
      type: 'input',
      placeholder: 'example.com',
      validator: validateDomain
    }
  },
  {
    label: '源IP地址',
    value: 'ip.src',
    operatorOptions: generateOperatorOptions('in'),
    field: {
      type: 'input',
      placeholder: '192.168.12.12',
      validator: validateIpv4
    }
  },
  {
    label: 'Referer',
    value: 'http.referer',
    operatorOptions: generateOperatorOptions('contains'),
    field: {
      type: 'input',
      placeholder: 'example.com',
      validator: (value, callback) => {
        const validators = [regexpMap.domain, regexpMap.ipv4]
        const errFlag = validators.every(regexp =>
          regExpValidateHandler(value as string, regexp, 'error')
        )
        errFlag ? callback('Referer格式错误') : callback()
      }
    }
  },
  {
    label: '请求方法',
    value: 'http.request.method',
    operatorOptions: generateOperatorOptions('in'),
    field: {
      type: 'select',
      placeholder: '请选择',
      options: () => {
        const configStore = useConfigStore()
        return Promise.resolve(configStore.config.supportMethod)
      }
    }
  },
  {
    label: 'SSL/HTTPS',
    value: 'ssl',
    operatorOptions: generateOperatorOptions('in'),
    field: { type: 'switch', valueType: 'boolean' }
  },
  {
    label: 'URL完整',
    value: 'http.request.full_uri',
    operatorOptions: generateOperatorOptions('contains'),
    field: {
      type: 'input',
      placeholder: 'https://example.com/contact?page=1234',
      validator: validateURL
    }
  },
  {
    label: 'URL',
    value: 'http.request.uri',
    operatorOptions: generateOperatorOptions('contains'),
    field: {
      type: 'input',
      placeholder: '/content?page=1234',
      validator(value, callback) {
        if (value.toString().length > 2048) {
          callback('长度不可超过2048位字符')
          return
        }
        const reg = /^\/([a-zA-Z0-9\u4e00-\u9fa5\-_.%#]+\/?)+(\?[\w&_=%-]*)?$/
        if (!reg.test(value.toString())) {
          callback('必须以/开头，可携带参数')
          return
        }
        callback()
      }
    }
  },
  {
    label: 'URL路径',
    value: 'http.request.uri.path',
    operatorOptions: generateOperatorOptions('contains'),
    field: {
      type: 'input',
      placeholder: '/content',
      validator: validateUrlPath
    }
  },
  {
    label: 'URL查询字符串',
    value: 'http.request.uri.query',
    operatorOptions: generateOperatorOptions('contains'),
    field: {
      type: 'input',
      placeholder: '?page=1234',
      validator(value, callback) {
        if (!(value as string).startsWith('?')) {
          return callback('必须以?开头，可携带参数')
        }
        callback()
      }
    }
  },
  {
    label: 'HTTP版本',
    value: 'http.request.version',
    operatorOptions: generateOperatorOptions('in'),
    field: {
      type: 'select',
      placeholder: '请选择',
      options: () => {
        const configStore = useConfigStore()
        return Promise.resolve(configStore.config.supportHttpVersion)
      }
    }
  },
  {
    label: 'User-Agent',
    value: 'http.user_agent',
    operatorOptions: generateOperatorOptions('contains'),
    field: {
      type: 'input',
      placeholder: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6)...',
      validator(value, callback) {
        if (!value) {
          return
        }
        if (value.toString().length > 255) {
          callback('长度最大255个字符')
          return
        }
        callback()
      }
    }
  },
  {
    label: 'X-Forwarded-For',
    value: 'http.x_forwarded_for',
    operatorOptions: generateOperatorOptions('contains'),
    field: {
      type: 'input',
      valueType: 'array',
      placeholder: '192.0.2.0',
      validator(value, callback) {
        const arr = (value as string).split(',')
        callback(
          validateHandler(arr, data => {
            return regExpValidateHandler(data, regexpMap.ipv4, 'IP地址格式错误')
          })
        )
      }
    }
  }
]
