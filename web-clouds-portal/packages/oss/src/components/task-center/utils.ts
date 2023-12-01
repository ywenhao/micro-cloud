import type { CustomFileItem } from '@/stores/modules/taskCenter'

/**
 * 获取状态
 * @param record
 * @returns
 */
export const getStatus = (record: CustomFileItem) => {
  const status = record.status
  // 进度
  if (status === 'uploading') {
    let progress: number | string = record.progress
    if (![0, 99, 100].includes(progress)) progress = progress.toFixed(2)
    return `${progress}%`
  }
  const statusData = {
    ready: '待处理',
    pause: '待处理',
    // uploading: '处理中',
    error: '失败',
    success: '成功',
    cancel: '已停止'
  }
  return statusData[status as keyof typeof statusData]
}
