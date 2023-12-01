import type { RouteRecordRaw } from 'vue-router'

/** 预设管理 */
const routes: RouteRecordRaw[] = [
  {
    path: '/presets',
    name: 'Presets',
    meta: { title: '预设管理' },
    redirect: { name: 'PresetsSys' },
    children: [
      {
        path: 'sys',
        name: 'PresetsSys',
        meta: { title: '系统预设', keepAlive: true },
        component: () => import('@/views/presets/sys')
      },
      {
        path: 'user',
        redirect: '/presets/user/transcode'
      },
      {
        path: 'user/:type',
        name: 'PresetsUser',
        meta: { title: '用户预设' },
        component: () => import('@/views/presets/user')
      },
      {
        path: 'sys/transcode/add',
        name: 'PresetsSysTranscodeAdd',
        meta: { title: '新建预设-转码', currentActive: 'PresetsSys' },
        component: () => import('@/views/presets/sys/AddTranscodeView.vue')
      },
      {
        path: 'sys/transcode/edit/:id',
        name: 'PresetsSysTranscodeEdit',
        meta: { title: '编辑预设-转码', currentActive: 'PresetsSys' },
        component: () => import('@/views/presets/sys/AddTranscodeView.vue')
      }
    ]
  }
]

export default routes
