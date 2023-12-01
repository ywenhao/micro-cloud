import type { VcFilterBarScheme } from 'vc-material'

export const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'product_id',
      widget: 'select',
      defaultValue: '',
      attrs: {
        placeholder: '请选择产品',
        triggerProps: { autoFitPopupMinWidth: true },
        options: [{ value: '', label: '全部产品' }]
      }
    },
    {
      field: 'type_id',
      widget: 'select',
      defaultValue: '',
      attrs: {
        triggerProps: { autoFitPopupMinWidth: true },
        placeholder: '请选择类型',
        options: [{ value: '', label: '全部类型' }]
      }
    },
    {
      field: 'keywords',
      widget: 'combo-input',
      attrs: {
        defaultSelected: 'title',
        options: [{ label: '反馈标题', value: 'title' }]
      }
    }
  ]
}
