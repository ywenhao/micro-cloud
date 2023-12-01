import type { VcFilterBarScheme } from 'vc-material'

const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'keywords',
      widget: 'combo-input',
      attrs: {
        defaultSelected: 'name',
        options: [
          { label: '域名', value: 'name', placeholder: '请输入域名' },
          { label: '用户', value: 'user_id', placeholder: '请输入用户' }
        ],
        width: 227
      }
    }
  ]
}

export default filterBarScheme
