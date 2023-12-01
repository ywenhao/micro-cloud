import type {
  CommonParams,
  CommonReturn,
  CommonReturnListItem
} from '../../_utils'

export type SiteList = CommonReturnListItem<'/v1/cdn/site', 'get'>

export type BasicInfo = CommonReturn<'/v1/cdn/site/{site_id}', 'get'>

export type CertificateParams = CommonParams<
  '/v1/sites/{site_id}/certificates/edges',
  'get'
>
export type RegionListItem = CommonReturnListItem<
  '/v1/cdn/resolv/regions',
  'get'
>

export type SourceConfig = CommonParams<
  '/v1/cdn/site/origin-config/{site_id}',
  'put'
> & { backOrigin: number }

export type protocolConfig = CommonParams<
  '/v1/cdn/site/ssl-config/{site_id}',
  'put'
>

export type CertificateInfo = CommonReturn<
  '/v1/sites/{site_id}/certificates/edges',
  'get'
>

export type CertListItem = CommonReturnListItem<
  '/v1/sites/{site_id}/certificates/edge-apis',
  'get'
> & {}

export type WafRuleItem = CommonReturnListItem<
  '/v1/cdn/site/waf-rule/{site_id}',
  'get'
>

export type PresetRuleItem = CommonReturnListItem<
  '/v1/cdn/site/manage-rule/{site_id}/{rule_type}',
  'get'
>

export type ConversionRuleItem = CommonReturnListItem<
  '/v1/cdn/site/transform-rule/{site_id}',
  'get'
>
