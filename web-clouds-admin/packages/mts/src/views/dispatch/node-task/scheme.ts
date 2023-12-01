import type { VcFilterBarScheme } from 'vc-material'

export const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'node_id',
      widget: 'select',
      attrs: {
        placeholder: '全部节点'
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
