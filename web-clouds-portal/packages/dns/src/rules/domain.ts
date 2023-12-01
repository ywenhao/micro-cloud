import type { FieldRule } from '@arco-design/web-vue'
import { getTrimValue } from 'vc-material/utils'

export const domainRules: FieldRule[] = [
  {
    validator(value, callback: ValidateCallback) {
      const items = value ? getTrimValue(value) : []
      if (!items.length) {
        return callback('请添加域名')
      }
      if (items.length > 1000) {
        return callback('最多添加1000条')
      }

      return true
    }
  }
]
