<template>
  <div class="vcp-layout">
    <div class="vcp-layout__header">
      <a-spin class="header-spin" :loading="true" v-if="loading" />
      <router-link to="/" class="header-logo">
        <a-image
          :preview="false"
          :src="mergeBaseURL(appStore.baseConf?.client_logo)"
        >
          <template #error>
            <vc-svg-icon class="w-full h-full" name="logo" />
          </template>
        </a-image>
        <span>{{ appStore.baseConf?.client_name || '-' }}</span>
      </router-link>
      <a-divider direction="vertical" class="mx-6! h-6!" />
      <products-popover :products="products" @select="handleProductsSelect">
        <vc-svg-icon :size="24" class="vcp-icon-apps" name="apps"></vc-svg-icon>
      </products-popover>

      <i class="flex-1"></i>
      <template v-for="item in headerRightMenus" :key="item.label">
        <right-item @click="handleClick" v-bind="item" />
      </template>
      <user-dropdown />
    </div>
    <div class="flex-1 overflow-hidden flex vc-main" v-if="$route.name">
      <router-view v-if="isMicroPage" />
      <template v-else>
        <vc-aside :menus="asideList" v-if="$route.meta.hasSideBar" />
        <div
          class="vcp-layout__main pb-24px"
          :class="{ 'is-overview': $route.meta?.overview }"
        >
          <vc-scrollbar
            wrap-class="layout__main-scrollbar"
            view-class="min-h-full bg-white rounded-12px flex flex-col"
          >
            <router-view v-slot="{ Component }">
              <keep-alive :exclude="keepAliveExclude" :key="keepAliveKey">
                <component :is="Component" />
              </keep-alive>
            </router-view>
          </vc-scrollbar>
        </div>
      </template>
    </div>
    <vc-notice
      v-model:visible="noticeState.visible"
      :list="noticeState.list"
      @open="handleNext"
      @next="handleNext"
    />
  </div>
</template>

<script setup lang="tsx">
import { Message } from '@arco-design/web-vue'
import {
  type ConfModel,
  type NoticeAlertModel,
  queryAnnouncementAlertApi,
  queryConfApi,
  queryMessageSummaryApi,
  updateAnnouncementUserApi
} from '@vcp/apis/pedestal'
import { useKeepAlive, VcAside } from '@vcp/shared'
import type { NoticeItem } from 'vc-material'
import { useRouter } from 'vue-router'

import { asideList } from '@/config'
import { SET_HEADER_RIGHT_COUNT } from '@/constants'

import RightItem from './components/RightItem.vue'
import UserDropdown from './components/UserDropdown.vue'

const { keepAliveExclude, keepAliveKey } = useKeepAlive()

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const appStore = useAppStore()
const productStore = useProductStore()
productStore.getProductList()

const products = computed(() =>
  productStore.list.map(v => ({
    name: v.name!,
    symbol: v.symbol!,
    icon: v.icon!
  }))
)

const isMicroPage = computed(() => route.name === 'MicroView')

const domainConf = ref<ConfModel['domain_conf']>()
const headerUrls = computed(() => {
  const WebSite = domainConf.value?.master_domain || ''
  if (!WebSite) return {}
  const Document = new URL(WebSite).origin + '/document'
  const Question = new URL(WebSite).origin + '/document/problem'
  return { WebSite, Document, Question }
})

export interface HeaderRightMenu {
  label: string
  icon?: string
  title?: string
  value?: number
  isDot?: boolean
  children?: HeaderRightMenu[]
}

const headerRightMenus: HeaderRightMenu[] = reactive([
  { title: '官网', label: 'WebSite' },
  { title: '文档', label: 'Document' },
  { title: '工单', label: 'WorkOrderMy', isDot: false },
  { icon: 'question', title: '常见问题', label: 'Question' },
  {
    icon: 'notice2',
    children: [
      {
        icon: 'header_message',
        title: '消息通知',
        value: 0,
        label: 'MessageInform'
      },
      {
        icon: 'header_notice',
        title: '系统公告',
        value: 0,
        label: 'MessageNotice'
      }
    ],
    label: 'message'
  }
])

const setHeaderRightCount = async () => {
  const res = await queryMessageSummaryApi()

  const workerOrder = headerRightMenus.find(v => v.label === 'WorkOrderMy')!
  workerOrder.isDot = +res.worker_order_unread_count! > 0
  const messageInform = headerRightMenus
    .find(v => v.label === 'message')!
    .children!.find(v => v.label === 'MessageInform')!
  messageInform.value = +res.message_unread_count!
}

const setDomainConf = async () => {
  const res = await queryConfApi({ type: 7 })
  domainConf.value = res.domain_conf!
  appStore.setHeaderUrls(headerUrls.value)
}

const setHeaderAsyncData = async () => {
  loading.value = true
  try {
    await Promise.all([setHeaderRightCount(), setDomainConf()])
  } finally {
    loading.value = false
  }
}
setHeaderAsyncData()

const getHeaderItem = (label: string) =>
  headerRightMenus.find(v => v.label === label)!

const handleClick = (label: string) => {
  const confRouteList = ['WebSite', 'Document', 'Question']
  if (confRouteList.includes(label)) {
    const href = headerUrls.value[label as keyof typeof headerUrls.value]
    href ? window.open(href) : Message.error('暂无配置')
    return
  }
  const item = getHeaderItem(label)
  const hasChildren = !!item?.children?.length
  if (hasChildren) return

  const routes = router.getRoutes()

  if (routes.some(route => route.name === label)) {
    const { href } = router.resolve({ name: label })
    window.history.pushState(null, '', href)
    window.dispatchEvent(new PopStateEvent('popstate', { state: null }))
    return
  }
}

const noticeState = reactive({
  index: 0,
  visible: false,
  list: [] as NoticeItem[]
})

// 公告部分
const getNotice = async () => {
  const res = await queryAnnouncementAlertApi()
  const list = res.list || []
  if (list.length) {
    noticeState.index = 0
    noticeState.list = list as NoticeItem[]
    noticeState.visible = true
  }
}

watchEffect(async () => {
  if (appStore.noticeShow) {
    await getNotice()
    appStore.noticeShow = false
  }
})

const handleNext = (index: number = 0) => {
  noticeState.index = index
  // 上报
  const item = noticeState.list[index] as NoticeAlertModel
  if (appStore.noticeReportedList.includes(item.id!)) return
  updateAnnouncementUserApi({ announcement_id_list: [item.id!] })
  appStore.noticeReportedList.push(item.id!)
}

const handleProductsSelect = ({ symbol }: { symbol: string }) => {
  const { href } = router.resolve({
    name: 'MicroView',
    params: { app: symbol }
  })
  window.history.pushState(null, '', href)
  window.dispatchEvent(new PopStateEvent('popstate', { state: null }))
}

provide(SET_HEADER_RIGHT_COUNT, setHeaderRightCount)
</script>

<style lang="less">
@main-bg: url('@/assets/layout-bg.png') center / cover no-repeat;
.vcp-layout__header {
  background-color: #fff;
}
.vc-main {
  background: @main-bg;
}
.header-logo {
  display: flex;
  align-items: center;
  height: 100%;
  text-decoration: none;
  .arco-image,
  img {
    width: 26px;
    height: 26px;
  }
  span {
    margin-left: 8px;
    font-size: 18px;
    color: rgb(var(--primary-6));
    font-weight: 600;
  }
}
.vcp-layout__main {
  background: @main-bg;
  background-size: cover;

  &.is-overview {
    background: url('@/assets/overview-bg.png') center / cover no-repeat;
    background-position: initial;
    .vc-scrollbar__view {
      background-color: transparent;
    }
  }
  .layout__main-scrollbar {
    // height: 100%;
    padding: 0 24px;
    padding-top: 24px;
    width: 100%;
    // & > .vcp-container {
    //   min-height: 100%;
    // }
  }
}
.vcp-icon-apps {
  cursor: pointer;
  &:hover {
    background: var(--color-fill-2, #f2f3f5);
  }
}
.vcp-layout {
  .vcp-layout__header {
    position: relative;
    box-shadow: 0px 2px 6px rgba(29, 33, 41, 0.05);
    .header-spin {
      position: absolute;
      right: 55px;
      z-index: 1;
      width: 255px;
      text-align: center;
      background: rgba(#fff, 0.8);
    }
  }
}
</style>
