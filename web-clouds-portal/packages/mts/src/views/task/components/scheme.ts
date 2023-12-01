import { disabledDate } from '@vcp/shared'
import type { VcFilterBarScheme } from 'vc-material'

export const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'range',
      startField: 'begin_time',
      endField: 'end_time',
      widget: 'range',
      attrs: {
        disabledDate,
        valueFormat: 'X'
      }
    },
    {
      field: 'status',
      widget: 'select',
      attrs: {
        defaultValue: '',
        options: [
          { label: '全部状态', value: '' },
          { label: '排队中', value: 2 },
          { label: '处理中', value: 3 },
          { label: '成功', value: 4 },
          { label: '失败', value: 5 }
        ],
        placeholder: '请选择状态'
      }
    },
    {
      field: 'queue_id',
      widget: 'select',
      defaultValue: '',
      attrs: {
        options: [{ label: '全部节点', value: '' }]
      }
    },
    {
      field: 'name',
      widget: 'input-icon',
      attrs: {
        placeholder: '请输入任务名称'
      }
    }
  ]
}
