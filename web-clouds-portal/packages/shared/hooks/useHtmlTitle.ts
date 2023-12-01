import microApp from '@micro-zoe/micro-app'
import { watchPostEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Logo from '../../shared/assets/icons/logo.svg'
import { mergeBaseURL } from '../utils'

export function useHtmlTitle(appStore: any) {
  const router = useRouter()
  const route = useRoute()

  const subTitles = ref<string[]>([])
  function dataListener(data: any) {
    if (data.subTitles) subTitles.value = data.subTitles || []
  }

  microApp.addGlobalDataListener(dataListener)

  watchPostEffect(() => {
    if (!appStore.baseConf || !route) return
    const routes = router.getRoutes()

    // 标题
    const appTitle = appStore.baseConf.client_name!
    localStorage.setItem('__title__', appTitle)
    const fatherRoute = routes.find(item =>
      item.children?.some(child => child.name === route.name)
    )
    const title = subTitles.value.length
      ? mergeTitle(appTitle, ...subTitles.value)
      : mergeTitle(
          appTitle,
          fatherRoute?.meta?.title as string,
          route.meta?.title as string
        )
    document.title = title
    // logo
    const client_logo = appStore.baseConf.client_logo
    const logoHref = client_logo ? mergeBaseURL(client_logo) : Logo
    const logoDom = document.querySelector('head link[rel="icon"]')!
    logoDom.setAttribute('href', logoHref)
  })
}

function mergeTitle(initialTitle: string, ...args: string[]) {
  const titles = [initialTitle, ...args].filter(Boolean)
  return titles.join(' - ')
}
