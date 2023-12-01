export interface CompressConfig {
  compress: {
    content: string[]
    rank: number
    min_size: string
    max_size: string
  }
}

export interface CacheRule {
  rule_id?: string
  rule: {
    id?: string
    name: string
    file_ext: string
    ttl: number
    ttl_unit: number
  }
}
