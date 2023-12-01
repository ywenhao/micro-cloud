<script setup lang="ts">
import type { AlarmConfigNotification } from '@vca/apis/pedestal'
import { get, set } from 'lodash-es'

const switches = [
  {
    title: '云存储 OSS',
    key: 'oss_alarm',
    items: [
      { label: '区域健康状态变更', filed: 'oss_region_health_abnormal' },
      { label: '区域物理机器离线', filed: 'oss_region_host_offline' },
      { label: '区域管理节点离线', filed: 'oss_region_host_mgr_offline' },
      {
        label: '区域OSD硬盘空间即将耗尽',
        filed: 'oss_region_osd_disk_space'
      },
      {
        label: '区域物理机器CPU使用过高',
        filed: 'oss_region_host_cpu_used'
      },
      {
        label: '区域物理机器内存使用过高',
        filed: 'oss_region_host_memory_used'
      },
      { label: '区域带宽过高', filed: 'oss_region_bandwidth' },
      { label: '存储服务异常', filed: 'oss_service_abnormal' }
    ]
  },
  {
    title: '云转码 MTS',
    key: 'mts_alarm',
    items: [
      { label: '节点硬盘空间即将耗尽', filed: 'mts_node_disk_space' },
      { label: '节点内存使用过高', filed: 'mts_node_memory_used' },
      { label: '节点CPU使用过高', filed: 'mts_node_cpu_used' },
      { label: '节点离线', filed: 'mts_node_offline' },
      { label: '转码服务异常', filed: 'mts_service_abnormal' }
    ]
  },
  {
    title: '云解析 DNS',
    key: 'dns_alarm',
    items: [
      { label: '节点CPU使用过高', filed: 'dns_node_cpu_used' },
      { label: '节点内存使用过高', filed: 'dns_node_memory_used' },
      { label: '节点离线', filed: 'dns_node_offline' },
      { label: 'DNS服务异常', filed: 'dns_service_abnormal' }
    ]
  },
  {
    title: '云分发 CDN',
    key: 'cdn_alarm',
    items: [
      { label: '节点硬盘空间即将耗尽', filed: 'cdn_node_disk_space' },
      { label: '节点CPU使用过高', filed: 'cdn_node_cpu_used' },
      { label: '节点内存使用过高', filed: 'cdn_node_memory_used' },
      { label: '节点离线', filed: 'cdn_node_offline' },
      { label: '节点被大量攻击', filed: 'cdn_node_waf' },
      { label: '云分发 CDN 服务异常', filed: 'cdn_service_abnormal' }
    ]
  },

  {
    title: 'SSL 证书',
    key: 'ssl_alarm',
    items: [
      {
        label: '第三方证书密钥错误',
        filed: 'ssl_key_error'
      },
      {
        label: '第三方证书服务异常',
        filed: 'ssl_call_third_exception'
      },
      { label: '证书服务异常', filed: 'ssl_service_abnormal' }
    ]
  }
]

const formState = defineModel<AlarmConfigNotification>({ required: true })
</script>
<template>
  <vc-card
    title="告警通知开关"
    description="关闭后，Telegram和邮箱将不会收到对应的告警消息。"
  >
    <div class="switch-card" v-for="block in switches" :key="block.key">
      <div class="switch-card__header">{{ block.title }}</div>
      <section class="switch-card__body">
        <div v-for="item in block.items" :key="item.filed">
          <a-switch
            :checked-value="1"
            :unchecked-value="2"
            @update:model-value="
              value => set(formState!, [block.key, item.filed], Number(value))
            "
            :model-value="get(formState, [block.key, item.filed])"
          >
          </a-switch>
          <span class="pl-2">{{ item.label }}</span>
        </div>
      </section>
    </div>
  </vc-card>
</template>

<style scoped lang="less">
.switch-card {
  @apply pb-6;
  border-bottom: 1px dotted var(--color-border-2, #f2f3f5);
  &__header {
    @apply mt-0 mb-4 text-ct-1 text-sm font-medium leading-20px;
  }
  &__body {
    @apply grid grid-cols-2 gap-x-20 gap-y-4 max-w-536px;
  }
  & + .switch-card {
    @apply mt-6;
  }
}
</style>
