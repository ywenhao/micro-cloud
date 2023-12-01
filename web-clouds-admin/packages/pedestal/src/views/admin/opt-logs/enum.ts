import type { SelectOptionData } from '@arco-design/web-vue'

/** 操作类型 [1.添加 2.修改 3.删除 4.批量添加 5.批量删除 6.批量修改]  */
export const operationLogTypeMap = {
  1: '添加 ',
  2: '修改 ',
  3: '删除 ',
  4: '批量添加',
  5: '批量删除',
  6: '批量修改'
}

/** 所属模块 [1.dns系统日志 2.cdn系统日志 3.证书系统日志 4.转码系统日志 5.存储系统日志 6.管理后台]  */
export const operationLogModuleMap = {
  1: 'dns系统日志',
  2: 'cdn系统日志',
  3: '证书系统日志 ',
  4: '转码系统日志 ',
  5: '存储系统日志 ',
  6: '管理后台'
}

const convertToSelectOptions = (
  obj: Record<number, string>,
  defaultLabel = ''
): SelectOptionData[] => {
  const result = Object.keys(obj).map(value => ({
    value: Number(value),
    label: obj[Number(value)]
  }))
  result.unshift({ value: 0, label: defaultLabel })
  return result
}

export const operationLogTypeArray = convertToSelectOptions(
  operationLogTypeMap,
  '全部类型'
)
export const operationLogModuleArray = convertToSelectOptions(
  operationLogModuleMap,
  '全部模块'
)
