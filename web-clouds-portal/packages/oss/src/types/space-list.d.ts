export interface DataSource {
  id: string
  name?: string
  acl?: string
  remark?: string
  region_id?: string
  created_at?: string | number
  updated_at?: string | number
  user_id?: string
}

export interface TabsData {
  title: string
  value?: string | number
  id?: string
}
