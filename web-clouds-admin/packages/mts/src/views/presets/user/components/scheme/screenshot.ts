import type { VcFilterBarScheme } from 'vc-material'

export const scheme: VcFilterBarScheme = {
  widgets: [
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
      field: 'screenshot_type',
      widget: 'select',
      defaultValue: '',
      attrs: {
        options: [
          { label: '全部类型', value: '' },
          { label: '单张截图', value: 1 },
          { label: '多张截图', value: 2 }
        ]
      }
    },
    {
      field: 'name',
      widget: 'input-icon',
      attrs: { placeholder: '请输入预设名称' }
    },
    {
      field: 'user_id',
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
