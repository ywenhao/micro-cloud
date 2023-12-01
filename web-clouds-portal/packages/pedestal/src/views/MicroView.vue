<template>
  <a-spin :size="32" class="h-full w-full" :loading="loading">
    <micro-app
      iframe
      class="h-full w-full"
      disable-memory-router
      :data="dataForChild"
      :name="appName"
      :url="appUrl"
      @mounted="handleAppMounted"
      @unmount="handleAppUnmounted"
    />
  </a-spin>
</template>

<script setup lang="ts">
import microApp from '@micro-zoe/micro-app'
import { DEV_SUB_PORT_MAP, isDev, type MicroAppData } from '@vcp/shared'

const props = defineProps<{
  app: string | string[]
}>()

const { protocol, hostname, origin } = window.location

const appName = computed<string>(() => {
  const app: string | string[] = props?.app
  return Array.isArray(app) ? app[0] : String(app)
})
const appUrl = computed(() =>
  isDev
    ? `${protocol}/${hostname}:${DEV_SUB_PORT_MAP[appName.value]}`
    : `${origin}/${appName.value}`
)

const router = useRouter()

const appStore = useAppStore()
const productStore = useProductStore()

watchEffect(() => {
  if (!productStore.loaded) return
  const hasAppName = productStore.list.some(
    item => item.symbol === appName.value
  )
  !hasAppName && router.push('/404')
})

const dataForChild = computed(() => {
  return {
    token: appStore.token,
    userInfo: appStore.userInfo,
    productList: productStore.list,
    pedestalRouter: router,
    signOut: () => {
      setTimeout(() => {
        appStore.signOut()
      }, 500)
    }
  } satisfies MicroAppData
})
const loading = ref(true)

const handleAppUnmounted = () => {
  loading.value = true
  microApp.setGlobalData({ subTitles: [] })
}

const handleAppMounted = () => {
  loading.value = false
}
</script>
