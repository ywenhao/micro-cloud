import { Message } from '@arco-design/web-vue'
import {
  type ConfModel,
  queryConfApi,
  ssoLogoutApi,
  ssoTicketVerifyApi,
  userInfoApi,
  type UserInfoModel
} from '@vcp/apis/pedestal'
import { decodeUrl, getToken, tokenName } from '@vcp/shared'
import Cookies from 'js-cookie'
import { defineStore } from 'pinia'

import router from '@/router'

type HeaderUrls = {
  WebSite?: string
  Document?: string
  Question?: string
}

const { MODE } = import.meta.env
const UPPER_MODE = MODE.toUpperCase()

export const useAppStore = defineStore(
  `__VCLOUD__${UPPER_MODE}__STORE_APP__`,
  () => {
    const token = ref(getToken())
    const ssoLoginURL = ref('')
    const noticeReportedList = ref<string[]>([])
    const baseConf = ref<ConfModel['base_conf']>()
    const domainConf = ref<ConfModel['domain_conf']>()

    const userInfo = ref<UserInfoModel>({})
    const noticeShow = ref(false)
    const headerUrls = ref<HeaderUrls>({})

    const setHeaderUrls = (urls: HeaderUrls) => {
      headerUrls.value = urls
    }

    let isRequestSsoLoginURLIng = false
    const getSsoLoginURL = async () => {
      if (isRequestSsoLoginURLIng || ssoLoginURL.value) return
      isRequestSsoLoginURLIng = true
      try {
        const conf = await queryConfApi({ type: 7 })
        const loginURL = conf.domain_conf?.sso_domain!
        if (!loginURL) {
          Message.error('sso登录地址未配置')
        }
        const url = new URL(loginURL)
        url.searchParams.append('redirect_uri', location.href)
        url.searchParams.delete('ticket')
        ssoLoginURL.value = url.toString()
      } finally {
        isRequestSsoLoginURLIng = false
      }
    }

    const clearLoginInfo = () => {
      userInfo.value = {}
      token.value = ''
      ssoLoginURL.value = ''
      Cookies.remove(tokenName)
      noticeShow.value = false
      noticeReportedList.value = []
    }

    let messageInstance: any
    let timer: NodeJS.Timer | undefined
    const goSsoLogin = (showMsg = true) => {
      if (timer) return
      clearLoginInfo()
      if (showMsg) {
        Message.clear()
        messageInstance = Message.error(
          '当前用户没有登录或者登录已失效，请重新登录'
        )
      }
      timer = setTimeout(() => {
        getSsoLoginURL().then(() => {
          if (messageInstance) {
            messageInstance.close()
            messageInstance = undefined
          }
          window.location.replace(ssoLoginURL.value)
        })
        // clearTimeout(timer!)
        // timer = undefined
      }, 500)
    }

    const userInfoAction = async () => {
      userInfo.value = await userInfoApi()
    }

    const getBaseConf = async () => {
      const res = await queryConfApi({ type: 2 })
      baseConf.value = res.base_conf!
      const refDomain = await queryConfApi({ type: 7 })
      domainConf.value = refDomain.domain_conf!
    }

    const signInAction = async () => {
      const searchParams = new URLSearchParams(location.search)
      let ticket = searchParams.get('ticket')
      ticket &&= decodeUrl(ticket)
      const _token = getToken()
      if (!ticket && !_token) {
        goSsoLogin()
        return
      }
      try {
        if (ticket && !_token) {
          const service = location.host
          const result = await ssoTicketVerifyApi({ ticket: ticket!, service })
          token.value = result.token!
          userInfo.value = result.info!
        } else {
          userInfo.value = await userInfoApi()
          token.value = _token!
        }

        !getToken() && Cookies.set(tokenName, token.value)

        noticeShow.value = true
        const url = new URL(location.href)
        url.searchParams.delete('ticket')
        url.searchParams.delete('token')
        url.searchParams.delete('user')
        router.replace(url.toString().replace(location.origin, ''))
      } catch (e) {
        goSsoLogin()
      }
    }

    /**
     * 不调用接口，仅退出
     */
    const signOut = () => {
      // headerUrls.value.WebSite
      clearLoginInfo()
      goSsoLogin(false)
    }

    const signOutAction = () => {
      ssoLogoutApi({}).finally(() => {
        clearLoginInfo()
      })
    }

    return {
      token,
      baseConf,
      domainConf,
      userInfo,
      ssoLoginURL,
      noticeShow,
      /** 已上报的通知列表*/
      noticeReportedList,
      setHeaderUrls,
      getBaseConf,
      userInfoAction,
      signInAction,
      signOut,
      getSsoLoginURL,
      clearLoginInfo,
      signOutAction
    }
  },
  {
    persist: true
  }
)
