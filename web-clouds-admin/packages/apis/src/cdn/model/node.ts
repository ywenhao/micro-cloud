import type { CommonReturn } from '../../_utils'

export type NodeEditModal = CommonReturn<
  '/v1/cdnnode/nodes/{node_id}/basic-config',
  'get'
>['info'] & {}

export type NodeEditIPModal = NodeEditModal['report_public_ips'] & {}
