<script setup lang="ts">
import { IconRight } from '@arco-design/web-vue/es/icon'
import {
  getOverviewResourceApi,
  type OverviewResource
} from '@vcp/apis/pedestal'
import { formatTime } from 'vc-material'

const loading = ref(false)
const state = reactive<OverviewResource>({})

const getOverviewResource = () => {
  loading.value = true
  getOverviewResourceApi()
    .then(res => {
      Object.assign(state, res)
    })
    .finally(() => {
      loading.value = false
    })
}
onMounted(getOverviewResource)
</script>
<template>
  <a-spin class="w-full" :loading="loading">
    <vc-card title="资源概览" class="assets-overview">
      <div
        class="assets-overview-item"
        :style="{
          '--item-bg': 'linear-gradient(180deg, #EFF5FE 0%, #FFF 59.90%)'
        }"
      >
        <header class="assets-overview-item__header">
          <label>云存储 OSS</label>
          <i class="flex-1"></i>
          <icon-right class="cursor-pointer" />
        </header>
        <section class="assets-overview-item__body">
          <div class="assets-overview-item__table">
            <div class="assets-overview-item__table-row">
              <label class="text-ct-3 flex-1">空间数量</label>
              <span
                class="text-ct-1 font-500"
                v-locale="state?.oss?.bucket_count ?? 0"
              ></span>
            </div>
            <div class="assets-overview-item__table-row">
              <label class="text-ct-3 flex-1">存储空间</label>
              <span
                class="text-ct-1 font-500"
                v-trans-byte="state?.oss?.storage_bytes || 0"
              ></span>
            </div>
            <div class="assets-overview-item__table-row">
              <label class="text-ct-3 flex-1">文件数量</label>
              <span
                class="text-ct-1 font-500"
                v-locale="state?.oss?.object_count ?? 0"
              >
              </span>
            </div>
          </div>
        </section>
      </div>
      <div
        class="assets-overview-item"
        :style="{
          '--item-bg': 'linear-gradient(180deg, #FFFAF0 0%, #FFF 59.90%)'
        }"
      >
        <header class="assets-overview-item__header">
          <label>云转码 MTS</label>
          <i class="flex-1"></i>
          <icon-right class="cursor-pointer" />
        </header>
        <section class="assets-overview-item__body">
          <div class="assets-overview-item__table">
            <div class="assets-overview-item__table-row">
              <label class="text-ct-3 flex-1">转码时长</label>
              <span class="text-ct-1 font-500">
                {{ formatTime(Number(state?.mts?.total_duration || 0)) }}
              </span>
            </div>
            <div class="assets-overview-item__table-row">
              <label class="text-ct-3 flex-1">截图总量</label>
              <span class="text-ct-1 font-500">
                <span v-locale="state?.mts?.total_screenshot_count">0</span>次
              </span>
            </div>
          </div>
        </section>
      </div>
      <div
        class="assets-overview-item"
        :style="{
          '--item-bg': 'linear-gradient(180deg, #F5F3FF 0%, #FFF 59.90%)'
        }"
      >
        <header class="assets-overview-item__header">
          <label>云分发 CDN</label>
          <i class="flex-1"></i>
          <icon-right class="cursor-pointer" />
        </header>
        <section class="assets-overview-item__body">
          <div class="assets-overview-item__table">
            <div class="assets-overview-item__table-row">
              <label class="text-ct-3 flex-1">加速域名</label>
              <span
                class="text-ct-1 font-500"
                v-locale="state?.cdn?.site_count || 0"
              ></span>
            </div>
            <div class="assets-overview-item__table-row">
              <label class="text-ct-3 flex-1">节省流量</label>
              <span
                class="text-ct-1 font-500"
                v-trans-byte="state?.cdn?.total_hit_bytes || 0"
              ></span>
            </div>
            <div class="assets-overview-item__table-row">
              <label class="text-ct-3 flex-1">请求数量</label>
              <span
                class="text-ct-1 font-500"
                v-locale="state?.cdn?.total_request_count || 0"
              >
                0
              </span>
            </div>
          </div>
        </section>
      </div>
      <div
        class="assets-overview-item"
        :style="{
          '--item-bg': 'linear-gradient(180deg, #FFF2F0 0%, #FFF 59.90%)'
        }"
      >
        <header class="assets-overview-item__header">
          <label>云解析 DNS</label>
          <i class="flex-1"></i>
          <icon-right class="cursor-pointer" />
        </header>
        <section class="assets-overview-item__body">
          <div class="assets-overview-item__table">
            <div class="assets-overview-item__table-row">
              <label class="text-ct-3 flex-1">域名数量</label>
              <span
                class="text-ct-1 font-500"
                v-locale="state?.dns?.domain_count || 0"
              >
                0
              </span>
            </div>
            <div class="assets-overview-item__table-row">
              <label class="text-ct-3 flex-1">异常域名</label>
              <span
                class="text-ct-1 font-500"
                v-locale="state?.dns?.abnormal_domain_count || 0"
              >
                0
              </span>
            </div>
          </div>
        </section>
      </div>
      <div
        class="assets-overview-item"
        :style="{
          '--item-bg': 'linear-gradient(180deg, #EFF5FE 0%, #FFF 59.90%)'
        }"
      >
        <header class="assets-overview-item__header">
          <label>SSL 证书</label>
          <i class="flex-1"></i>
          <icon-right class="cursor-pointer" />
        </header>
        <section class="assets-overview-item__body">
          <div class="assets-overview-item__table-row">
            <label class="text-ct-3 flex-1">申请总数量</label>
            <span class="text-ct-1 font-500" v-locale="state?.ssl?.total || 0">
              0
            </span>
          </div>
          <div class="assets-overview-item__table-row">
            <label class="text-ct-3 flex-1">签发总数量</label>
            <span class="text-ct-1 font-500" v-locale="state?.ssl?.issued || 0">
              0
            </span>
          </div>
          <div class="assets-overview-item__table-row">
            <label class="text-ct-3 flex-1">即将到期</label>
            <span
              class="text-ct-1 font-500"
              v-locale="state?.ssl?.expiring || 0"
            >
              0
            </span>
          </div>
        </section>
      </div>
    </vc-card>
  </a-spin>
</template>

<style scoped lang="less">
.assets-overview {
  background: linear-gradient(180deg, #f0f7ff 0%, #fff 32.29%);

  :deep(.arco-card-body) {
    @apply grid grid-cols-5 gap-x-4;
    .assets-overview-item {
      @apply py-5 px-4;
      height: 176px;
      background: var(--item-bg);
      border: 1px solid var(--color-border-1, #f2f3f5);
      border-radius: 6px;
      &__header {
        line-height: 20px;
        @apply flex items-center text-sm text-ct-1 font-medium  pb-4 mb-4 border-b-dashed border-b-1px border-color-2;
      }
      &__table {
        &-row {
          line-height: 20px;
          @apply flex items-center pt-2;
        }
      }
    }
  }
}
</style>
