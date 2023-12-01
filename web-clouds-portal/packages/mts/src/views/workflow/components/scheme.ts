import { disabledDate } from '@vcp/shared'
import type { VcFilterBarScheme } from 'vc-material'

export const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'range',
      widget: 'range',
      startField: 'begin_time',
      endField: 'end_time',
      attrs: {
        valueFormat: 'X',
        disabledDate
      }
    },
    {
      field: 'queue_id',
      widget: 'select',
      defaultValue: '',
      attrs: {
        options: [{ label: '全部队列', value: '' }]
      }
    },
    {
      field: 'name',
      widget: 'input-icon',
      attrs: {
        placeholder: '请输入工作流名称'
      }
    }
  ]
}
