import microApp from '@micro-zoe/micro-app'
import { useRoute, useRouter } from 'vue-router'

import Logo from '@/assets/svgs/logo.svg'

export function useHtmlTitle() {
  const router = useRouter()
  const route = useRoute()
  const appStore = useAppStore()

  const subTitles = ref<string[]>([])
  function dataListener(data: any) {
    if (data.subTitles) subTitles.value = data.subTitles || []
  }

  microApp.addGlobalDataListener(dataListener)

  watchPostEffect(() => {
    if (!appStore.baseConf) return
    const routes = router.getRoutes()

    // 标题
    const appTitle = `${appStore.baseConf.client_name || 'VCloud'} 管理系统`
    localStorage.setItem('__VCA_TITLE__', appTitle)
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
    const logoHref = appStore.baseConf.client_logo! || Logo
    const logoDom = document.querySelector('head link[rel="icon"]')!

    logoDom && logoDom.setAttribute('href', logoHref)
  })
}

function mergeTitle(initialTitle: string, ...args: string[]) {
  const titles = [initialTitle, ...args].filter(Boolean)
  return titles.join(' - ')
}
