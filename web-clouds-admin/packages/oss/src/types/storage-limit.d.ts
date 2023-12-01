export interface StorageLimitData {
  id: string
  max_storage_bytes: string
  max_write_bytes: number
  max_read_bytes: number
  effect_at: string | undefined
  max_bucket_num: number
  max_write_ops: number
  max_read_ops: number
}
