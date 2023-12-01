import type { CommonReturn } from '..'

export type DomainModel = CommonReturn<'/v1/dns/domain', 'get'>

export type DomainGroupModel = CommonReturn<'/v1/dns/domain/group', 'get'>
