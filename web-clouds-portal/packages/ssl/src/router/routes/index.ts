export const routes = [
  {
    path: '/',
    name: 'Ssl',
    meta: { title: 'SSL证书' },
    redirect: '/apply'
  },
  {
    path: '/apply',
    name: 'Apply',
    component: () => import('@/views/apply/ApplyView.vue'),
    meta: {
      currentActive: 'Apply',
      hasSideBar: true,
      title: '申请列表'
    }
  },
  {
    path: '/license',
    name: 'License',
    component: () => import('@/views/license/LicenseView.vue'),
    meta: {
      currentActive: 'License',

      hasSideBar: true,
      title: '我的证书'
    }
  }
  // {
  //   path: '/config',
  //   name: 'Config',
  //   component: () => import('@/views/config/ConfigView.vue'),
  //   meta: {
  //     hasSideBar: true
  //   }
  // }
]
