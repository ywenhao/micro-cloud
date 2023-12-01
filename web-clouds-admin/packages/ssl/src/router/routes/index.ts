export const routes = [
  {
    path: '/',
    redirect: '/apply'
  },
  {
    path: '/apply',
    name: 'Apply',
    component: () => import('@/views/apply/ApplyView.vue'),
    meta: {
      currentActiveMenu: 'Apply',
      hasSideBar: true,
      title: '申请列表'
    }
  },
  {
    path: '/license',
    name: 'License',
    component: () => import('@/views/license/LicenseView.vue'),
    meta: {
      currentActiveMenu: 'License',

      hasSideBar: true,
      title: '我的证书'
    }
  },
  {
    path: '/config',
    name: 'Config',
    component: () => import('@/views/config/ConfigView.vue'),
    meta: {
      hasSideBar: true
    }
  }
]
