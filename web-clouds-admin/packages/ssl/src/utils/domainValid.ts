import { parse } from 'tldts'
import { domainReg } from 'vc-material'

export const domainValid = (value: string | undefined): string | undefined => {
  if (!value) return '请输入域名'
  if (value.startsWith('*.')) {
    // 对于泛域名,先截取星号部分，再验证域名格式
    const domain = value.substring(2)
    if (!domainReg.test(domain)) {
      return '域名格式不正确'
    }
    const domainTldts = parse(domain)
    if (domainTldts.publicSuffix) {
      // 计算域名级数
      const index = value.lastIndexOf(domainTldts.publicSuffix)
      const length = value.substring(0, index).split('.').length
      if (length < 3 || length > 4) {
        return '域名格式不正确'
      }
    }
  } else if (!domainReg.test(value)) {
    return '域名格式不正确'
  }
  return undefined
}
