import { type Aside, getAsideIcon } from '@vcp/shared'

export type AsideKeys = 'message' | 'workOrder' | 'document' | 'question'

const messageAsideList: Aside<AsideKeys> = {
  title: '消息中心',
  key: 'message',
  menus: [
    {
      name: 'MessageInform',
      title: '消息通知',
      icon: getAsideIcon('message')
    },
    {
      name: 'MessageNotice',
      title: '系统公告',
      icon: getAsideIcon('notice')
    }
  ]
}

const workOrderAsideList: Aside<AsideKeys> = {
  title: '工单中心',
  key: 'workOrder',
  menus: [
    {
      name: 'WorkOrderSubmit',
      title: '提交工单',
      icon: getAsideIcon('submit-work-order')
    },
    {
      name: 'WorkOrderMy',
      title: '我的工单',
      icon: getAsideIcon('my-work-order')
    }
  ]
}

export const asideList = [messageAsideList, workOrderAsideList]
