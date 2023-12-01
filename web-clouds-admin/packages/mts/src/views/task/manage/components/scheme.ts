import type { VcFilterBarScheme } from 'vc-material'

export const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'range',
      startField: 'begin_time',
      endField: 'end_time',
      widget: 'range',
      attrs: {
        disabledDate,
        valueFormat: 'X'
      }
    },
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
          { label: '排队中', value: 2 },
          { label: '处理中', value: 3 },
          { label: '成功', value: 4 },
          { label: '失败', value: 5 }
        ],
        placeholder: '请选择状态'
      }
    },
    {
      field: 'node_id',
      widget: 'select',
      defaultValue: '',
      attrs: {
        placeholder: '请选择节点',
        options: []
      }
    },
    {
      field: 'keywords',
      widget: 'combo-input',
      attrs: {
        defaultSelected: 'user_id',
        options: [
          { label: '所属用户', value: 'user_id', placeholder: '请输入用户ID' },
          { label: '任务名称', value: 'name' },
          { label: '队列', value: 'queue_name' }
        ]
      }
    }
  ]
}
