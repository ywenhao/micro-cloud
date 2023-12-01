import type { VcAppMenuRaw } from 'vc-material'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

import type { Aside } from './aside'

export function useSubTitle(
  mainMenus: Aside<string>[],
  route: RouteLocationNormalizedLoaded
) {
  // 设置标题
  watchEffect(() => {
    if (!route.name) return
    const isMainPage =
      !route.meta.currentActive ||
      (!!route.name && route.meta.currentActive === route.name)

    const symbol = getAppName()
    const item = mainMenus.find(v => v.key === symbol)!
    if (!item) {
      console.error(`路由 ${String(route.name)} 未正确配置 menus key`)
      return
    }
    const appTitle = item.title
    const menus = item.menus
    let titles: string[] = []

    if (['NotFound'].includes(route.name as string)) {
      titles = [appTitle]
    } else if (isMainPage) {
      titles = getTitlesByMain(appTitle, route, menus)
    } else {
      const mainTitle =
        menus.find(v => v.name === route.meta.currentActive)?.title || ''
      const subTitle = route.meta.title as string
      if (!subTitle) {
        console.error(`路由 ${String(route.name)} 未配置 meta.title`)
      }
      titles = [appTitle, mainTitle, subTitle]
    }
    // @ts-ignore
    window.microApp && window.microApp.setGlobalData({ subTitles: titles })
  })
}

function getTitlesByMain(
  appTitle: string,
  route: RouteLocationNormalizedLoaded,
  menus: VcAppMenuRaw[]
) {
  const root = menus.find(v => v.name === route.name)
  if (root) {
    const mainTitle = root.title
    return [appTitle, mainTitle]
  }

  const main = menus.find(v =>
    (v.children || []).some(n => n.name === route.name)
  )
  if (!main) {
    console.error(
      `路由 ${String(route.name)} 未正确配置 'menus' 或者 'meta.currentActive'`
    )
    return [appTitle]
  } else {
    const sub = main.children!.find(v => v.name === route.name)
    return [appTitle, main.title, sub!.title]
  }
}
