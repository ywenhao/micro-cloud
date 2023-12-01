<script setup lang="ts">
import { IconRight } from '@arco-design/web-vue/es/icon'
import {
  getOverviewResourceApi,
  type OverviewResource
} from '@vca/apis/pedestal'

const loading = ref(false)

const state = reactive<OverviewResource>({})
const getDataSource = () => {
  loading.value = true
  getOverviewResourceApi()
    .then(res => {
      Object.assign(state, res)
    })
    .finally(() => {
      loading.value = false
    })
}
onMounted(getDataSource)
</script>
<template>
  <a-spin :loading="loading">
    <div class="asset-overview">
      <div class="asset-overview__card col-span-2">
        <div class="asset-overview__card-header">
          <vc-svg-icon :size="40" name="assets-overview-user" />
          <span class="flex-1">用户概览</span>
          <icon-right />
        </div>
        <div class="asset-overview__card-body grid-cols-2">
          <div class="asset-overview__card-content">
            <label>用户总数量</label>
            <span
              class="font-big-num"
              v-locale="state?.user?.total || 0"
            ></span>
          </div>
          <div class="asset-overview__card-content">
            <label>今日注册用户</label>
            <span
              class="font-big-num"
              v-locale="state?.user?.today_registered_count || 0"
            ></span>
          </div>
        </div>
      </div>
      <div class="asset-overview__card col-span-3">
        <div class="asset-overview__card-header">
          <vc-svg-icon :size="40" name="assets-overview-oss" />
          <span class="flex-1">云存储 OSS</span>
          <icon-right />
        </div>
        <div class="asset-overview__card-body grid-cols-3">
          <div class="asset-overview__card-content">
            <label>总存储空间</label>
            <span
              class="font-big-num"
              v-trans-byte="[state?.oss?.total_storage_bytes || 0, '.unit']"
            >
              <small class="unit">PB</small>
            </span>
          </div>
          <div class="asset-overview__card-content">
            <label>已使用空间/占比</label>
            <div>
              <span
                class="font-big-num"
                v-trans-byte="[state?.oss?.used_storage_bytes || 0, '.unit']"
              >
                <small class="unit"></small>
              </span>
              <small class="px-2px">/</small>
              <small
                class="unit text-success!"
                v-percentage="state?.oss?.used_storage_ratio"
              >
              </small>
            </div>
          </div>
          <div class="asset-overview__card-content">
            <label>节点数量</label>
            <span class="font-big-num" v-locale="state?.oss?.node_count"></span>
          </div>
        </div>
      </div>
      <div class="asset-overview__card col-span-4">
        <div class="asset-overview__card-header">
          <vc-svg-icon :size="40" name="assets-overview-mts" />
          <span class="flex-1">云转码 MTS</span>
          <icon-right />
        </div>
        <div class="asset-overview__card-body grid-cols-3">
          <div class="asset-overview__card-content">
            <label>转码总数量</label>
            <span
              class="font-big-num"
              v-locale="state?.mts?.total_task_count || 0"
            ></span>
          </div>
          <div class="asset-overview__card-content">
            <label>转码时长</label>
            <div>
              <span class="font-big-num">{{
                state?.mts?.total_duration || 0
              }}</span>
              <small class="unit">小时</small>
            </div>
          </div>

          <div class="asset-overview__card-content">
            <label>截图总量</label>
            <div>
              <span class="font-big-num"
                >{{ state?.mts?.total_screenshot_count || 0 }}
              </span>
              <small class="unit">次</small>
            </div>
          </div>
        </div>
      </div>
      <div class="asset-overview__card col-span-2">
        <div class="asset-overview__card-header">
          <vc-svg-icon :size="40" name="assets-overview-dns" />
          <span class="flex-1">云解析 DNS</span>
          <icon-right />
        </div>
        <div class="asset-overview__card-body grid-cols-2">
          <div class="asset-overview__card-content">
            <label>域名数量</label>
            <span
              class="font-big-num"
              v-locale="state?.dns?.domain_count || 0"
            ></span>
          </div>
          <div class="asset-overview__card-content">
            <label>DNS服务器数量</label>
            <span
              class="font-big-num"
              v-locale="state?.dns?.ns_count || 0"
            ></span>
          </div>
        </div>
      </div>
      <div class="asset-overview__card col-span-3">
        <div class="asset-overview__card-header">
          <vc-svg-icon :size="40" name="assets-overview-ssl" />
          <span class="flex-1">SSL 证书</span>
          <icon-right />
        </div>
        <div class="asset-overview__card-body grid-cols-3">
          <div class="asset-overview__card-content">
            <label>申请总数</label>
            <span class="font-big-num" v-locale="state?.ssl?.total || 0"></span>
          </div>
          <div class="asset-overview__card-content">
            <label>签发总数量</label>
            <span
              class="font-big-num"
              v-locale="state?.ssl?.issued || 0"
            ></span>
          </div>
          <div class="asset-overview__card-content">
            <label>自有证书数量</label>
            <span class="font-big-num" v-locale="state?.ssl?.own || 0"></span>
          </div>
        </div>
      </div>
      <div class="asset-overview__card col-span-4">
        <div class="asset-overview__card-header">
          <vc-svg-icon :size="40" name="assets-overview-cdn" />
          <span class="flex-1">云分发 CDN</span>
          <icon-right />
        </div>
        <div class="asset-overview__card-body grid-cols-4">
          <div class="asset-overview__card-content">
            <label>加速站点</label>
            <span
              class="font-big-num"
              v-locale="state?.cdn?.site_count || 0"
            ></span>
          </div>
          <div class="asset-overview__card-content">
            <label>节省流量</label>
            <span
              class="font-big-num"
              v-trans-byte="[state?.cdn?.total_hit_bytes || 0, '.unit']"
            >
              <small class="unit"></small>
            </span>
          </div>
          <div class="asset-overview__card-content">
            <label>请求数量</label>
            <span
              class="font-big-num"
              v-locale="state?.cdn?.total_request_count || 0"
            ></span>
          </div>
          <div class="asset-overview__card-content">
            <label>节点数量</label>
            <span
              class="font-big-num"
              v-locale="state?.cdn?.node_count || 0"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<style scoped lang="less">
.asset-overview {
  @apply grid grid-flow-row-dense grid-cols-9 grid-rows-2 gap-4;
  &__card {
    @apply h-36 rounded-12px bg-[#F9FBFF] py-5 px-6;
    &:hover {
      background-image: url('@/assets/images/overview-card-bg.png');
      background-repeat: no-repeat;
      background-position-x: right;
      background-position-y: center;
      background-size: contain;
    }
    &-header {
      @apply flex items-center gap-x-2 text-ct-1 font-semibold text-sm mb-5;
      line-height: 20px;
    }
    &-body {
      @apply grid text-xs;
    }

    &-content {
      @apply flex flex-col  font-normal;
      label {
        @apply text-ct-3;
        line-height: 18px;
      }
      span {
        @apply text-ct-1! text-lg;
        line-height: normal;
        .unit {
          @apply scale-50;
        }
      }
    }
  }
}
</style>
