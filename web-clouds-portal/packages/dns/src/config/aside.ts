import { getAsideIcon } from '@vcp/shared'
import { type Aside } from '@vcp/shared'

export type AsideKeys = 'dns'

const dnsAsideList: Aside<AsideKeys> = {
  title: '云解析 DNS',
  key: 'dns',
  menus: [
    {
      name: 'DomainResolve',
      title: '域名解析',
      icon: getAsideIcon('domain-resolve', 'dns')
    },
    {
      name: 'DomainGroup',
      title: '域名分组',
      icon: getAsideIcon('domain-group', 'dns')
    }
  ]
}

export const asideList = [dnsAsideList]
