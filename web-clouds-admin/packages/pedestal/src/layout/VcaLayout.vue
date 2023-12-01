<template>
  <a-layout class="vca-layout" :class="{ 'has-sider': !route.meta?.hideSider }">
    <a-layout-header class="vca-layout__header">
      <router-link
        :to="{ path: HOME_PATH(role) || '/' }"
        class="vc-header-logo"
      >
        <vca-logo v-if="clientLogo" :src="clientLogo" />
        <vc-svg-icon v-else name="logo" :size="24"></vc-svg-icon>
        {{ clientName }}管理系统
      </router-link>
      <i class="flex-1"></i>
      <a-link
        :href="masterDomain"
        @click="handleMasterDomainClick"
        :hoverable="false"
        class="header-link"
      >
        官网
      </a-link>
      <router-link :to="{ name: 'WorkRecord' }" class="header-link mr-4">
        <a-badge :count="99" :max-count="99" :offset="[10, -6]">工单</a-badge>
      </router-link>
      <user-avatar-picker />
    </a-layout-header>
    <a-layout-sider
      class="vca-layout__sider"
      v-if="!route.meta?.hideSider"
      :width="200"
    >
      <a-scrollbar class="overflow-y-auto" outer-class="h-full">
        <vc-menu
          class="mt-4"
          auto-open-selected
          :selected-keys="[defaultActive]"
          @menu-item-click="handleMenuClick"
          :menus="menus"
        ></vc-menu>
      </a-scrollbar>
    </a-layout-sider>
    <a-layout-content
      class="vca-layout__main"
      :class="{ 'hide-main__content': !!route.meta?.hideMainScrollbar }"
    >
      <a-scrollbar
        :class="
          !route.meta?.hideMainScrollbar
            ? 'vca-layout-scrollbar__view'
            : { 'p-6': !route.meta?.hideMainPadding }
        "
        :outer-class="
          !route.meta?.hideMainScrollbar
            ? 'vca-layout__main--scrollbar'
            : undefined
        "
      >
        <router-view v-slot="{ Component }">
          <keep-alive :exclude="keepAliveExclude" :key="keepAliveKey">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </a-scrollbar>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="tsx">
import './layout.less'

import { Message } from '@arco-design/web-vue'
import { useKeepAlive } from '@vca/shared'
import { type VcAppMenuRaw, VcSvgIcon } from 'vc-material'
import { useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const clientName = computed(() => appStore.baseConf?.client_name || APP_TITLE)
const clientLogo = computed(() => appStore.baseConf?.client_logo || '')

const { keepAliveExclude, keepAliveKey } = useKeepAlive()

const role = computed(() => appStore.userInfo?.role || 1)
const defaultActive = computed(() =>
  (route?.meta?.currentActive || route.name || '').toString()
)
const masterDomain = computed(() => appStore.domainConf?.master_domain || '')

const menus = computed<VcAppMenuRaw[]>(() => {
  const userInfo = appStore.userInfo
  if (!userInfo?.role) return [] as VcAppMenuRaw[]
  const customerService: VcAppMenuRaw = {
    name: 'CustomerService',
    title: '客服管理',
    icon: [
      <VcSvgIcon name="customer_service"></VcSvgIcon>,
      <VcSvgIcon name="customer_service_active"></VcSvgIcon>
    ],
    children: [
      { name: 'WorkRecord', title: '工单管理' },
      { name: 'WorkRecordType', title: '工单类型' }
    ]
  }
  const operation: VcAppMenuRaw = {
    name: 'Operation',
    title: '运营管理',
    icon: [
      <VcSvgIcon name="operation"></VcSvgIcon>,
      <VcSvgIcon name="operation_active"></VcSvgIcon>
    ],
    children: [
      { name: 'OperationForNotification', title: '消息通知' },
      { name: 'OperationForAnnouncement', title: '系统公告' },
      { name: 'OperationForDocuments', title: '文档中心' },
      { name: 'OperationForFAQ', title: '常见问题' },
      { name: 'OperationForGuide', title: '新手指南' }
    ]
  }
  if (userInfo?.role === RoleEnum.CUSTOMER_SERVICE) {
    return [customerService]
  }
  if (userInfo?.role === RoleEnum.OPERATIONS) {
    return [operation]
  }
  return [
    {
      name: 'Overview',
      title: '首页概览',
      icon: [
        <VcSvgIcon name="admin"></VcSvgIcon>,
        <VcSvgIcon name="admin_active"></VcSvgIcon>
      ],
      children: []
    },
    {
      name: 'Products',
      title: '产品管理',
      icon: [
        <VcSvgIcon name="product"></VcSvgIcon>,
        <VcSvgIcon name="product_active"></VcSvgIcon>
      ]
    },
    {
      name: 'Users',
      title: '用户管理',
      icon: [
        <VcSvgIcon name="users"></VcSvgIcon>,
        <VcSvgIcon name="users_active"></VcSvgIcon>
      ],
      children: [
        { name: 'UserList', title: '用户列表' },
        { name: 'UserGroup', title: '分组管理' }
      ]
    },
    {
      name: 'Analysis',
      title: '数据统计',
      icon: [
        <VcSvgIcon name="analysis"></VcSvgIcon>,
        <VcSvgIcon name="analysis_active"></VcSvgIcon>
      ],
      children: [
        { name: 'AnalysisForOverview', title: '数据概览' },
        { name: 'AnalysisForNewUsers', title: '用户分析' },
        { name: 'AnalysisForRetained', title: '留存分析' },
        { name: 'AnalysisForPvUv', title: '访问分析' }
      ]
    },
    operation,

    customerService,

    {
      name: 'Admin',
      title: '管理员管理',
      icon: [
        <VcSvgIcon name="admin"></VcSvgIcon>,
        <VcSvgIcon name="admin_active"></VcSvgIcon>
      ],
      children: [
        { name: 'AdminList', title: '管理员列表' },
        { name: 'LoginRecords', title: '登录记录' },
        { name: 'Logs', title: ' 操作日志' }
      ]
    },
    {
      name: 'Settings',
      title: '系统设置',
      icon: [
        <VcSvgIcon name="settings"></VcSvgIcon>,
        <VcSvgIcon name="settings_active"></VcSvgIcon>
      ],
      children: [
        { name: 'SiteSetting', title: '网站配置' },
        { name: 'EmailSetting', title: '邮箱配置' },
        { name: 'SecureSetting', title: '安全配置' },
        { name: 'AlarmSetting', title: '告警设置' }
      ]
    }
  ]
})

const handleMenuClick = (name: string) => {
  router.push({ name })
}

const handleMasterDomainClick = (event: MouseEvent) => {
  event.preventDefault()
  if (!masterDomain.value) {
    Message.error('未获取到官网地址，请稍后重试!')
    return
  }
  window.open(masterDomain.value, '_blank')
}
</script>

<style lang="less">
.vc-header-logo {
  @apply flex items-center gap-x-2 no-underline font-600;
  color: rgb(var(--primary-6));
  line-height: 25px;
}

.header-link {
  @apply text-ct-1!  inline-block w-13 no-underline text-center;
}
.hide-main__content {
  & > .arco-scrollbar {
    position: initial;
    height: 100%;
    & > .arco-scrollbar-container {
      position: initial;
      height: 100%;
    }
    & > .arco-scrollbar-track {
      display: none;
    }
  }
}
</style>
