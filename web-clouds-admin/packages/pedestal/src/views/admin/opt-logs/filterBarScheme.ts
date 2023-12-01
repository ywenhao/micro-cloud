import dayjs from 'dayjs'
import type { VcFilterBarScheme } from 'vc-material'

import { operationLogModuleArray, operationLogTypeArray } from './enum'

const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      widget: 'range',
      field: 'range',
      startField: 'begin_at',
      endField: 'end_at',
      attrs: {
        valueFormat: 'X',
        disabledDate: current => dayjs().isBefore(dayjs(current))
      }
    },
    {
      widget: 'select',
      field: 'type',
      defaultValue: 0,
      attrs: {
        options: operationLogTypeArray
      }
    },
    {
      widget: 'select',
      field: 'module',
      defaultValue: 0,
      attrs: {
        options: operationLogModuleArray
      }
    }
  ]
}
export default filterBarScheme
