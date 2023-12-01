import type { VcFilterBarScheme } from 'vc-material'
const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'product_id',
      widget: 'select',
      defaultValue: '0',
      attrs: {
        placeholder: '请选择',
        options: []
      }
    },
    {
      field: 'type_id',
      widget: 'select',
      defaultValue: '0',
      attrs: {
        placeholder: '请选择',
        options: []
      }
    }
  ]
}
export default filterBarScheme
