<template>
  <vc-container
    header-bordered
    class="vc-space-detail"
    :page-title="pageTitle"
    :back="() => $router.push({ name: 'SpaceManage' })"
  >
    <div class="rounded px-4 py-3 detail-data flex justify-start mb-2">
      <span class="item-title"
        >存储区域
        <span class="item-data">{{ regionName(spaceDetail?.region_id) }}</span>
      </span>
      <span class="item-title"
        >存储量
        <span class="item-data">{{
          convertByte(Number(spaceDetail?.storage_bytes))
        }}</span>
      </span>
      <span class="item-title"
        >对象数 <span class="item-data">{{ spaceDetail?.storage_num }}</span>
      </span>
      <span class="item-title"
        >访问权限
        <span class="item-data">{{
          spaceDetail?.acl === 'private' ? '私有' : '公开'
        }}</span>
      </span>
    </div>
    <a-tabs :active-key="activeName" lazy-load @tab-click="handleClick">
      <a-tab-pane
        v-for="item in tabsList"
        :key="item.value"
        :title="item.title"
      >
      </a-tab-pane>
    </a-tabs>
    <space-overview
      v-if="activeName === 'overview'"
      v-model:space-detail="spaceDetail"
      key="overview"
    />
    <file-manage
      v-if="activeName === 'file'"
      key="file"
      v-model:space-detail="spaceDetail"
    />
    <space-setting
      v-if="activeName === 'setting'"
      key="setting"
      v-model:space-detail="spaceDetail"
      @update-detail="getBasicDetail()"
    />
    <domain-manage
      v-if="activeName === 'domain'"
      key="domain"
      v-model:space-detail="spaceDetail"
    />
  </vc-container>
</template>

<script setup lang="ts">
import { spaceBasicApi } from '@vcp/apis/oss'
import { convertByte } from 'vc-material'
import { useRoute, useRouter } from 'vue-router'

import { REGION_LIST_DATA } from '@/components/SelectData'
import type { TabsData } from '@/types/space-list'

import DomainManage from '../components/DomainManage.vue'
import FileManage from '../components/FileManage.vue'
import SpaceOverview from '../components/SpaceOverview.vue'
import SpaceSetting from '../components/SpaceSetting.vue'

const spaceDetail = ref()

const pageTitle = computed<string>(() => spaceDetail.value?.name)
const activeName = ref<string>('')

const tabsList = ref<TabsData[]>([
  {
    title: '空间概览',
    value: 'overview'
  },
  {
    title: '文件管理',
    value: 'file'
  },
  {
    title: '空间设置',
    value: 'setting'
  },
  {
    title: '域名管理',
    value: 'domain'
  }
])

const regionName = computed(() => (id: string) => {
  let name = '-'
  REGION_LIST_DATA.value.some(({ value, label }) => {
    value === id ? (name = label) : ''
  })
  return name
})

const route = useRoute()
const router = useRouter()

const handleClick = (key: string | number) => {
  activeName.value = key as string
  if (route.params?.command !== key) {
    router.replace({
      ...route,
      params: { ...(route?.params || {}), command: key }
    })
  }
}

const getBasicDetail = () => {
  spaceBasicApi({ id: route.params.id as string }).then(res => {
    spaceDetail.value = res
  })
}

onMounted(() => {
  activeName.value = route.params?.command as string
  getBasicDetail()
})

provide('getSpaceDetail', getBasicDetail)
</script>

<style scoped lang="less">
.vc-space-detail {
  .detail-data {
    background: url('@/assets/images/statistic.png') no-repeat center;
  }
  .item-title {
    @apply text-sm  px-10;
    border-left: 1px solid var(--color-border-3);
    color: var(--color-text-3);
    &:first-child {
      @apply pl-0 border-l-none;
    }
  }
  .item-data {
    @apply text-sm pl-2;
    color: var(--color-text-1);
  }
}
</style>
