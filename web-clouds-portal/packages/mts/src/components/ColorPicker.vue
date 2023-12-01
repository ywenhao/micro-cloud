<template>
  <a-popover trigger="click" position="top">
    <div class="color-pick-input" :class="props.class">
      <span class="cursor-pointer" v-if="!color">请选择颜色</span>
      <span class="color-text" v-if="color">{{ color }}</span>
      <span class="color-bg" v-if="color" />
    </div>
    <template #content>
      <color-picker :color="color" @color-change="handleColorChange" />
    </template>
  </a-popover>
</template>

<script setup lang="ts">
import { ColorPicker } from 'vue-accessible-color-picker'

const props = defineProps<{
  modelValue: string | undefined
  class?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
}>()

const color = useVModel(props, 'modelValue', emit)

function handleColorChange(params: any) {
  const colors = params.colors
  const hex = colors.hex as string
  color.value = hex
}
</script>

<style lang="less" scoped>
.color-pick-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 6px;
  padding-left: 12px;
  width: 100%;
  height: 32px;
  border: 1px solid var(--color-border-2, #e5e6eb);
  border-radius: 6px;
  transition: color 0.1s cubic-bezier(0, 0, 1, 1),
    border-color 0.1s cubic-bezier(0, 0, 1, 1),
    background-color 0.1s cubic-bezier(0, 0, 1, 1);
  cursor: pointer;
  &:hover {
    border-color: rgb(var(--primary-6));
  }
}

.color-text {
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-1, #1d2129);
  font-weight: 400;
  line-height: 20px;
}

.color-bg {
  width: 20px;
  height: 20px;
  background: v-bind(color);
  border-radius: 2px;
}
:deep(.vacp-format-switch-button) {
  margin-top: auto;
}
</style>
