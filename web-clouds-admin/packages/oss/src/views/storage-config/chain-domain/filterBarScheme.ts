import type { VcFilterBarScheme } from 'vc-material'
const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'usage_type',
      widget: 'select',
      defaultValue: 0,
      attrs: {
        placeholder: '请选择',
        options: [
          { value: 0, label: '全部范围' },
          { value: 3, label: '用户空间' },
          { value: 1, label: '区域' }
        ]
      }
    },
    {
      field: 'keywords',
      widget: 'combo-input',
      attrs: {
        defaultSelected: 'name_keyword',
        options: [
          {
            label: '域名 ',
            value: 'name_keyword',
            placeholder: '请输入域名',
            maxLength: 128
          },
          {
            label: '备注',
            value: 'remark_keyword',
            placeholder: '请输入备注',
            maxLength: 128
          }
        ],

        placeholder: '请输入',
        width: 227
      }
    }
  ]
}
export default filterBarScheme
