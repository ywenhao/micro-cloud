import type { CommonParams, CommonReturn } from '..'

export type ResolveModel = CommonReturn<'/v1/dns/rr', 'get'>

export type RrsItem = Omit<
  NonNullable<CommonParams<'/v1/dns/rrs/batch', 'post'>['rrs']>[number],
  'type'
> & {
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'NS' | 'TXT' | 'CAA'
}
