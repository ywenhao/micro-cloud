<template>
  <a-tooltip
    v-if="content && content.length > 20"
    trigger="hover"
    position="top"
    :content="content"
  >
    <span class="domain-content">
      {{ content.substring(0, 15) + '...' }}
    </span>
  </a-tooltip>
  <span v-else>{{ content }}</span>
</template>

<script setup lang="ts">
defineProps<{
  content: string
}>()
</script>
<style lang="less" scoped>
.domain-text {
  display: inline-block;
  cursor: pointer;
  color: var(--color-text-1);
}
</style>
