import type { FieldRule } from '@arco-design/web-vue'
import { hostValidate, logValueValidate } from 'vc-material'

export function useLogDialogRules(formState: Record<string, any>) {
  return computed<Record<string, FieldRule[]>>(() => ({
    name: [
      ...(formState.type === 'NS'
        ? [{ required: true, message: '请输入主机记录' }]
        : []),
      {
        validator: hostValidate()
      }
    ],
    value: [
      { required: true, message: '请输入记录值' },
      {
        // 服务器IP、CDN域名、邮件服务域名
        validator: logValueValidate(() => formState.type!)
      }
    ],
    ttl: [{ required: true, message: '请选择TTL' }]
  }))
}
