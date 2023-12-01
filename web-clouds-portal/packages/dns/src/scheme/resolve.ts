import type { VcFilterBarScheme } from 'vc-material'

export const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'group_id',
      widget: 'select',
      defaultValue: '',
      attrs: {
        triggerProps: { autoFitPopupMinWidth: true },
        placeholder: '请选择分组',
        options: [{ value: '', label: '全部分组' }]
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
