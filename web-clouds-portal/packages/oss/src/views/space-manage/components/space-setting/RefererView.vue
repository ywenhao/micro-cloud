<template>
  <div class="space-setting-table">
    <div class="flex flex-col gap-y-4">
      <div class="flex flex-row justify-between items-center">
        <div class="flex flex-col">
          <span class="space-table-title">Referer防盗链</span>
          <span class="space-table-sub-title">
            HTTP Referer 黑白名单配置，用于防止盗链。</span
          >
          <p class="text-ct-2 text-sm m-0 mt-4">
            {{ refererData.enable ? '已配置' : '未配置' }}
          </p>
        </div>
        <a-button
          type="primary"
          class="edit-btn"
          @click="refererState.visible = true"
          >编辑</a-button
        >
      </div>
    </div>

    <referer-anti-theft
      v-model="refererState.visible"
      @update="getReferData"
    ></referer-anti-theft>
  </div>
</template>

<script setup lang="ts">
import { refererListApi, type RefererModel } from '@vcp/apis/oss'
import { useRoute } from 'vue-router'

import RefererAntiTheft from './drawer/RefererAntiTheft.vue'
const route = useRoute()
const refererState = reactive({
  visible: false
})

const refererData = ref<RefererModel>({
  allow_empty: false,
  enable: false,
  is_white_list: false,
  list: [],
  refererList: []
})

/** 获取referer */
const getReferData = () => {
  refererListApi({
    bucket_id: route.params?.id as string
  }).then(res => {
    refererData.value = { ...refererData.value, ...res }
    refererData.value.refererList = res.list?.map(item => {
      return {
        value: item,
        edit: false,
        id: item
      }
    })
  })
}

onMounted(() => {
  getReferData()
})
</script>

<style scoped lang="less">
.space-setting-table {
  overflow-y: auto;
  max-height: 450px;
}
.vc-referer-header {
  border-top: 1px solid #f2f3f5;
}
:deep(.arco-list-header) {
  padding: 10px 0px 10px 16px !important;
  background: #f2f3f5;
}
:deep(.arco-list-item) {
  @apply py-2! px-4!;

  .arco-list-item-content {
    @apply flex h-full items-start;
  }
}
.referer-form-box {
  :deep(.arco-form-item) {
    width: 86%;
  }
  :deep(.arco-form-item-label-col) {
    @apply hidden !important;
  }
  :deep(.arco-form-item-wrapper-col) {
    width: 90%;
    flex: 0 0 90%;
  }
}
</style>
