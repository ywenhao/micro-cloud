import type { VcFilterBarScheme } from 'vc-material'
const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'status',
      widget: 'select',
      defaultValue: 0,
      attrs: {
        placeholder: '请选择',
        options: [
          { value: 0, label: '全部状态' },
          { value: 1, label: '启用' },
          { value: 2, label: '禁用' }
        ]
      }
    },
    {
      field: 'keywords',
      widget: 'combo-input',
      attrs: {
        defaultSelected: 'name',
        options: [
          { label: '产品名称', value: 'name' },
          { label: '产品标识', value: 'symbol' }
        ]
      }
    }
  ]
}
export default filterBarScheme
