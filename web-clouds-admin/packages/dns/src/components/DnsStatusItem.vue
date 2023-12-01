<template>
  <a-tag :class="`is-${type}`" class="cursor-pointer">
    <span>{{ text }}</span>
    <vc-svg-icon
      :size="16"
      class="icon ml-2px"
      prefix="dns"
      name="warning-outline"
      v-if="type === 'warning'"
    />
  </a-tag>
</template>

<script setup lang="ts">
defineProps<{
  type: '' | 'success' | 'warning' | 'danger' | 'info'
  text: string
}>()
</script>
