<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number
    text?: string
  }>(),
  { size: 80, text: '暂无数据' }
)
</script>

<template>
  <div class="empty-box">
    <div class="empty-content">
      <vc-svg-icon name="empty_search" :size="size" />
      <div class="empty-text">
        <div class="empty-text">
          <slot>{{ text }}</slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import './style.less';
</style>
