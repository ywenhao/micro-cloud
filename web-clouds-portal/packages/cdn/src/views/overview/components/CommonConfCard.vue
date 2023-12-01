<template>
  <a-spin :loading="loading">
    <vc-card title="数据概览" class="rounded-12px">
      <div class="grid grid-cols-2 gap-4 pb-2">
        <vc-card class="rounded-md! px-2 pt-11px cdn_item-card" bordered>
          <template #title>
            <div class="flex items-center gap-x-2">流量</div>
          </template>
          <div class="flex items-center mt-1 pb-10px">
            <div class="w-1/2 flex flex-col items-start">
              <span class="text-xs text-ct-3">今日</span>
              <div class="text-primary text-28px">
                <span
                  class="num"
                  v-trans-byte="[overViewData?.now_total_bytes, '.unit']"
                >
                  <span class="unit pl-1! text-sm!"> </span>
                </span>
              </div>
            </div>
            <a-divider direction="vertical" class="mx-6! h-8!" />
            <div class="w-1/2 flex flex-col items-start">
              <span class="text-ct-3 text-xs">本月</span>
              <div class="text-ct-3 text-28px">
                <span
                  class="num"
                  v-trans-byte="[overViewData?.month_total_bytes, '.unit']"
                >
                  <span class="unit pl-1! text-sm!"> </span>
                </span>
              </div>
            </div>
          </div>
        </vc-card>
        <vc-card class="rounded-md! px-2 pt-11px cdn_item-card mt-0!" bordered>
          <template #title>
            <div class="flex items-center gap-x-2">宽带峰值</div>
          </template>
          <div class="flex items-center mt-1 pb-10px">
            <div class="w-1/2 flex flex-col items-start">
              <span class="text-xs text-ct-3">今日</span>
              <div class="text-primary text-28px">
                <span v-trans-ps="[overViewData?.now_top_speed, '.unit']">
                  <span class="unit pl-1! text-sm!"> </span>
                </span>
              </div>
            </div>
            <a-divider direction="vertical" class="mx-6! h-8!" />
            <div class="w-1/2 flex flex-col items-start">
              <span class="text-ct-3 text-xs">本月</span>
              <div class="text-ct-3 text-28px">
                <span v-trans-ps="[overViewData?.month_top_speed, '.unit']">
                  <span class="unit pl-1! text-sm!"> </span>
                </span>
              </div>
            </div>
          </div>
        </vc-card>
        <vc-card class="rounded-md! px-2 pt-11px cdn_item-card mt-0!" bordered>
          <template #title>
            <div class="flex items-center gap-x-2">节省流量</div>
          </template>
          <div class="flex items-center mt-1 pb-10px">
            <div class="w-1/2 flex flex-col items-start">
              <span class="text-xs text-ct-3">今日</span>
              <div class="text-primary text-28px">
                <span
                  v-trans-byte="[overViewData?.now_total_hit_bytes, '.unit']"
                >
                  <span class="unit pl-1! text-sm!"> </span>
                </span>
              </div>
            </div>
            <a-divider direction="vertical" class="mx-6! h-8!" />
            <div class="w-1/2 flex flex-col items-start">
              <span class="text-ct-3 text-xs">本月</span>
              <div class="text-ct-3 text-28px">
                <span
                  v-trans-byte="[overViewData?.month_total_hit_bytes, '.unit']"
                >
                  <span class="unit pl-1! text-sm!"> </span>
                </span>
              </div>
            </div>
          </div>
        </vc-card>
        <vc-card class="rounded-md! px-2 pt-11px cdn_item-card mt-0!" bordered>
          <template #title>
            <div class="flex items-center gap-x-2">独立IP访问数</div>
          </template>
          <div class="flex items-center mt-1 pb-10px">
            <div class="w-1/2 flex flex-col items-start">
              <span class="text-xs text-ct-3">今日累计</span>
              <div class="text-primary text-28px">
                <span v-locale="overViewData?.now_ips"></span>
                <span class="pl-1 text-sm"> 个 </span>
              </div>
            </div>
            <a-divider direction="vertical" class="mx-6! h-8!" />
            <div class="w-1/2 flex flex-col items-start">
              <span class="text-ct-3 text-xs">昨日累计</span>
              <div class="text-ct-3 text-28px">
                <span v-locale="overViewData?.last_ips"></span>
                <span class="pl-1 text-sm"> 个 </span>
              </div>
            </div>
          </div>
        </vc-card>
        <vc-card class="rounded-md! px-2 pt-11px cdn_item-card mt-0!" bordered>
          <template #title>
            <div class="flex items-center gap-x-2">请求数</div>
          </template>
          <div class="flex items-center mt-1 pb-10px">
            <div class="w-1/2 flex flex-col items-start">
              <span class="text-xs text-ct-3">今日累计</span>
              <div class="text-primary text-28px">
                <span v-locale="overViewData?.now_total_requests"></span>
                <span class="pl-1 text-sm"> 个 </span>
              </div>
            </div>
            <a-divider direction="vertical" class="mx-6! h-8!" />
            <div class="w-1/2 flex flex-col items-start">
              <span class="text-ct-3 text-xs">昨日累计</span>
              <div class="text-ct-3 text-28px">
                <span v-locale="overViewData?.last_total_requests"></span>
                <span class="pl-1 text-sm"> 个 </span>
              </div>
            </div>
          </div>
        </vc-card>
        <vc-card class="rounded-md! px-2 pt-11px cdn_item-card mt-0!" bordered>
          <template #title>
            <div class="flex items-center gap-x-2">请求命中率</div>
          </template>
          <div class="flex items-center mt-1 pb-10px">
            <div class="w-1/2 flex flex-col items-start">
              <span class="text-xs text-ct-3">今日累计</span>
              <div class="text-primary text-28px">
                <span
                  v-locale="Number(overViewData?.now_hit_rate).toFixed(2)"
                ></span>
                <span class="pl-1 text-sm"> % </span>
              </div>
            </div>
            <a-divider direction="vertical" class="mx-6! h-8!" />
            <div class="w-1/2 flex flex-col items-start">
              <span class="text-ct-3 text-xs">昨日累计</span>
              <div class="text-ct-3 text-28px">
                <span
                  v-locale="Number(overViewData?.last_hit_rate).toFixed(2)"
                ></span>
                <span class="pl-1 text-sm"> % </span>
              </div>
            </div>
          </div>
        </vc-card>
      </div>
    </vc-card>
  </a-spin>
</template>

<script setup lang="ts">
import { getCdnOverviewApi } from '@vcp/apis/cdn'

const loading = ref<boolean>(false)

const overViewData = ref()

/** 获取概览的数据 */
const getOverview = () => {
  loading.value = true
  getCdnOverviewApi()
    .then(res => {
      overViewData.value = res
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getOverview()
})
</script>

<style lang="less">
.common-func__btn {
  padding: 2px 6px !important;
  font-size: 12px !important;
  border-radius: 999px;
}
.cdn_item-card {
  background: linear-gradient(
    180deg,
    rgba(232, 243, 255, 0.3) 0%,
    rgba(232, 243, 255, 0.1) 100%
  ) !important;
}
</style>
