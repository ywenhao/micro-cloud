import { isNil } from 'lodash-es'
import type { Ref } from 'vue'

type Time = number | undefined
export type TimeRange = [hour: Time, minute: Time, second: Time]

/**
 * 秒转时间
 * @param second 秒
 * @returns
 */
export function getTimeBySecond(second?: number): TimeRange {
  if (isNil(second)) return [undefined, undefined, undefined]
  const minute = Math.floor(second / 60)
  const hour = Math.floor(minute / 60)
  const h = hour > 0 ? hour : undefined
  const m = minute % 60 <= 0 && h === undefined ? undefined : minute % 60
  const s = ((second * 1000) % (60 * 1000)) / 1000
  return [h, m, s]
}

/**
 * 秒转换为时长字符串
 * @param second 秒
 * @param isEnUnit 是否英文单位
 * @returns
 */
export function getStrBySecond(second: number, isEnUnit = false): string {
  if (!second) return '-'
  const unit = isEnUnit ? ['h', 'm', 's'] : ['时', '分', '秒']
  const [hour, minute, sec] = getTimeBySecond(second)
  return `${hour ? hour + unit[0] : ''}${minute ? minute + unit[1] : ''}${
    !isNil(sec) ? sec + unit[2] : ''
  }`
}

export function getUnix(value: TimeRange): number {
  const [hour, minute, second] = value
  return (hour ?? 0) * 3600 + (minute ?? 0) * 60 + (second ?? 0)
}

type MinMax = [min: number, max: number]
type Values = [Ref<undefined | number>, Ref<undefined | number>]

/**
 * 输入框限制短边,长边min,max
 */
export function getMinMax(values: Values, arr1: MinMax, arr2: MinMax) {
  const first = values[0].value
  const second = values[1].value
  const shortArr = arr1[1] > arr2[1] ? arr2 : arr1
  const longArr = arr1[1] > arr2[1] ? arr1 : arr2

  // 没有输入默认都是长边
  if (isNil(first) && isNil(second)) return [longArr, longArr]
  // 输入了第二个,第一个默认是短边
  if (isNil(first) && !isNil(second)) {
    return [shortArr, longArr]
  }
  // 输入了第一个,第二个默认是短边
  if (!isNil(first) && isNil(second)) {
    return [longArr, shortArr]
  }
  // 都输入了,判断哪个是短边
  if (!isNil(first) && !isNil(second)) {
    return first < second ? [shortArr, longArr] : [longArr, shortArr]
  }
  return [longArr, longArr]
}
