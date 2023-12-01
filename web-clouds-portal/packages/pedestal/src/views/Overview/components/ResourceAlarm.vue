<script setup lang="ts">
import { IconRight } from '@arco-design/web-vue/es/icon'
import type { AlarmModel } from '@vcp/apis/pedestal'
import { getAlarmApi } from '@vcp/apis/pedestal'

const data = ref<AlarmModel[]>([])

const getAlarm = () => {
  getAlarmApi().then(res => {
    data.value = res?.list || []
  })
}
onMounted(() => {
  getAlarm()
})

const productMap = {
  3: '云存储 OSS',
  4: '云转码 MTS',
  5: '云分发 CDN',
  6: '云解析 DNS',
  7: 'SSL 证书'
}

const getProductText = (item: AlarmModel) => {
  const prefix =
    productMap[String(item.product_type!) as unknown as keyof typeof productMap]
  const text = `【${prefix}】 ${item.title}`
  return text
}

const urlMap = {
  3: { symbol: 'oss', url: '/product/oss/space-manage' },
  4: { symbol: 'mts', url: '/product/mts/task' },
  5: { symbol: 'cdn', url: '/product/cdn/site/list' },
  6: { symbol: 'dns', url: '/product/dns/resolve' },
  7: { symbol: 'ssl', url: '/product/ssl/license' }
}

const handleDetail = (item: AlarmModel) => {
  const data =
    urlMap[String(item.product_type!) as unknown as keyof typeof urlMap]
  const { url } = data
  window.open(`${location.origin}${url}`)
}
</script>

<template>
  <vc-card class="mt-0! max-h-355px!" title="资源告警">
    <a-empty v-if="!data.length" description="当前没有告警的资源，非常健康">
      <template #image>
        <vc-svg-icon name="overview-empty-alarm" :size="140" />
      </template>
    </a-empty>
    <div v-else class="h-full flex flex-col">
      <header class="alarm-header">
        <vc-svg-icon name="alarm" :size="28" class="mr-4" />
        <div class="flex gap-1 h-28px items-end">
          <span class="font-big-num text-30px">{{ data.length }}</span>
          <span class="sub-title text-danger-4! font-normal!"> / 正在告警</span>
        </div>
      </header>
      <vc-scrollbar class="flex-1">
        <div class="flex flex-col gap-y-2">
          <a-alert
            type="error"
            v-for="item in data"
            :key="item.title! + item.product_type! + item.type!"
          >
            <span class="text-danger!">{{ getProductText(item) }}</span>
            <template #icon>
              <vc-svg-icon name="error" :size="20" />
            </template>
            <template #action>
              <icon-right
                class="text-danger-5! cursor-pointer"
                @click="handleDetail(item)"
              />
            </template>
          </a-alert>
        </div>
      </vc-scrollbar>
    </div>
  </vc-card>
</template>

<style lang="less" scoped>
.arco-card {
  height: 355px;
  @apply overflow-hidden flex flex-col;

  :deep(.arco-card-body) {
    flex: 1;
    overflow: hidden;
    .alarm-header {
      position: relative;
      overflow: hidden;
      background: linear-gradient(
        90deg,
        rgba(252, 177, 116, 0.5) 0%,
        rgba(255, 177, 153, 0.1) 100%
      );
      border-radius: 4px !important;
      @apply text-danger text-sm mb-4 h-14 flex items-center pl-4;
      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        display: block;
        width: 60%;
        height: 6px;
        background: linear-gradient(
          90deg,
          rgba(255, 32, 1, 0) 0%,
          rgba(255, 32, 1, 0.2) 49.48%,
          rgba(255, 32, 1, 0) 100%
        );
        animation: flow 2s linear infinite;
      }
      @keyframes flow {
        0% {
          @apply left-0 opacity-0;
        }
        4% {
          left: 4%;
          opacity: 0.2;
        }
        10% {
          opacity: 1;
        }
        90% {
          left: 90%;
          opacity: 0.2;
        }
        100% {
          @apply left-full opacity-0;
        }
      }
    }
  }
}
</style>
