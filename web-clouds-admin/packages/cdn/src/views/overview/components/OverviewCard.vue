<template>
  <vca-card title="概览">
    <div class="grid grid-cols-3 gap-4">
      <vca-card class="rounded-md!" secondary title="节点概览">
        <template #extra>
          <router-link class="more-link" :to="{ name: 'Overview' }">
            <icon-right />
          </router-link>
        </template>
        <div class="overview-card__body">
          <span class="overview-card__body-title">总计(个)</span>
          <span
            class="overview-card__body-count"
            v-locale="dataSource.node.count"
          ></span>
          <div class="overview-card__body-footer">
            <div class="flex items-center gap-x-2">
              <span>在线</span>
              <span
                class="font-big-num"
                v-locale="dataSource.node.online"
              ></span>
            </div>
            <div class="flex items-center gap-x-2">
              <span>离线</span>
              <span
                class="font-big-num"
                v-locale="dataSource.node.offLine"
              ></span>
            </div>
            <div class="flex items-center gap-x-2">
              <span>异常</span>
              <span
                class="font-big-num"
                v-locale="dataSource.node.abnormal"
              ></span>
            </div>
          </div>
        </div>
      </vca-card>

      <vca-card class="rounded-md!" secondary title="站点概览">
        <template #extra>
          <router-link class="more-link" :to="{ name: 'Overview' }">
            <icon-right />
          </router-link>
        </template>
        <div class="overview-card__body">
          <span class="overview-card__body-title">总计(个)</span>
          <span
            class="overview-card__body-count"
            v-locale="dataSource.site.count"
          ></span>
          <div class="overview-card__body-footer">
            <div class="flex items-center gap-x-2">
              <span>有效</span>
              <span
                class="font-big-num"
                v-locale="dataSource.site.effective"
              ></span>
            </div>
            <div class="flex items-center gap-x-2">
              <span>暂停</span>
              <span
                class="font-big-num"
                v-locale="dataSource.site.suspend"
              ></span>
            </div>
          </div>
        </div>
      </vca-card>

      <vca-card class="rounded-md!" secondary title="证书概览">
        <template #extra>
          <router-link class="more-link" :to="{ name: 'Overview' }">
            <icon-right />
          </router-link>
        </template>
        <div class="overview-card__body">
          <span class="overview-card__body-title">总计(个)</span>
          <span
            class="overview-card__body-count"
            v-locale="dataSource.ssl.count"
          ></span>
          <div class="overview-card__body-footer">
            <div class="flex items-center gap-x-2">
              <span>有效</span>
              <span
                class="font-big-num"
                v-locale="dataSource.ssl.effective"
              ></span>
            </div>
            <div class="flex items-center gap-x-2">
              <span>即将到期</span>
              <span
                class="font-big-num"
                v-locale="dataSource.ssl.expiringSoon"
              ></span>
            </div>
            <div class="flex items-center gap-x-2">
              <span>已到期</span>
              <span
                class="font-big-num"
                v-locale="dataSource.ssl.expired"
              ></span>
            </div>
          </div>
        </div>
      </vca-card>
    </div>
  </vca-card>
</template>

<script setup lang="ts">
import { IconRight } from '@arco-design/web-vue/es/icon'
import {
  getCdnOverviewCertificatesApi,
  getCdnOverviewNodesApi,
  getCdnOverviewSiteApi
} from '@vca/apis/cdn'

const dataSource = reactive({
  // 节点概览
  node: {
    // 统计
    count: 0,
    // 在线
    online: 0,
    // 离线
    offLine: 0,
    // 异常
    abnormal: 0
  },
  // 站点概览
  site: {
    // 统计
    count: 0,
    // 有效
    effective: 0,
    // 暂停
    suspend: 0
  },
  // 证书概览
  ssl: {
    // 统计
    count: 0,
    // 有效
    effective: 0,
    // 即将到期
    expiringSoon: 0,
    // 已到期
    expired: 0
  }
})

const getOverviewNode = async () => {
  const { total, stopped, running, abnormal } = await getCdnOverviewNodesApi()
  dataSource.node.count = total as number
  dataSource.node.online = running as number
  dataSource.node.offLine = stopped as number
  dataSource.node.abnormal = abnormal as number
}

interface ISslData {
  effective: string | number
  expired: string | number
  will_expire: string | number
}

const getOverviewSsl = () => {
  getCdnOverviewCertificatesApi().then(res => {
    const { edge, origin } = res
    const {
      effective: edgeEffective,
      expired: edgeExpired,
      will_expire: edgeWillExpire
    } = edge as ISslData
    const {
      effective: originEffective,
      expired: originExpired,
      will_expire: originWillExpire
    } = origin as ISslData
    dataSource.ssl.count =
      Number(edgeEffective) +
      Number(edgeExpired) +
      Number(edgeWillExpire) +
      Number(originEffective) +
      Number(originExpired) +
      Number(originWillExpire)
    dataSource.ssl.effective = Number(edgeEffective) + Number(originEffective)
    dataSource.ssl.expiringSoon =
      Number(edgeWillExpire) + Number(originWillExpire)
    dataSource.ssl.effective = Number(edgeExpired) + Number(originExpired)
  })
}

const getOverviewSite = async () => {
  const { count, run, stop } = await getCdnOverviewSiteApi({})
  dataSource.site.count = count as number
  dataSource.site.effective = run as number
  dataSource.site.suspend = stop as number
}

onMounted(() => {
  getOverviewNode()
  getOverviewSite()
  getOverviewSsl()
})
</script>

<style scoped lang="less">
.more-link {
  color: #f9fafc;
}
.overview-card__body {
  @apply flex flex-col;
  &-title {
    @apply text-xs;
    color: var(--color-text-3);
  }
  &-count {
    margin-bottom: 16px;
    font-size: 32px;
    color: var(--color-text-1);
    line-height: 38px;
    @apply font-big-num;
  }
  &-footer {
    @apply grid grid-cols-3;
  }
}
</style>
