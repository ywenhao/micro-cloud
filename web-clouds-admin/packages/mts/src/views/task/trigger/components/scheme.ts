import type { VcFilterBarScheme } from 'vc-material'

export const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'region_id',
      widget: 'select',
      attrs: {
        defaultValue: '',
        options: [],
        placeholder: '请选择区域'
      }
    },
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
        placeholder: '请选择队列',
        options: [{ label: '全部队列', value: '' }]
      }
    },
    {
      field: 'name',
      widget: 'input-icon',
      attrs: { placeholder: '请输入触发器名称' }
    },
    {
      field: 'user_id',
      widget: 'input-number',
      attrs: {
        placeholder: '请输入用户ID',
        precision: 0,
        step: 1,
        min: 1,
        hideButton: true,
        parser(value: string) {
          return value.slice(0, 9)
        }
      }
    }
  ]
}
