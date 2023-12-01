import type { RouteRecordRaw } from 'vue-router'

import overview from './overview'
import presets from './presets'
import queue from './queue'
import task from './task'
import trigger from './trigger'
import workflow from './workflow'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Mts',
    meta: { title: '云转码MTS' },
    redirect: { name: 'Overview' },
    children: [
      ...overview,
      ...task,
      ...trigger,
      ...workflow,
      ...presets,
      ...queue
    ]
  },
  {
    path: '/:pathMatch(.*)',
    name: 'NotFound',
    meta: { hasSideBar: true, title: '404' },
    component: () => import('../../../../shared/components/NotFound.vue')
  }
]
