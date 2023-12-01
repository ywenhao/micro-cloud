import { IconSearch } from '@arco-design/web-vue/es/icon'
import type { VcFilterBarScheme } from 'vc-material'
const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'title',
      widget: 'input',
      attrs: {
        placeholder: '请输入文档标题'
      },
      slots: {
        // @ts-ignore
        suffix: () => <IconSearch />
      }
    }
  ]
}
export default filterBarScheme
