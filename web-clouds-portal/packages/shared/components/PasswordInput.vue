<template>
  <a-input-password
    v-model.trim="value"
    :placeholder="placeholder"
    :type="type"
    :max-length="64"
    :autocomplete="autocomplete"
    @blur="emit('blur')"
  >
  </a-input-password>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface IProps {
  modelValue: string
  placeholder?: string
  autocomplete?: 'off'
  defaultType?: 'password' | 'text'
}
interface IEmits {
  (event: 'blur'): void
  (event: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<IProps>(), {
  placeholder: '请输入密码',
  defaultType: 'password'
})

const type = ref<'password' | 'text'>(props.defaultType)

const emit = defineEmits<IEmits>()

const value = computed({
  get: () => props.modelValue,
  set(val) {
    emit('update:modelValue', val)
  }
})
</script>

<style lang="less" scoped>
:deep(.arco-input-suffix) {
  color: #86909c;
}
</style>
