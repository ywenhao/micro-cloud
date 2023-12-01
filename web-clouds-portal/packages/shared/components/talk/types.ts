export type TalkMessageType = 'text' | 'image'

export type TalkSendParams = {
  message: string
  type: TalkMessageType
}

export type TalkLoadMoreParams = {
  id: string
  type: 'next' | 'prev' | 'new'
}

export type TalkMessageItem = {
  id: string
  time: number
  message: string
  status: 'read' | 'unread'
  position: 'left' | 'right'
  messageType: TalkMessageType
}

export type TalkLoadMoreHandler = (
  params: TalkLoadMoreParams
) => Promise<TalkMessageItem[]>
