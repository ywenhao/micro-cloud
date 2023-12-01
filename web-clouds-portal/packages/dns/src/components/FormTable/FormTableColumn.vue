<template>
  <div
    class="form-table__td"
    :class="props.class"
    :style="{ width: getWidth(props.width) }"
  >
    <slot v-bind="slotData"></slot>
  </div>
</template>

<script setup lang="ts">
import { getWidth, useFormTableColumn } from './useFormTable'

interface IProps {
  prop: string
  label?: string
  class?: string
  width?: number | string
}

const props = defineProps<IProps>()

const result = useFormTableColumn(props)

const slotData = computed(() => {
  const columnIndex = result.columnIndex
  return {
    column: result.getColumn(columnIndex)
  }
})
</script>
