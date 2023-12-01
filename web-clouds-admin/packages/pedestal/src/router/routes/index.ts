import type { RouteRecordRaw } from 'vue-router'

import { RoleEnum } from '../../config'

export const routes: RouteRecordRaw[] = [
  {
    path: '/sign-in',
    name: 'SignIn',
    component: () => import('@/views/auth/SignIn.vue'),
    meta: {
      ignoreAuth: true
    }
  },
  {
    path: '/',
    name: 'VcaLayout',
    component: () => import('@/layout/VcaLayout.vue'),
    children: []
  }
]

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/overview',
    name: 'Overview',
    component: () => import('@/views/overview'),
    meta: {
      title: '首页概览',
      icon: 'overview',
      roles: [RoleEnum.SUPER, RoleEnum.ADMIN]
    }
  },
  {
    path: '/products',
    name: 'Products',
    meta: {
      title: '产品管理',
      icon: 'products',
      roles: [RoleEnum.SUPER, RoleEnum.ADMIN]
    },
    component: () => import('@/views/product')
  },
  {
    path: '/product/:app*',
    name: 'PortalMicro',
    props: true,
    meta: {
      title: '产品控制台',
      icon: 'products',
      roles: [RoleEnum.SUPER, RoleEnum.ADMIN],
      hideSider: true,
      hideMainScrollbar: true,
      hideMainPadding: true
    },
    component: () => import('@/views/product/PortalMicro.vue')
  },
  {
    path: '/user',
    name: 'User',
    redirect: { name: 'UserList' },
    meta: {
      title: '用户管理',
      icon: 'user',
      roles: [RoleEnum.SUPER, RoleEnum.ADMIN]
    },
    children: [
      {
        path: '',
        name: 'UserList',
        component: () => import('@/views/user/list'),
        meta: {
          keepAlive: true,
          title: '用户列表',
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN]
        }
      },
      {
        path: 'group',
        name: 'UserGroup',
        component: () => import('@/views/user/group'),
        meta: {
          title: '分组管理',
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN]
        }
      },
      {
        path: 'details/:userId/:groupId',
        name: 'UserDetails',
        component: () => import('@/views/user/details'),
        meta: {
          currentActive: 'UserList',
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN],
          hideMainScrollbar: true,
          hideMainPadding: true
        }
      }
    ]
  },
  {
    path: '/admin',
    name: 'Admin',
    redirect: { name: 'AdminList' },
    meta: {
      title: '管理员管理',
      icon: 'user',
      roles: [RoleEnum.SUPER, RoleEnum.ADMIN]
    },
    children: [
      {
        path: '',
        name: 'AdminList',
        component: () => import('@/views/admin/list'),
        meta: {
          title: '管理员列表',
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN]
        }
      },
      {
        path: 'records',
        name: 'LoginRecords',
        component: () => import('@/views/admin/records'),
        meta: {
          title: '登录记录',
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN]
        }
      },
      {
        path: 'logs',
        name: 'Logs',
        component: () => import('@/views/admin/opt-logs'),
        meta: {
          title: '操作日志',
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN]
        }
      }
    ]
  },
  {
    path: '/customer-service',
    name: 'CustomerService',
    redirect: { name: 'WorkRecord' },
    meta: {
      title: '客服管理',
      icon: 'user',
      roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.CUSTOMER_SERVICE]
    },
    children: [
      {
        path: 'work-record',
        name: 'WorkRecord',
        component: () => import('@/views/customer-service/work-record'),
        meta: {
          keepAlive: true,
          title: '工单管理',
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.CUSTOMER_SERVICE]
        }
      },
      {
        path: 'work-record/details/:id',
        name: 'WorkRecordDetails',
        component: () =>
          import('@/views/customer-service/work-record/WorkRecordDetails.vue'),
        meta: {
          title: '工单详情',
          currentActive: 'WorkRecord',
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.CUSTOMER_SERVICE]
        }
      },
      {
        path: 'work-record-type',
        name: 'WorkRecordType',
        component: () => import('@/views/customer-service/work-record-type'),
        meta: {
          title: '工单类型',
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.CUSTOMER_SERVICE]
        }
      }
    ]
  },
  {
    path: '/analysis',
    name: 'Analysis',
    redirect: { name: 'AnalysisForOverview' },
    meta: {
      title: '数据统计',
      icon: 'analysis',
      roles: [RoleEnum.SUPER, RoleEnum.ADMIN]
    },
    children: [
      {
        path: '',
        name: 'AnalysisForOverview',
        component: () => import('@/views/analysis/overview'),
        meta: {
          title: '数据概览',
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN]
        }
      },
      {
        path: 'new-users',
        name: 'AnalysisForNewUsers',
        component: () => import('@/views/analysis/new-users'),
        meta: {
          title: '新增注册用户',
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN]
        }
      },
      {
        path: 'retained',
        name: 'AnalysisForRetained',
        component: () => import('@/views/analysis/retained'),
        meta: {
          title: '留存分析',
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN]
        }
      },
      {
        path: 'pv-uv',
        name: 'AnalysisForPvUv',
        component: () => import('@/views/analysis/pv-uv'),
        meta: {
          title: '平台PV/UV',
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN]
        }
      }
    ]
  },
  {
    path: '/operation',
    name: 'Operation',
    redirect: { name: 'UsersList' },
    meta: {
      title: '运营管理',
      icon: 'operation',
      roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.OPERATIONS]
    },
    children: [
      {
        path: 'notification',
        name: 'OperationForNotification',
        component: () => import('@/views/operation/notification'),
        meta: {
          title: '消息通知',
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.OPERATIONS]
        }
      },
      {
        path: 'announcement',
        name: 'OperationForAnnouncement',
        component: () => import('@/views/operation/announcement'),
        meta: {
          title: '系统公告',
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.OPERATIONS]
        }
      },
      {
        path: 'documents',
        name: 'OperationForDocuments',
        component: () => import('@/views/operation/documents'),
        meta: {
          title: '文档中心',
          hideMainScrollbar: true,
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.OPERATIONS]
        }
      },
      {
        path: 'faq',
        name: 'OperationForFAQ',
        component: () => import('@/views/operation/faq'),
        meta: {
          title: '常见问题',
          hideMainScrollbar: true,
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.OPERATIONS]
        }
      },
      {
        path: 'guide',
        name: 'OperationForGuide',
        component: () => import('@/views/operation/guide'),
        meta: {
          keepAlive: true,
          title: '新手使用指南',
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.OPERATIONS]
        }
      },
      {
        path: 'guide/add',
        name: 'OperationForGuideAdd',
        component: () => import('@/views/operation/guide/add'),
        meta: {
          title: '新手使用指南',
          currentActive: 'OperationForGuide',
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.OPERATIONS]
        }
      },
      {
        path: 'guide/details/:id',
        name: 'OperationForGuideDetails',
        props: true,
        component: () => import('@/views/operation/guide/details'),
        meta: {
          title: '新手使用指南',
          currentActive: 'OperationForGuide',
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN, RoleEnum.OPERATIONS]
        }
      }
    ]
  },
  {
    path: '/settings',
    name: 'Settings',
    redirect: { name: 'UsersList' },
    meta: {
      title: '系统设置',
      icon: 'operation',
      roles: [RoleEnum.SUPER, RoleEnum.ADMIN]
    },
    children: [
      {
        path: 'site',
        name: 'SiteSetting',
        component: () => import('@/views/settings/site'),
        meta: {
          title: '网站配置',
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN]
        }
      },
      {
        path: 'secure',
        name: 'SecureSetting',
        component: () => import('@/views/settings/secure'),
        meta: {
          title: '安全配置',
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN]
        }
      },
      {
        path: 'email',
        name: 'EmailSetting',
        component: () => import('@/views/settings/email'),
        meta: {
          title: '邮箱配置',
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN]
        }
      },
      // 告警设置
      {
        path: 'alarm',
        name: 'AlarmSetting',
        component: () => import('@/views/settings/alarm'),
        meta: {
          title: '告警设置',
          roles: [RoleEnum.SUPER, RoleEnum.ADMIN]
        }
      }
    ]
  }
  // {
  //   path: '/product/:app*',
  //   name: 'MicroApp',
  //   component: () => import('@/views/MicroView.vue'),
  //   meta: {
  //     title: '',
  //     hideMenu: true
  //   }
  // },
]

export const notFountRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)',
  meta: {
    title: '404',
    roles: [
      RoleEnum.SUPER,
      RoleEnum.ADMIN,
      RoleEnum.CUSTOMER_SERVICE,
      RoleEnum.OPERATIONS
    ],
    ignoreAuth: true
  },
  component: () => import('@/views/NotFound.vue')
}
