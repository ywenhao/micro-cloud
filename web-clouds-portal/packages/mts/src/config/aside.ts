import { getAsideIcon } from '@vcp/shared'
import { type Aside } from '@vcp/shared'

export type AsideKeys = 'mts'

const dnsAsideList: Aside<AsideKeys> = {
  title: '云转码 MTS',
  key: 'mts',
  menus: [
    {
      name: 'Overview',
      title: '概览',
      icon: getAsideIcon('overview', 'mts')
    },
    {
      name: 'Task',
      title: '任务',
      icon: getAsideIcon('task', 'mts')
    },
    {
      name: 'Trigger',
      title: '任务触发器',
      icon: getAsideIcon('trigger', 'mts')
    },
    {
      name: 'Workflow',
      title: '工作流',
      icon: getAsideIcon('workflow', 'mts')
    },
    {
      name: 'Presets',
      path: '/presets/transcode',
      title: '预设集',
      icon: getAsideIcon('presets', 'mts')
    },
    {
      name: 'Queue',
      title: '队列',
      icon: getAsideIcon('queue', 'mts')
    }
  ]
}

export const asideList = [dnsAsideList]
