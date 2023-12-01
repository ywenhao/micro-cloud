import type { VcFilterBarScheme } from 'vc-material'

export const scheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'watermark_type',
      widget: 'select',
      defaultValue: '',
      attrs: {
        options: [
          { label: '全部类型', value: '' },
          { label: '图片水印', value: 1 },
          { label: '文字水印', value: 2 }
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
