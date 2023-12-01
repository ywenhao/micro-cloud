<template>
  <a-spin :size="32" class="h-full w-full" :loading="loading">
    <micro-app
      :iframe="true"
      class="h-full w-full"
      disable-memory-router
      :data="dataForChild"
      :name="appName"
      :url="appUrl"
      @mounted="handleAppMounted"
      @datachange="handleDataChange()"
    />
  </a-spin>
</template>

<script lang="ts">
import type { MicroAppData } from '@vca/shared'
import { defineComponent } from 'vue'

export default defineComponent({
  props: ['app'],
  setup(props) {
    const appName = computed<string>(() => {
      const app: string | string[] = props?.app
      return Array.isArray(props?.app) ? app[0] : String(app)
    })
    const router = useRouter()
    const appUrl = getMicroAppUrl(appName.value)

    const appStore = useAppStore()
    const dataForChild = computed(() => {
      const { clearLoginInfo: signOut } = appStore
      return {
        token: appStore.token,
        productList: appStore.productList,
        productName: appStore.productList.find(
          item => item.symbol === appName.value
        )?.name,
        adminInfo: appStore.userInfo,
        pedestalRouter: router,
        signOut: () => {
          setTimeout(signOut, 500)
        }
      } satisfies MicroAppData
    })
    const handleDataChange = () => {}
    // const handleDataChange = (evt: CustomEvent) => {
    // const { command } = evt.detail.data
    // if (command === 'BACK_PRODUCTS') {
    //   router.push({ name: 'Products' })
    // }
    // if (command === 'BACK_USERDETAILS') {
    //   router.push({
    //     name: 'UserDetails',
    //     params: {
    //       userId: '',
    //       groupId: ''
    //     }
    //   })
    // }
    // if (command === 'TO') {
    //   const { href } = router.resolve({ path: `/product/${value}` })
    //   window.open(href)
    // }
    // }
    const loading = ref(true)

    const handleAppMounted = () => {
      loading.value = false
    }
    return {
      appName,
      appUrl,
      loading,
      dataForChild,
      handleAppMounted,
      handleDataChange
    }
  }
})
</script>

<style lang="less" scoped>
.micro-app {
  padding-top: 52px;
  margin-top: -52px;
}
</style>
