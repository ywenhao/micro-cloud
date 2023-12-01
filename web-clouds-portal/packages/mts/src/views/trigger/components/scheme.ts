import type { VcFilterBarScheme } from 'vc-material'

export const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'status',
      widget: 'select',
      attrs: {
        defaultValue: '',
        options: [
          { label: '全部状态', value: '' },
          { label: '已启用', value: 1 },
          { label: '已禁用', value: 2 }
        ],
        placeholder: '请选择状态'
      }
    },
    {
      field: 'queue_id',
      widget: 'select',
      defaultValue: '',
      attrs: {
        options: [{ label: '全部队列', value: '' }]
      }
    },
    {
      field: 'name',
      widget: 'input-icon',
      attrs: {
        placeholder: '请输入触发器名称'
      }
    }
  ]
}
