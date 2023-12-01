import type { VcFilterBarScheme } from 'vc-material'

export const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'keywords',
      widget: 'combo-input',
      attrs: {
        defaultSelected: 'addr_keyword',
        options: [
          { label: '服务器地址', value: 'addr_keyword' },
          { label: '备注', value: 'remark_keyword', maxLength: 20 }
        ]
      }
    }
  ]
}
