<template>
  <table-tips icon="help" :light="light" :data="data" title="">
    <slot />
  </table-tips>
</template>

<script setup lang="ts">
import TableTips from './TableTips.vue'

defineProps<{
  light?: boolean
}>()

const data = [
  {
    title: '主机记录就是域名前缀，常见用法有：',
    list: [
      { label: 'www', value: '解析后的域名为www.example.com。' },
      { label: '@', value: '直接解析主域名 example.com。' },
      { label: '*', value: '泛解析，匹配其他所有域名 *.example.com。' },
      {
        label: 'mail',
        value: '将域名解析为mail.example.com，通常用于解析邮箱服务器。'
      },
      { label: '二级域名', value: '如：abc.example.com，填写abc。' },
      { label: '手机网站', value: '如：m.example.com，填写m。' }
    ]
  }
]
</script>
