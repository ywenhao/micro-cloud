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
      field: 'nodes',
      widget: 'select',
      attrs: {
        placeholder: '全部节点'
      }
    }
  ]
}
