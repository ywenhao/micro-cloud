<template>
  <!-- <img class="w-full! h-142px! mt-4" :src="analysisLink" /> -->
  <div class="analysis-header">
    <div class="analysis-header__title">解析链路</div>
    <div class="analysis-header__indicator">
      <img :src="bg" class="indicator-bg" />
      <img :src="bracket" class="indicator-bracket" />
      <div class="indicator-desc">
        <div class="indicator-desc__item w-3/8 text-primary-6">
          1.用户链路-用户自行添加站点解析
        </div>

        <div class="indicator-desc__item w-5/8">
          2.系统链路-自动添加解析链路
        </div>
      </div>
      <div class="indicator-steps">
        <div class="indicator-item" v-for="item in indicators" :key="item">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
  <vc-filter-bar
    class="my-4"
    v-model="state"
    :schemas="schemas"
    @search="emit('command', 'SEARCH')"
  >
    <template #prefix>
      <a-button @click="emit('command', 'CREATE')" type="primary">
        {{ createButtonText }}
      </a-button>
    </template>
  </vc-filter-bar>
  <a-alert v-if="module === 'domain'">
    支持配置多个解析域名，解析域名生成CNAME域名后将平均分配给用户站点。
  </a-alert>
</template>

<script setup lang="ts">
import type { VcFilterBarScheme, VcFilterBarState } from 'vc-material'

import analysisBracketDomain from '@/assets/images/analysis_bracket_domain.png'
import analysisBracketRegion from '@/assets/images/analysis_bracket_region.png'
import analysisHeaderDomain from '@/assets/images/analysis_header_domain.png'
import analysisHeaderRegion from '@/assets/images/analysis_header_region.png'

import type { ICommand } from './hooks/useCommand'

const props = defineProps<{
  module: 'domain' | 'region'
}>()

const state = defineModel<VcFilterBarState>('state', { required: true })

const emit = defineEmits<{
  (event: 'command', command: ICommand): void
}>()

const bg = computed(() =>
  props.module === 'domain' ? analysisHeaderDomain : analysisHeaderRegion
)
const bracket = computed(() =>
  props.module === 'domain' ? analysisBracketDomain : analysisBracketRegion
)
const createButtonText = computed(() =>
  props.module === 'domain' ? '添加解析域名' : '添加区域'
)
const indicators = ['用户站点', '解析CNAME域名', '区域CNEME域名', '节点']
const schemas = computed(() => {
  const res: VcFilterBarScheme = {
    widgets: [
      {
        field: 'co',
        widget: 'combo-input',
        attrs: {
          defaultSelected: props.module === 'domain' ? 'domain' : 'name',
          options: [
            props.module === 'domain'
              ? { label: '解析域名', value: 'domain' }
              : { label: '区域名称', value: 'name' },
            { label: '备注', value: 'remark' }
          ]
        }
      }
    ]
  }
  return res
})
</script>

<style scoped lang="less">
.analysis-header {
  @apply flex flex-col gap-y-4 mt-4 p-4 h-142px;
  /* 填充/color-fill-1 浅/禁用 */
  background: var(--color-fill-1);
  /* 边框/color-border-1 浅色 */
  border: 1px solid var(--color-border-1);
  &__title {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    color: var(--color-text-1);
  }
  &__indicator {
    flex: 1;
    border-radius: 6px;
    position: relative;
    .indicator-bg {
      position: absolute;
      top: 0;
      width: 100%;
      height: 28px;
      border-radius: 999px;
    }
    .indicator-bracket {
      position: absolute;
      top: 28px;
      width: 100%;
      height: 22px;
    }
    .indicator-desc {
      position: absolute;
      top: 50px;
      width: 100%;
      height: 18px;
      @apply flex items-center h-18px top-50px;
      &__item {
        text-align: center;
      }
    }
    .indicator-steps {
      @apply grid grid-cols-4 h-7 gap-2;
      .indicator-item {
        @apply flex items-center text-sm font-medium justify-center z-1 text-white;
        line-height: 20px;
        background-image: var(--indicator-steps-bg);
      }
    }
  }
}
</style>
