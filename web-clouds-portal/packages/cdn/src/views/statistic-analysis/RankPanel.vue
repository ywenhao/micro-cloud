<template>
  <div class="grid grid-cols-2 gap-4">
    <top-url />
    <top-domain />
    <top-ua />
    <top-referer />
  </div>
</template>

<script setup lang="ts">
import { TopDomain, TopReferer, TopUa, TopUrl } from './rank'
</script>

<style lang="less" scoped>
.vc-card {
  @apply mt-0!;
}
</style>
