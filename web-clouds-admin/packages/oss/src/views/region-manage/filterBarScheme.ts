import type { VcFilterBarScheme } from 'vc-material'
const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'name',
      widget: 'input-icon',
      attrs: {
        placeholder: '请输入区域名',
        maxLength: 20
      }
    }
  ]
}
export default filterBarScheme
