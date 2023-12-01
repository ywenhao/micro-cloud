import type { CommonReturn, CommonReturnListItem } from '../../_utils'

export type OverviewOnline = CommonReturn<
  '/v1/manage/statistic/overview/online',
  'get'
>

export type OverviewGeneral = CommonReturn<
  '/v1/manage/statistic/overview/general',
  'get'
>
export type RegistrationGeneral = CommonReturn<
  '/v1/manage/statistic/new-registration/general',
  'get'
>
export type NewRegistrationRegion = CommonReturnListItem<
  '/v1/manage/statistic/new-registration/region',
  'get'
>
export type PvGeneral = CommonReturnListItem<
  '/v1/manage/statistic/pu/general',
  'get'
>
export type StatisticKeepTrend = {
  /**
   * 时间戳
   * Format: int64
   * @example 1664362800
   */
  tm?: number
  /**
   * 新增注册数
   * Format: int64
   * @example 200
   */
  nuv?: number
  /**
   * 次日留存数
   * Format: int64
   * @example 9578310
   */
  keep1?: number
  /**
   * 次日留存率(保留两位小数)
   * Format: float
   * @example 23.11
   */
  keep_rate1?: number
  /**
   * 3日留存数
   * Format: int64
   * @example 9578310
   */
  keep3?: number
  /**
   * 3日留存率(保留两位小数)
   * Format: float
   * @example 23.11
   */
  keep_rate3?: number
  /**
   * 7日留存数
   * Format: int64
   * @example 9578310
   */
  keep7?: number
  /**
   * 7日留存率(保留两位小数)
   * Format: float
   * @example 23.11
   */
  keep_rate7?: number
  /**
   * 15日留存数
   * Format: int64
   * @example 9578310
   */
  keep15?: number
  /**
   * 15日留存率(保留两位小数)
   * Format: float
   * @example 23.11
   */
  keep_rate15?: number
}
