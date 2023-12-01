<template>
  <vc-container class="has-tabs-title" page-title="预设集">
    <template #header-extra>
      <region-select
        v-model:active="cityActive"
        :options="cityOpts"
        :loading="loading"
      />
    </template>

    <a-tabs mt-2 @tab-click="handleTabClick" v-model:active-key="active">
      <a-tab-pane
        :disabled="loading"
        v-for="item in tabs"
        :key="item.value"
        :title="item.label"
      >
        <table-pane
          :id="cityActive"
          :preset_type="preset_type"
          v-if="active === item.value"
        />
      </a-tab-pane>
    </a-tabs>
  </vc-container>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { regionListApi } from '@vcp/apis/oss'

import RegionSelect from '@/components/RegionSelect.vue'

import TablePane from './components/TablePane.vue'

const tabs = [
  { value: 1, label: '普通转码预设' },
  { value: 2, label: '水印预设' },
  { value: 3, label: '截图预设' },
  { value: 4, label: '视频拼接预设' }
] as const
export type TabType = (typeof tabs)[number]
export type TabLabel = TabType['label']

const route = useRoute()
const router = useRouter()
const typeList = ['transcode', 'watermark', 'screenshot', 'video-splice']
const type = computed(() => route.params.type as string)

if (!typeList.includes(type.value)) {
  router.replace('/presets/transcode')
}

const idx = typeList.findIndex(item => item === type.value)
const active = ref<TabType['value']>(tabs[idx].value)
const preset_type = computed(
  () => tabs.find(item => item.value === active.value)!
)

const cityActive = useLocalStorage('region_id', '')

const cityOpts = ref<{ value: string; label: string }[]>([])

const loading = ref(false)
async function getCity() {
  loading.value = true
  try {
    const res = await regionListApi({})
    cityOpts.value = (res.list || []).map(v => ({
      value: v.id!,
      label: v.name!
    }))

    if (!cityOpts.value.length) Message.error('区域列表为空')
    const item = cityOpts.value.find(v => v.value === cityActive.value)
    cityActive.value = item ? item.value : cityOpts.value[0].value
  } finally {
    loading.value = false
  }
}

function handleTabClick() {
  const index = tabs.findIndex(item => item.value === active.value)
  router.replace({
    name: 'Presets',
    params: { type: typeList[index] }
  })
}

onMounted(() => getCity())
</script>

<style lang="less" scoped>
.city-radio-group {
  height: 35px;
}
</style>
