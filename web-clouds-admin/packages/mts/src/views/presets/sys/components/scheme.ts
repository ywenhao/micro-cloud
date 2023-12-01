import type { VcFilterBarScheme } from 'vc-material'

export const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'name',
      widget: 'input-icon',
      attrs: {
        placeholder: '请输入预设名称'
      }
    }
  ]
}
