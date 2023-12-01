import dayjs from 'dayjs'

/**
 * 日期禁用
 * @param current 当前时间
 * @returns
 */
export const disabledDate = (current: Date) => {
  if (dayjs(current).isAfter(dayjs())) return true
  if (dayjs(current).isBefore(dayjs().subtract(1, 'year'))) return true
  return false
}
