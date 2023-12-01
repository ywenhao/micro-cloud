import { type Aside } from '@vcp/shared'
import { VcSvgIcon } from 'vc-material'

export type AsideKeys = 'ssl'
const sslAsideList: Aside<AsideKeys> = {
  title: 'SSL 证书',
  key: 'ssl',
  menus: [
    {
      name: 'Apply',
      title: '申请列表',
      icon: [
        <VcSvgIcon prefix="ssl" name="side_apply"></VcSvgIcon>,
        <VcSvgIcon prefix="ssl" name="side_apply_active"></VcSvgIcon>
      ],
      children: []
    },
    {
      name: 'License',
      title: '我的证书',
      icon: [
        <VcSvgIcon prefix="ssl" name="side_license"></VcSvgIcon>,
        <VcSvgIcon prefix="ssl" name="side_license_active"></VcSvgIcon>
      ]
    }
  ]
}

export const asideList = [sslAsideList]
