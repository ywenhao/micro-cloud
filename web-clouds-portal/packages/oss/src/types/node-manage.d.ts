export interface NodeStatistic {
  name: string
  title: string
  value: string | number
  unit?: string
  percent?: number
}

export interface StatisticData {
  total_num?: string
  total_kb?: string
  used_kb?: string
}

export interface ByteConverNode {
  value: string | number
  symbols?: sring
  unit?: string
}

export interface DataSource {
  id: string
  ip: string
  region_id: string
  total_kb: string
  used_kb: string
  created_at: string
  status: number
}
