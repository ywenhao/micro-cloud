<template>
  <div class="text-sm text-ct-3">启用地理标头</div>
</template>

<script setup lang="ts">
import type { RuleValue } from './types'

export interface IEmit {
  (event: 'update:modelValue', value: RuleValue): void
}

export interface IProps {
  modelValue: RuleValue
}

const emit = defineEmits<IEmit>()
defineProps<IProps>()

emit('update:modelValue', true)
</script>
