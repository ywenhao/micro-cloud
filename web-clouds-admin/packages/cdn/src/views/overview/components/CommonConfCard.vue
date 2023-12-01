<template>
  <vca-card title="常用功能配置">
    <div class="grid grid-cols-3 gap-4">
      <vca-card
        class="rounded-md!"
        bordered
        background
        v-for="(func, i) in commonFunctions"
        :key="i"
      >
        <template #title>
          <div class="flex items-center gap-x-2">
            <vc-svg-icon
              :size="32"
              prefix="cdn"
              :name="func.icon"
            ></vc-svg-icon>
            {{ func.title }}
          </div>
        </template>

        <template #extra>
          <router-link :to="func.to">
            <a-tag color="arcoblue" class="common-func__btn">
              去配置
              <icon-caret-right />
            </a-tag>
          </router-link>
        </template>
        <span class="common-func__description">
          {{ func.description }}
        </span>
      </vca-card>
    </div>
  </vca-card>
</template>

<script setup lang="ts">
import { IconCaretRight } from '@arco-design/web-vue/es/icon'

const commonFunctions = [
  {
    title: '解析管理-解析域名',
    icon: 'overview_analysis_domain',
    description: '配置解析域名用于分配站点CNAME域名和连接内部解析链路',
    to: { name: 'AnalysisDomain' }
  },
  {
    title: '解析管理-区域解析',
    icon: 'overview_analysis_region',
    description: '配置所有区域的解析域名，并关联节点。',
    to: { name: 'AnalysisRegion' }
  },
  {
    title: '节点管理-节点列表',
    icon: 'overview_node_list',
    description: '管理节点，查看节点运行状态，同步下发配置。',
    to: { name: 'NodeList' }
  }
]
</script>

<style lang="less">
.common-func__btn {
  padding: 2px 6px !important;
  border-radius: 999px;
  font-size: 12px !important;
}
.common-func__description {
  font-size: 12px;
  color: var(--color-text-3);
}
</style>
