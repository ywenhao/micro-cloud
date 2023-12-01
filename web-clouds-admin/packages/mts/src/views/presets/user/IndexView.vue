<template>
  <vc-container class="has-tabs-table" admin page-title="用户预设">
    <a-tabs @tab-click="handleTabClick" v-model:active-key="active">
      <a-tab-pane v-for="item in tabs" :key="item.value" :title="item.label">
        <table-pane :preset_type="preset_type" v-if="active === item.value" />
      </a-tab-pane>
    </a-tabs>
  </vc-container>
</template>

<script setup lang="ts">
import TablePane from './components/TablePane.vue'

const tabs = [
  { value: '1', label: '普通转码预设' },
  { value: '2', label: '水印预设' },
  { value: '3', label: '截图预设' },
  { value: '4', label: '视频拼接预设' }
] as const
export type TabType = (typeof tabs)[number]
export type TabLabel = TabType['label']

const route = useRoute()
const router = useRouter()
const typeList = ['transcode', 'watermark', 'screenshot', 'video-splice']
const type = computed(() => route.params.type as string)

if (!typeList.includes(type.value)) {
  router.replace({ name: 'PresetsUser', params: { type: typeList[0] } })
}

const idx = typeList.findIndex(item => item === type.value)
const active = ref<TabType['value']>(tabs[idx].value)
const preset_type = computed(
  () => tabs.find(item => item.value === active.value)!
)

function handleTabClick() {
  const index = tabs.findIndex(item => item.value === active.value)
  router.replace({
    name: 'PresetsUser',
    params: { type: typeList[index] }
  })
}
</script>

<style lang="less" scoped>
.city-radio-group {
  height: 35px;
}
</style>
