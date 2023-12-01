import type { VcFilterBarScheme } from 'vc-material'

export const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'sub_product_type',
      widget: 'select',
      defaultValue: '',
      attrs: {
        triggerProps: { autoFitPopupMinWidth: true },
        placeholder: '请选择子产品',
        options: [{ value: '', label: '全部子产品' }]
      }
    },
    {
      field: 'keywords',
      widget: 'combo-input',
      attrs: {
        defaultSelected: 'name_keyword',
        options: [
          { label: '域名', value: 'name_keyword', maxLength: 253 },
          { label: '备注', value: 'remark_keyword', maxLength: 20 }
        ]
      }
    }
  ]
}
