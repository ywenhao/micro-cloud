<template>
  <div class="dns-status">
    <a-tooltip
      v-if="status === 2"
      position="top"
      class="light dns-status-tooltip"
      content-class="w-500px"
    >
      <dns-status-item :type="statusConfig.type" :text="statusConfig.text" />
      <template #content>
        <slot></slot>
      </template>
    </a-tooltip>
    <dns-status-item
      v-else
      :type="statusConfig.type"
      :text="statusConfig.text"
    />
  </div>
</template>

<script setup lang="ts">
import DnsStatusItem from './DnsStatusItem.vue'

interface IProps {
  status: number
}

interface StatusConfig {
  type: '' | 'success' | 'warning' | 'danger' | 'info'
  text: string
}

const props = defineProps<IProps>()

const statusMap = computed(() => {
  return [
    {
      type: 'success',
      text: '正常'
    },
    {
      type: 'warning',
      text: '异常'
    }
  ]
})

const statusConfig = computed<StatusConfig>(() => {
  return (statusMap.value[props.status - 1] || {
    type: '',
    text: ''
  }) as StatusConfig
})
</script>

<style lang="less">
.dns-status-tooltip {
}
</style>
