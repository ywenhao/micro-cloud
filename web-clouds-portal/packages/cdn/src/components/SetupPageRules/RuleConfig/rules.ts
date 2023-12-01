import type { RuleType } from './types'

export const ruleList: LabelValue<RuleType>[] = [
  { label: '节点缓存TTL', value: 'edge_cache_ttl' },
  { label: '缓存级别', value: 'cache_level' },
  { label: '禁用安全性', value: 'disable_security' },
  { label: '禁用性能', value: 'disable_perf' },
  { label: '浏览器缓存TTL', value: 'browser_ttl' },
  { label: '转发URL', value: 'forwarding_url' },
  { label: '性能优化', value: 'auto_minify' },
  { label: 'IP地理位置标头', value: 'ip_geolocation_header' },
  { label: '真实客户端IP标头', value: 'true_client_ip' },
  { label: '始终使用HTTPS', value: 'always_https' }
]
