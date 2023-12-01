import type { VcFilterBarScheme } from 'vc-material'

export const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'name_keyword',
      widget: 'input-icon',
      attrs: {
        placeholder: '请输入组名',
        maxLength: 20
      }
    }
  ]
}
