<template>
  <div class="text-sm text-ct-3">针对此URL实施HTTPS</div>
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
