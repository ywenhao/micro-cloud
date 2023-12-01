import type { FieldRule, FormInstance } from '@arco-design/web-vue'
import { ipv4Reg } from 'vc-material'
import { domainReg, domainSplitReg } from 'vc-material'

export default function useForm() {
  /**
   * 表单 ref
   */
  const formRef = ref<FormInstance>()

  /**
   * 表单数据
   */
  const formState = reactive({
    addr: '',
    ip: '',
    remark: '',
    assign_status: 1
  })

  /**
   * 表单验证规则
   */
  const formRules = reactive<Record<string, FieldRule[]>>({
    addr: [
      { required: true, message: '请输入DNS服务器地址' },
      {
        validator: (value: string, callback) => {
          if (value.length > 253) {
            return callback('DNS服务器地址无效')
            // return callback('域名总长度不能超过253个字符')
          }
          if (value.includes('.')) {
            const split = value.split('.').filter(item => item) as string[]

            for (const item of split) {
              if (!domainSplitReg.test(item)) {
                return callback('DNS服务器地址无效')
                // return callback(
                //   '每一级域名为字母、数字、“-”、“_”的组合且长度不能超过63字符'
                // )
              }
            }
          }

          if (!domainReg.test(value)) {
            return callback('DNS服务器地址无效')
          }
          return true
        }
      }
    ],
    ip: [
      { required: true, message: '请输入IP地址' },
      {
        validator: (value: string, callback) => {
          if (!ipv4Reg.test(value)) {
            return callback('IP地址无效')
          }
          return true
        }
      }
    ]
  })

  return {
    formRef,
    formState,
    formRules
  }
}
