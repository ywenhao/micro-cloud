import type { VcFilterBarScheme } from 'vc-material'

export const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'range',
      widget: 'range',
      attrs: {
        disabledDate,
        valueFormat: 'X'
      }
    },
    {
      field: 'region_id',
      widget: 'select',
      attrs: {
        defaultValue: '',
        options: [],
        placeholder: '请选择区域'
      }
    },
    {
      field: 'queue_id',
      widget: 'select',
      defaultValue: '',
      attrs: {
        placeholder: '请选择队列',
        options: [{ label: '全部队列', value: '' }]
      }
    },
    {
      field: 'workflow_name',
      widget: 'input-icon',
      attrs: { placeholder: '请输入工作流名称' }
    },
    {
      field: 'user',
      widget: 'input-number',
      attrs: {
        placeholder: '请输入用户ID',
        precision: 0,
        step: 1,
        min: 1,
        hideButton: true,
        parser(value: string) {
          return value.slice(0, 9)
        }
      }
    }
  ]
}
