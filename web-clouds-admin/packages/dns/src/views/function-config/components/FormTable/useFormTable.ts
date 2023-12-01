import type { FieldRule } from '@arco-design/web-vue'
import { isEqual } from 'lodash-es'
interface IProps {
  data: any[]
  rule?: FieldRule
}

export interface Column {
  prop: string
  label?: string
  class?: string
  width?: number | string
}

type FormTableResult = ReturnType<typeof useFormTable>

const FORM_TABLE_KEY = Symbol('FORM_TABLE_KEY')

export function useFormTable(props: IProps) {
  const columns = reactive<Column[]>([])

  const addColumn = (column: Column, index?: number) => {
    if (columns.length && columns.some(v => isEqual(column, v))) return

    if (index !== undefined) columns.splice(index, 0, column)
    else columns.push(column)
  }

  const delColumn = (index: number) => {
    if (index >= 0 && index < columns.length) {
      columns.splice(index, 1)
    }
  }

  const getColumnIndex = (column: Column) =>
    columns.findIndex(v => isEqual(v, column))

  const getColumn = (index: number) => columns[index]

  const getRow = (index: number) => props.data[index]

  onBeforeUnmount(() => {
    columns.length = 0
  })

  const result = reactive({
    columns,
    getRow,
    addColumn,
    getColumn,
    delColumn,
    getColumnIndex
  })
  provide(FORM_TABLE_KEY, result)

  return result
}

export function useFormTableColumn(props: Column) {
  const result = inject(FORM_TABLE_KEY) as FormTableResult
  const { addColumn, getColumnIndex } = result

  addColumn(props)

  const columnIndex = computed(() => getColumnIndex(props))

  return reactive({ ...result, columnIndex })
}

export const getWidth = (width?: number | string) => {
  if (typeof width === 'number') {
    return `${width}px`
  }
  return width
}
