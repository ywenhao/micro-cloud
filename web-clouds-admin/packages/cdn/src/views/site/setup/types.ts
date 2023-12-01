export interface ListData {
  rule_id: string
  priority: number
  name: string
  match_rule: string
  match_rule_template: string
  status: number
  operation: number
  is_enable: number
}

export const RR_STATUS: Record<string, string> = {
  '1': '添加中',
  '2': '添加成功',
  '3': '添加失败'
}

export interface NodeItem {
  id: string
  name: string
  ip: string
  rr_id: string
  rr_status: number
  rr_status_desc: string
}
export interface RegionNodesReturn {
  region_id: string
  region_name: string
  nodes: NodeItem[]
}
