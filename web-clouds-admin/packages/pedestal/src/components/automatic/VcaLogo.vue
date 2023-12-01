<template>
  <a-image :width="26" :height="26" :preview="false">
    <template #loader>
      <a-spin loading>
        <vc-svg-icon name="image-placeholder" />
      </a-spin>
    </template>
    <template #error>
      <vc-svg-icon name="image-error" />
    </template>
  </a-image>
</template>

<script setup lang="ts"></script>
