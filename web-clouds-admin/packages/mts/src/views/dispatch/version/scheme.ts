import type { VcFilterBarScheme } from 'vc-material'

export const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'version',
      widget: 'input-icon',
      attrs: {
        placeholder: '请输入版本号'
      }
    }
  ]
}
