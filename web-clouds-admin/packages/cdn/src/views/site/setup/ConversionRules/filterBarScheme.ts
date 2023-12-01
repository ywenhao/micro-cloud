import type { VcFilterBarScheme } from 'vc-material'

const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'rage',
      widget: 'range',
      attrs: {
        valueFormat: 'X'
      }
    },
    {
      field: 'keyword',
      widget: 'input-icon',
      attrs: {
        placeholder: '请输入规则名称'
      }
    }
  ]
}
export default filterBarScheme
