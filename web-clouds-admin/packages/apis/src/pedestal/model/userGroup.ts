import type { CommonReturn } from '../../_utils'
export interface Privileges {
  /** cdn权益 */
  cdn: {
    /**
     * 可创建站点数 [1-1000]
     * Format: int64
     */
    max_site_count: number
    /**
     * 带宽限速 单位:Mbps [1-1000]
     * Format: int64
     */
    speed_limit: number
  }
  /** dns权益 */
  dns: {
    /**
     * 可添加域名数量 [1-1000000]
     * Format: int64
     */
    max_domain_count: number
    /**
     * 单个域名解析记录数量 [1-1000000]
     * Format: int64
     */
    max_rr_count_per_domain: number
  }
  /** 转码权益 */
  mts: {
    /** 时长单位 */
    interval_unit: 0 | 1 | 2
    /**
     * 可转码视频时长 [1-1000000]
     * Format: int64
     */
    max_video_duration: number
    /** 可转码视频时长 */
    max_video_duration_unit: 0 | 1 | 2 | 3
    /**
     * 可截图次数 [1-1000000]
     * Format: int64
     */
    max_screenshot_times: number
  }
  /** 存储权益 */
  oss: {
    /**
     * 最大存储空间 [1-1024]
     * Format: int64
     */
    max_storage_space: number
    /** 最大存储空间单位 */
    storage_space_unit: 0 | 1 | 2 | 3
    /**
     * 可创建空间数 [1-1000]
     * Format: int64
     */
    max_bucket_count: number
  }
  /** 证书权益 */
  ssl: {
    /**
     * 可申请证书数量 [0-999999] 0 代表不限制
     * Format: int64
     */
    max_certificate_count: number
    /**
     * 可申请域名数量 [0-999999] 0 代表不限制
     * Format: int64
     */
    max_domain_count: number
  }
}
export type UserGroupModel = {
  /**
   * 分组id
   * Format: int64
   * @example 111100000111
   */
  id: string
  /**
   * 分组名称
   * @example 分组1
   */
  name: string
  /**
   * 备注
   * @example 备注信息2
   */
  remark?: string
  /**
   * 排序序号
   * Format: int32
   */
  sort_number: number
  /**
   * 默认分组{1:默认，2:自定义创建}
   * Format: int32
   */
  is_default?: number
  /**
   * 关联用户数量
   * Format: int64
   */
  user_count?: string
  /**
   * 创建日期
   * Format: int64
   */
  created_at?: string
  /**
   * 更新时间
   * Format: int64
   */
  updated_at?: string
  /**
   * 操作时间
   * Format: int64
   */
  operated_at?: string

  /** oss权益 */
  oss_privilege: Privileges['oss']
  /** 证书权益 */
  ssl_privilege: Privileges['ssl']
  /** cdn权益 */
  cdn_privilege: Privileges['cdn']
  /** 云转码权益 */
  mts_privilege: Privileges['mts']
  /** dns权益 */
  dns_privilege: Privileges['dns']
}
export type UserGroupBenefits = CommonReturn<'/v1/user/group', 'get'> & {}
