import type { CommonReturn, CommonReturnListItem } from '../../_utils'

export type NodeModel = CommonReturn<'/v1/mts/queue/info', 'get'>

export type NodeItemModel = CommonReturnListItem<'/v1/mts/node', 'get'> & {}
