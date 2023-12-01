import type { VcFilterBarScheme } from 'vc-material'

export const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'region_id',
      widget: 'select',
      attrs: {
        placeholder: '全部区域'
      }
    },
    {
      field: 'name',
      widget: 'input-icon',
      attrs: {
        placeholder: '请输入名称'
      }
    }
  ]
}
