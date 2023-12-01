import type { VcFilterBarScheme } from 'vc-material'
const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'group_id',
      widget: 'select',
      defaultValue: 0,
      attrs: {
        placeholder: '请选择',
        options: [{ value: 0, label: '全部分组' }]
      }
    },
    {
      field: 'status',
      widget: 'select',
      defaultValue: 0,
      attrs: {
        placeholder: '请选择',
        options: [
          { value: 0, label: '全部状态' },
          { value: 1, label: '启用' },
          { value: 2, label: '禁用' }
        ]
      }
    },
    {
      field: 'keywords',
      widget: 'combo-input',
      attrs: {
        defaultSelected: 'id_keyword',
        options: [
          { label: '用户ID', value: 'id_keyword' },
          {
            label: '用户名',
            value: 'username_keyword'
          }
        ]
      }
    }
  ]
}
export default filterBarScheme
