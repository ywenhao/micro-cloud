import type { VcFilterBarScheme } from 'vc-material'

export const scheme: VcFilterBarScheme = {
  widgets: [
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
      attrs: {
        placeholder: '请输入预设名称'
      }
    }
  ]
}
