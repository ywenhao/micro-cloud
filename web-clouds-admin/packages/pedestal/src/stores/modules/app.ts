import {
  adminInfoApi,
  type AdminModel,
  confApi,
  type ConfModel,
  productListApi,
  type ProductModel,
  signInApi
} from '@vca/apis/pedestal'
import { tokenName } from '@vca/shared'
import Cookies from 'js-cookie'
import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteLocationRaw, RouteRecordRaw } from 'vue-router'

import { authRoutes, notFountRoute } from '@/router/routes'

// import { jumpNameAfterLogin, storesKey } from '@/config'

const { MODE } = import.meta.env
const UPPER_MODE = MODE.toUpperCase()
export const useAppStore = defineStore(
  `__VCLOUD__${UPPER_MODE}__STORE_CDN_APP__`,
  () => {
    const token = ref<string | undefined>()
    const userInfo = ref<AdminModel>()
    const router = useRouter()
    const route = useRoute()

    const baseConf = ref<ConfModel['base_conf']>()
    const domainConf = ref<ConfModel['domain_conf']>()
    const behavioralCaptchaLoading = ref(false)
    const behavioralCaptchaConf = ref<{
      user: number
      manage: number
    }>({
      user: 1,
      manage: 1
    })
    const routerReady = ref(false)
    const isLogined = computed(() => !!token.value)

    // 产品列表
    const productList = ref<ProductModel[]>([])
    const getProductList = () => {
      if (!isLogined.value) return
      productListApi({}).then(res => {
        productList.value = res.list || []
      })
    }

    /**
     * 登录
     * @param data 登录参数
     * @returns Promise<boolean>
     */
    const signInAction = async (data: {
      username: string
      password: string
    }) => {
      const res = await signInApi(data)
      // @ts-ignore;
      if (res.code === 12156200) {
        // @ts-ignore;
        token.value = res.data.token
        Cookies.set(tokenName, token.value!, { sameSite: 'lax' })
        // @ts-ignore
        const path = HOME_PATH(res?.data?.admin?.role || 1)
        getAdminInfo(path as RouteLocationRaw)
        // @ts-ignore;
        return Promise.resolve(res.data)
      } else {
        return Promise.reject(res)
      }
    }

    const addRouterAction = (role?: number) => {
      if (!role) return

      let routes = cloneDeep(authRoutes)
      const getRoutes = (list: RouteRecordRaw[]) => {
        return list.reduce((pre, cur) => {
          const roles = (cur.meta?.roles || []) as number[]
          if (roles.includes(role)) {
            if (cur.children?.length) {
              cur.children = getRoutes(cur.children)
            }
            pre.push(cur)
          }
          return pre
        }, [] as RouteRecordRaw[])
      }

      routes = getRoutes(routes)

      routes.forEach(item => router.addRoute('VcaLayout', item))
      router.addRoute(notFountRoute)
    }

    const getConfigInfo = () => {
      confApi({ type: 2 }).then(res => {
        baseConf.value = res.base_conf
      })
    }
    const getDomainConf = () => {
      confApi({ type: 7 }).then(res => {
        domainConf.value = res.domain_conf
      })
    }

    const getBehavioralCaptchaConf = () => {
      behavioralCaptchaLoading.value = true
      confApi({ type: 9 })
        .then(res => {
          behavioralCaptchaConf.value = res.behavioral_captcha_conf as any
        })
        .finally(() => {
          behavioralCaptchaLoading.value = false
        })
    }
    onMounted(() => {
      getConfigInfo()
      getDomainConf()
    })
    const getAdminInfo = async (path?: RouteLocationRaw) => {
      if (!isLogined.value) return
      const res = await adminInfoApi({})
      userInfo.value = res
      addRouterAction(userInfo.value?.role)
      routerReady.value = true
      router.replace(path ? path : { ...route })
    }

    const clearLoginInfo = () => {
      Cookies.remove(tokenName)
      token.value = undefined
      router.replace({ name: 'SignIn' })
    }

    return {
      token,
      userInfo,
      domainConf,
      behavioralCaptchaConf,
      behavioralCaptchaLoading,
      getBehavioralCaptchaConf,
      baseConf,
      isLogined,
      productList,
      getAdminInfo,
      getConfigInfo,
      signInAction,
      clearLoginInfo,
      getProductList
    }
  },
  { persist: true }
)
