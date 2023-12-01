export type RuleType =
  | 'edge_cache_ttl'
  | 'cache_level'
  | 'disable_security'
  | 'disable_perf'
  | 'browser_ttl'
  | 'forwarding_url'
  | 'auto_minify'
  | 'ip_geolocation_header'
  | 'true_client_ip'
  | 'always_https'
  | ''

export type Value = string | number | boolean | string[] | number[] | null

export type ObjectValue = { [key: string]: Value }

export type RuleValue = Value | ObjectValue

export interface RuleData {
  uuid: string
  type: RuleType
  value: RuleValue
}
