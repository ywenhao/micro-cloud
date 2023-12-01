<template>
  <div class="location-box">
    <div
      class="location-button"
      v-for="item in watermarkLocationOpts"
      :key="item.label"
      :class="{ active: item.value === active }"
      @click="active = item.value"
    >
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watermarkLocationOpts } from '@/utils/opts/preset'

type IValue = (typeof watermarkLocationOpts)[number]['value']

const props = defineProps<{
  modelValue: IValue | any
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const active = useVModel(props, 'modelValue', emit)
</script>

<style lang="less" scoped>
.location-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  user-select: none;
}

.location-button {
  display: grid;
  margin: 0 -1px -1px 0;
  width: 76px;
  height: 40px;
  font-size: 14px;
  color: var(--color-text-1);
  border: 1px solid var(--color-border-2);
  place-content: center;
  font-weight: 400;
  cursor: pointer;

  &.active {
    z-index: 1;
    color: rgba(var(--primary-6));
    background: rgba(var(--primary-1));
    border-color: rgba(var(--primary-6));
  }

  &:nth-child(1) {
    border-top-left-radius: 6px;
  }

  &:nth-child(3) {
    border-top-right-radius: 6px;
  }

  &:nth-child(7) {
    border-bottom-left-radius: 6px;
  }

  &:nth-child(9) {
    border-bottom-right-radius: 6px;
  }
}
</style>
