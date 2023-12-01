const SPACE_ROLE = [
  { value: '', label: '全部权限' },
  { value: 'private', label: '私有' },
  { value: 'public-read', label: '公开' }
]
const SPACE_FILTER_LABEL = [
  { label: '空间名称', value: 'symbol' },
  { label: '标签', value: 'label' }
]
import type { VcFilterBarScheme } from 'vc-material'
const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'acl',
      widget: 'select',
      defaultValue: '',
      attrs: {
        placeholder: '请选择',
        options: SPACE_ROLE,
        width: 136
      }
    }
  ]
}
export { filterBarScheme, SPACE_FILTER_LABEL }
