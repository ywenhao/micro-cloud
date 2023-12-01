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

//时间戳转化为天时分秒
export const timeInterval = (timestamp: number) => {
  if (timestamp) {
    // 天数
    const day = Math.floor(timestamp / 86400)
    // 小时
    const hr = Math.floor((timestamp % 86400) / 3600)
    // const sec = Math.floor(((timestamp % 86400) % 3600) % 60)
    return timestamp
      ? day || hr
        ? (day ? day + '天' : '') + (hr ? hr + '小时' : '')
        : timestamp + '秒'
      : '-'
  } else {
    return '-'
  }
}

/**
 * 获取传入时间的00:00:00 的时间戳  默认 当前时间
 * @returns
 */
export const getUnixZero = (date?: number) => {
  let dateTime = dayjs(date)
  if (typeof date === 'number') {
    dateTime = dayjs.unix(date)
  }
  return dateTime.set('hour', 0).set('minute', 0).set('second', 0).unix()
}

/**
 * 格式化数字
 * @param {number} number 数字
 * @returns
 */
export const formatNumber = (number: number) => {
  if (Number.isNaN(number)) return '0'
  const str = number.toString()
  return str.toString().replace(/\d+/, n => {
    return n.replace(/(\d)(?=(\d{3})+$)/g, $1 => $1 + ',')
  })
}

export const staCodeNumberFormat = (value: number, flag?: string) => {
  const valueData = Number(value)
  const param = {
    value: '',
    unit: ''
  }
  const k = 10000
  const sizes = ['', '万', '亿', '万亿']
  let i
  if (valueData < k) {
    param.value = valueData.toFixed(0)
    param.unit = ''
  } else {
    i = Math.floor(Math.log(valueData) / Math.log(k))
    param.value = (valueData / k ** i).toFixed(2)
    param.unit = sizes[i]
  }
  return !flag ? { ...param } : `${param.value}${param.unit}`
}

export const getUnix = (
  date?: string | number | Date | dayjs.Dayjs | null | undefined
) => dayjs(date).unix()
