import type { TableColumnData } from '@arco-design/web-vue'
import { emptyFormatter } from 'vc-material'

export const columns: TableColumnData[] = [
  {
    dataIndex: 'name',
    title: '名称',
    ellipsis: true,
    tooltip: true,
    render: emptyFormatter
  },
  {
    dataIndex: 'screenshot',
    title: '类型',
    ellipsis: true,
    tooltip: true,
    render({ record }) {
      const type = record.screenshot as number
      if (!type) return '-'
      return +type === 1 ? '单张截图' : '多张截图'
    }
  },
  {
    dataIndex: 'image_w',
    title: '图片尺寸',
    render({ record }) {
      return `${record.image_w}x${record.image_h}`
    }
  },
  {
    dataIndex: 'actions',
    title: '操作',
    width: 200,
    slotName: 'actions'
  }
]
