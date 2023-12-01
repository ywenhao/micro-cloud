import type { VcFilterBarScheme } from 'vc-material'

export const scheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'custom_type',
      widget: 'select',
      defaultValue: '',
      attrs: {
        placeholder: '请选择类型',
        options: [
          { label: '全部类型', value: '' },
          { label: '系统预设', value: 2 },
          { label: '自定义预设', value: 1 }
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
