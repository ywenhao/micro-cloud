<template>
  <div class="flex items-center justify-center h-full bg-white rounded-2px">
    <vc-svg-icon name="404" :width="300" :height="240"></vc-svg-icon>
    <div class="flex flex-col items-start">
      <h1 class="m-0 mb-2">404</h1>
      <p class="m-0 mb-[50px]">非常抱歉，您访问的页面不存在</p>
      <a-button type="primary" @click="$router.replace('/')">返回首页</a-button>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
