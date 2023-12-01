import dayjs from 'dayjs'
import { formatUnix } from 'vc-material'

// 判断返回单位
export const judgeUnit = (time: number, timeUnit: string = 'day') => {
  if (timeUnit === 'week') {
    return formatUnix(time, 'HH:mm')
  }
  if (timeUnit === 'month') {
    return formatUnix(time, 'MM-DD')
  }
  return '-'
}

export const diffDate = (begin: number | string, end: number | string) => {
  const date1 = dayjs(formatUnix(Number(begin), 'YYYY-MM-DD'))
  const date2 = dayjs(formatUnix(Number(end), 'YYYY-MM-DD'))
  const diff = date2.diff(date1, 'day', true)

  if (diff < 1) {
    return 'day'
  }
  return 'week'
}
