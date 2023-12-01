import type { VcAppMenuRaw } from 'vc-material'
import { VcSvgIcon } from 'vc-material'
import { h } from 'vue'

export type Aside<T> = {
  title: string
  key: T
  menus: VcAppMenuRaw[]
}

export const getAsideIcon = (icon?: string, prefix?: string) =>
  icon
    ? ([
        h(VcSvgIcon, { name: icon, prefix }),
        h(VcSvgIcon, { name: `${icon}_active`, prefix })
      ] as [JSX.Element, JSX.Element])
    : undefined
