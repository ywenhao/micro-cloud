<template>
  <vc-card title="新手使用指南">
    <a-list
      size="small"
      :loading="loading"
      :bordered="false"
      :split="false"
      class="newbie-guide"
    >
      <a-list-item v-for="item in dataSource" :key="item.id">
        <a
          :href="href(item)"
          target="_blank"
          :hoverable="false"
          class="no-underline flex items-center gap-1 text-ct-2! hover:text-primary! cursor-pointer"
        >
          <icon-file class="text-ct-2 mr-1" />
          <span class="flex-1 truncate">
            {{ item.title || '-' }}
          </span>
        </a>
      </a-list-item>
    </a-list>
  </vc-card>
</template>

<script setup lang="ts">
import { IconFile } from '@arco-design/web-vue/es/icon'
import { getGuideApi, type GuideModel } from '@vcp/apis/pedestal'

const loading = ref(false)
const dataSource = ref<GuideModel[]>([])
const getGuides = () => {
  loading.value = true
  getGuideApi({})
    .then(res => {
      dataSource.value = res?.list || []
    })
    .finally(() => {
      loading.value = false
    })
}
const appStore = useAppStore()
const href = computed(() => (record: GuideModel) => {
  const master_domain =
    // @ts-ignore
    appStore.domainConf?.master_domain || window.location.origin
  const { product_id, document_id, document_type } = record
  if (String(document_type) === String(1)) {
    return `${master_domain}/document-details?prod=${product_id}&doc=${document_id}`
  }
  return `${master_domain}/document/problem?doc=${document_id}`
})
onMounted(getGuides)
</script>

<style lang="less" scoped>
.newbie-guide {
  padding: 8px 0;
  background: url('@/assets/newbie-gride-bg.png') center / cover no-repeat;
  border-radius: 12px;
  :deep(.arco-list-item) {
    padding: 7px 12px !important;
  }
}
</style>
