import type { VcFilterBarScheme } from 'vc-material'

export const scheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'video_type',
      widget: 'select',
      defaultValue: '',
      attrs: {
        options: [
          { label: '全部类型', value: '' },
          { label: 'MP4', value: 1 },
          { label: 'FLV', value: 2 }
        ]
      }
    },
    {
      field: 'name',
      widget: 'input-icon',
      attrs: {
        placeholder: '请输入预设名称'
      }
    }
  ]
}
