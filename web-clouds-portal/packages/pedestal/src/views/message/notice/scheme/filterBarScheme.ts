import type { VcFilterBarScheme } from 'vc-material'

export const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'keywords',
      widget: 'combo-input',
      attrs: {
        defaultSelected: 'title',
        options: [
          { label: '公告标题', value: 'title' },
          { label: '公告内容', value: 'content' }
        ]
      }
    }
  ]
}
