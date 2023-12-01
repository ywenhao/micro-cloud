import type { VcFilterBarScheme } from 'vc-material'
const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'document_type',
      widget: 'select',
      defaultValue: 0,
      attrs: {
        placeholder: '请选择',
        options: [
          { value: 0, label: '全部分类' },
          { value: 1, label: '产品文档' },
          { value: 2, label: '常见问题' }
        ]
      }
    }
  ]
}
export default filterBarScheme
