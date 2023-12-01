import type { RouteRecordRaw } from 'vue-router'

import OverView from '@/views/Overview'

export const routes: RouteRecordRaw[] = [
  {
    path: '/product/:app*',
    name: 'MicroView',
    props: true,
    meta: {
      // title: '产品控制台',
      // icon: 'products'
    },
    component: () => import('@/views/MicroView.vue')
  },
  {
    path: '/',
    name: 'Home',
    meta: { title: '概览', overview: true },
    component: OverView
  },
  {
    path: '/message',
    name: 'Message',
    meta: { title: '消息中心' },
    redirect: { name: 'MessageInform' },
    children: [
      {
        path: '/message/inform',
        name: 'MessageInform',
        meta: {
          title: '消息通知',
          hasSideBar: true,
          currentActive: 'MessageInform'
        },
        component: () => import('@/views/message/MessageInform.vue')
      },
      {
        path: '/message/notice',
        name: 'MessageNotice',
        meta: {
          title: '系统通知',
          hasSideBar: true,
          currentActive: 'MessageNotice'
        },
        component: () => import('@/views/message/MessageNotice.vue')
      }
    ]
  },

  {
    path: '/work-order',
    name: 'WorkOrder',
    meta: { title: '工单中心' },
    redirect: { name: 'WorkOrderMy' },
    children: [
      {
        path: '/work-order/submit',
        name: 'WorkOrderSubmit',
        meta: {
          title: '提交工单',
          hasSideBar: true,
          currentActive: 'WorkOrderSubmit'
        },
        component: () => import('@/views/workOrder/SubmitWorkOrder.vue')
      },
      {
        path: '/work-order/my',
        name: 'WorkOrderMy',
        meta: {
          title: '我的工单',
          hasSideBar: true,
          currentActive: 'WorkOrderMy'
        },
        component: () => import('@/views/workOrder/MyWorkOrder.vue')
      },
      {
        path: '/work-order/talk/:id',
        name: 'WorkOrderTalk',
        meta: {
          title: '工单详情',
          hasSideBar: true,
          currentActive: 'WorkOrderMy'
        },
        component: () => import('@/views/workOrder/WorkOrderTalk.vue')
      }
    ]
  },

  {
    path: '/center',
    meta: { title: '个人中心' },
    redirect: { name: 'CenterBase' },
    children: [
      {
        path: '/center/base',
        name: 'CenterBase',
        meta: { title: '基本信息' },
        component: () => import('@/views/center/CenterView.vue')
      },
      {
        path: '/center/safe',
        name: 'CenterSafe',
        meta: { title: '安全设置' },
        component: () => import('@/views/center/CenterView.vue')
      }
      // {
      //   path: '/center/api-key',
      //   name: 'CenterApiKey',
      //   meta: { noSideBar: true },
      //   component: () => import('@/views/center/CenterView.vue')
      // },
    ]
  },
  {
    path: '/:pathMatch(.*)',
    name: 'NotFound',
    meta: { title: '404', ignoreAuth: true },
    component: () => import('../../../../shared/components/NotFound.vue')
  }
]
