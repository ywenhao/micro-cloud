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
      field: 'region_id',
      widget: 'select',
      defaultValue: '0',
      attrs: {
        placeholder: '请选择',
        options: [{ label: '全部区域', value: '0' }] as VcSelectOptions
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
    // {
    //   field: 'keywords',
    //   widget: 'combo-input',
    //   attrs: {
    //     defaultSelected: 'user_id_keyword',
    //     options: [
    //       { label: '用户ID', value: 'user_id_keyword' },
    //       { label: '站点名称', value: 'keyword' }
    //     ],
    //     placeholder: '请输入'
    //   }
    // },
    {
      field: 'keyword',
      widget: 'input-icon',
      attrs: {
        placeholder: '请输入站点名称'
      }
    },
    {
      field: 'user_id_keyword',
      widget: 'input-icon',
      attrs: {
        placeholder: '请输入用户ID'
      }
    }
  ]
}

export default filterBarScheme
