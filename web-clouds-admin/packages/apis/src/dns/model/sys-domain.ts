import type { CommonReturn } from '..'

export type SysDomainModel = CommonReturn<
  '/v1/dns/system/domain',
  'get'
>['info']
