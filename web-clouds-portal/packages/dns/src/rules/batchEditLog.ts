import type { FieldRule } from '@arco-design/web-vue'

import { domainRules } from './domain'

export const useRules = () => {
  return computed(
    () =>
      ({
        domains: [...domainRules],
        conditions: [
          {
            required: true,
            validator(value, callback) {
              if (Array.isArray(value)) {
                const item = value.some(v => v.value)
                if (!item) {
                  return callback('请添加条件')
                }
              }
              return true
            }
          }
        ],
        expr: [
          {
            required: true,
            validator(value, callback) {
              if (!value.value) {
                const msg =
                  value.key === 'name' ? '请输入主机记录' : '请输入记录值'
                return callback(msg)
              }
              return true
            }
          }
        ]
      } as Record<string, FieldRule[]>)
  )
}
