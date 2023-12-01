<template>
  <div flex items-center w="full">
    <a-input-number
      :min="0"
      :max="50"
      :precision="0"
      :step="1"
      class="suffix-input-number"
      v-model="time[0]"
      @change="handleChange"
    >
      <template #suffix>
        <a-tag color="gray" class="suffix-tag">时</a-tag>
      </template>
    </a-input-number>
    <a-input-number
      :min="0"
      :max="59"
      :precision="0"
      :step="1"
      class="suffix-input-number ml-16px"
      v-model="time[1]"
      @change="handleChange"
    >
      <template #suffix>
        <a-tag color="gray" class="suffix-tag">分</a-tag>
      </template>
    </a-input-number>
    <a-input-number
      :min="0"
      :max="59"
      :precision="!isSecond ? 3 : 0"
      :step="!isSecond ? 0.001 : 1"
      class="suffix-input-number ml-16px"
      v-model="time[2]"
      @change="handleChange"
    >
      <template #suffix>
        <a-tag color="gray" class="suffix-tag">秒</a-tag>
      </template>
    </a-input-number>
  </div>
</template>

<script setup lang="ts">
import { getTimeBySecond, getUnix, type TimeRange } from '@/utils/time'

const props = withDefaults(
  defineProps<{
    modelValue?: number
    loaded?: boolean
    isSecond?: boolean
  }>(),
  {
    loaded: true
  }
)

const emit = defineEmits<{
  'update:modelValue': []
}>()

const value = useVModel(props, 'modelValue', emit)

const time = ref<TimeRange>([undefined, undefined, undefined])

watchEffect(() => {
  if (props.loaded) {
    time.value = getTimeBySecond(props.modelValue)
  }
})

function handleChange() {
  value.value = getUnix(time.value)
}
</script>
