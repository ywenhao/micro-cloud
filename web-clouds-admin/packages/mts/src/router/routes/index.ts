import type { RouteRecordRaw } from 'vue-router'

const modules: Record<string, RouteRecordRaw> = import.meta.glob(
  './modules/*.ts',
  { eager: true, import: 'default' }
)

const routesModules = Object.values(modules).flat()

export const routes: RouteRecordRaw[] = [
  ...routesModules,
  {
    path: '/:pathMatch(.*)',
    name: 'NotFound',
    meta: {
      title: '404'
    },
    component: () => import('@/views/NotFound.vue')
  }
]
