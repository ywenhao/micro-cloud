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
          { value: 0, label: '全部类型' },
          { value: 1, label: '启用' },
          { value: 2, label: '禁用' }
        ]
      }
    },
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
export default filterBarScheme
