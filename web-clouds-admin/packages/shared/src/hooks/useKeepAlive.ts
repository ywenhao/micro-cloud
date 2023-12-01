import { computed, nextTick, ref, watch } from 'vue'
import { type RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

/**
 * 一级页面route.meta.keepAlive = true, 二级页面文件name满足下面正则的前提下
 * 从一级页面进入二级页面，不刷新，二级页面回一级不刷新，keepAlive生效
 */

const keepAliveList = ['info', 'detail', 'edit', 'add', 'setup']

export function useKeepAlive() {
  const route = useRoute()
  const keepAliveKey = ref(Date.now())

  // 二级页面不用缓存
  const keepAliveExclude = computed(() => {
    if (!route) return
    if (route.meta?.keepAlive) return
    return new RegExp(keepAliveList.join('|'), 'i')
  })

  const hasName = (name?: string) => {
    name = (name || '').toLowerCase()
    return keepAliveList.some(v => name!.includes(v))
  }

  let oldRoute: RouteLocationNormalizedLoaded | undefined

  watch(route, newRoute => {
    nextTick(() => (oldRoute = { ...newRoute }))
    if (!oldRoute || newRoute.name === oldRoute.name) return
    // 一级进入二级页面，需要缓存
    if (oldRoute.meta.keepAlive && hasName(newRoute.name as string)) return
    // 二级回到一级页面，需要缓存
    if (newRoute.meta.keepAlive && hasName(oldRoute.name as string)) return
    // 刷新
    keepAliveKey.value = Date.now()
  })

  return { keepAliveKey, keepAliveExclude }
}
