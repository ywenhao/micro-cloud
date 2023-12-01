<template>
  <div class="tabs-box">
    <div
      class="tabs-item"
      :class="{ active: item === active }"
      @click="handleClick(item)"
      v-for="item in data"
      :key="item"
    >
      {{ item }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: string[]
  active: string
}>()

const emit = defineEmits<{
  'update:active': [value: string]
}>()

function handleClick(item: string) {
  if (props.active === item) return
  emit('update:active', item)
}
</script>

<style lang="less" scoped>
.tabs-box {
  display: flex;
  align-items: center;
  padding-left: 16px;
  height: 40px;
  font-size: 14px;
  background: var(--color-fill-2, #f2f3f5);
  line-height: 20px;
}

.tabs-item {
  cursor: pointer;
  color: var(--color-text-2, #4e5969);
  font-weight: 400;

  & + .tabs-item {
    margin-left: 32px;
  }

  &.active {
    font-weight: 500;
    position: relative;
    color: rgb(var(--primary-6));

    &::after {
      position: absolute;
      bottom: -5px;
      left: 50%;
      display: inline-block;
      width: 14px;
      height: 3px;
      background-color: rgb(var(--primary-6));
      content: '';
      line-height: 1;
      transform: translateX(-50%);
    }
  }
}
</style>
