import type { CommonReturn, CommonReturnListItem } from '../../_utils'

export type NodeWafRuleModel = CommonReturn<
  '/v1/cdn/site/waf-rule/{site_id}/{rule_id}',
  'get'
> & {}

export type PageRulesModel = Required<
  CommonReturnListItem<'/v1/cdn/site/page-rule/{site_id}', 'get'>
>

export type PageRuleModel = CommonReturnListItem<
  '/v1/cdn/site/page-rule/{site_id}',
  'get'
>['rule'] & {}
