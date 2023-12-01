import type { VcAppMenuRaw } from 'vc-material'
import { type Ref, watchEffect } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export function useSubTitle(
  route: Ref<RouteLocationNormalizedLoaded>,
  menus: Ref<VcAppMenuRaw[]>,
  title: Ref<string>
) {
  // 设置标题
  watchEffect(() => {
    if (!route.value.name) return
    const isMainPage =
      !route.value.meta.currentActive ||
      (!!route.value.name &&
        route.value.meta.currentActive === route.value.name)
    const appTitle = title.value
    let titles: string[] = []

    if (['NotFound'].includes(route.value.name as string)) {
      titles = [appTitle]
    } else if (isMainPage) {
      titles = getTitlesByMain(appTitle, route, menus)
    } else {
      const mainTitle =
        menus.value.find(v => v.name === route.value.meta.currentActive)
          ?.title || ''

      const subTitle = route.value.meta.title as string
      if (!subTitle) {
        console.error(`路由 ${String(route.value.name)} 未配置 meta.title`)
      }
      titles = [appTitle, mainTitle, subTitle]
    }
    // @ts-ignore
    window.microApp && window.microApp.setGlobalData({ subTitles: titles })
  })
}

function getTitlesByMain(
  appTitle: string,
  route: Ref<RouteLocationNormalizedLoaded>,
  menus: Ref<VcAppMenuRaw[]>
) {
  const root = menus.value.find(v => v.name === route.value.name)
  if (root) {
    const mainTitle = root.title
    return [appTitle, mainTitle]
  }

  const main = menus.value.find(v =>
    (v.children || []).some(n => n.name === route.value.name)
  )
  if (!main) {
    console.error(
      `路由 ${String(
        route.value.name
      )} 未正确配置 'menus' 或者 'meta.currentActive'`
    )
    return [appTitle]
  } else {
    const sub = main.children!.find(v => v.name === route.value.name)
    return [appTitle, main.title, sub!.title]
  }
}
