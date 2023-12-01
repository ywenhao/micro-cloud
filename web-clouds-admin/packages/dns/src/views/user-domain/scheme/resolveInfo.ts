import { valuePlaceholderOpts, type VcFilterBarScheme } from 'vc-material'

export const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'type',
      widget: 'select',
      defaultValue: '',
      attrs: {
        triggerProps: { autoFitPopupMinWidth: true },
        placeholder: '请选择记录类型',
        options: [
          { label: '全部类型', value: '' },
          ...valuePlaceholderOpts.map(v => ({
            label: v.value,
            value: v.value
          }))
        ]
      }
    },
    {
      field: 'keywords',
      widget: 'combo-input',
      attrs: {
        defaultSelected: 'name_keyword',
        options: [
          { label: '主机记录', value: 'name_keyword' },
          { label: '记录值', value: 'value_keyword' }
        ]
      }
    }
  ]
}
