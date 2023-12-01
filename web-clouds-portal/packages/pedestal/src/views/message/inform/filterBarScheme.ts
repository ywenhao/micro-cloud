import type { VcFilterBarScheme } from 'vc-material'

export const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'status',
      widget: 'select',
      defaultValue: 0,
      attrs: {
        placeholder: '请选择状态',
        options: [
          { value: 0, label: '全部状态' },
          { value: 1, label: '已读' },
          { value: 2, label: '未读' }
        ]
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
