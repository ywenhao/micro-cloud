import type { VcFilterBarScheme, VcSelectOptions } from 'vc-material'

const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'range',
      widget: 'range',
      attrs: {
        valueFormat: 'X'
      }
    },
    {
      field: 'status',
      widget: 'select',
      defaultValue: 0,
      attrs: {
        placeholder: '请选择',
        options: [
          { label: '全部站点状态', value: 0 },
          { label: '有效', value: 1 },
          { label: '暂停', value: 2 }
        ] as VcSelectOptions
      }
    },
    {
      field: 'keyword',
      widget: 'input-icon',
      attrs: {
        placeholder: '请输入站点'
      }
    }
  ]
}

export default filterBarScheme
