import type { VcFilterBarScheme } from 'vc-material'
const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'keywords',
      widget: 'combo-input',
      attrs: {
        defaultSelected: 'name_keyword',
        placeholder: '请输入',
        options: [
          { label: '分组名称', value: 'name_keyword' },
          { label: '备注', value: 'remark_keyword' }
        ]
      }
    }
  ]
}
export default filterBarScheme
