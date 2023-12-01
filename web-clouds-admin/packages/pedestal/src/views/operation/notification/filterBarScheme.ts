import type { VcFilterBarScheme } from 'vc-material'

const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'type_id',
      widget: 'select',
      defaultValue: 0,
      attrs: {
        placeholder: '请选择',
        options: []
      }
    },
    {
      field: 'keywords',
      widget: 'combo-input',
      attrs: {
        defaultSelected: 'title',
        options: [
          { label: '消息标题', value: 'title' },
          { label: '消息内容', value: 'content' }
        ]
      }
    }
  ]
}

export default filterBarScheme
