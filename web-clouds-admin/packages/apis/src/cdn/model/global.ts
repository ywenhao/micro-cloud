import type { CommonReturn, CommonReturnListItem } from '../../_utils'

export type NodeWafRuleModel = CommonReturn<
  '/v1/cdn/site/waf-rule/{site_id}/{rule_id}',
  'get'
> & {}

export type GlobalCacheModel = CommonReturn<
  '/v1/cdn/global/cache-rule/{rule_id}',
  'get'
>['rule'] & {}

export type PageRulesModel = Required<
  CommonReturnListItem<'/v1/cdn/site/page-rule/{site_id}', 'get'>
>

export type PageRuleModel = CommonReturnListItem<
  '/v1/cdn/site/page-rule/{site_id}',
  'get'
>['rule'] & {}

export type StorageConfig = CommonReturn<
  '/v1/cdn/global/storage-config',
  'get'
>['storageConfig'] & {}

export type NodeBasicConfig = CommonReturn<
  '/v1/cdnnode/nodes/{node_id}/basic-config',
  'get'
>['info'] & {}
