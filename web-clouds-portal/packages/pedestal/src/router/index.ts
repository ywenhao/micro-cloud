import microApp from '@micro-zoe/micro-app'
import { VcModal } from 'vc-material'
import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized
} from 'vue-router'

import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // 始终滚动到顶部
    return { top: 0 }
  }
})

// oss 任务中心有未完成任务不跳转路由
router.beforeEach(async (to, from) => {
  // 没有登陆，不阻止跳转登陆页
  const appStore = useAppStore()
  if (!appStore.token && to.path !== '/sign-in') {
    return true
  }

  const getAppName = (route: RouteLocationNormalized) =>
    Array.isArray(route.params?.app) ? route.params.app[0] : route.params?.app

  const toAppName = getAppName(to)
  const fromAppName = getAppName(from)
  if (
    from.name === 'MicroView' &&
    fromAppName === 'oss' &&
    toAppName !== 'oss'
  ) {
    const childData = microApp.getData('oss') || {}
    const payload =
      childData.type === 'oss-task-center' && childData.payload
        ? childData.payload
        : {}
    const waitCount =
      (payload as { waitCount: Ref<number> })?.waitCount?.value || 0
    if (waitCount > 0) {
      const prom = new Promise<boolean>(resolve => {
        VcModal.error(
          {
            title: '离开云存储OSS？',
            content:
              '确认离开将终止您未完成的上传/删除等任务，并清空任务记录，是否确认离开',
            onCancel: () => resolve(false)
          },
          async () => resolve(true)
        )
      })
      const result = await prom
      return result
    }
  }
})
export default router
