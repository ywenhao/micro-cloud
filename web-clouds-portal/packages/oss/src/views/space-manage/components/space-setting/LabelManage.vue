<template>
  <div class="space-setting-table" id="anthor-label">
    <div class="flex flex-col vc-referer-header pb-2">
      <div class="flex flex-row justify-between items-center">
        <div>
          <span class="space-table-title">标签管理</span>
          <br />
          <span class="space-table-sub-title">
            可以为空间添加分类标签，每个空间最多10对。
          </span>
          <p class="text-ct-2 text-sm m-0 mt-4">
            {{
              tagData.labelList.length > 0
                ? `${tagData.labelList.length}个`
                : '暂无标签'
            }}
          </p>
        </div>
        <a-button
          type="primary"
          class="edit-btn"
          @click="manageState.visible = true"
          >编辑</a-button
        >
      </div>
    </div>
    <label-manage-drawer
      v-model="manageState.visible"
      @update="getTagData"
    ></label-manage-drawer>
  </div>
</template>

<script setup lang="ts">
import { tagListApi, type TagModel } from '@vcp/apis/oss'
import { useRoute } from 'vue-router'

import LabelManageDrawer from './drawer/LabelManageDrawer.vue'
const route = useRoute()

const tagData = ref<{ labelList: TagModel[] }>({
  labelList: [{ id: '', key: 'key1', val: 'value1' }]
})

const manageState = reactive({
  visible: false
})

/** 获取标签 */
const getTagData = () => {
  tagListApi({
    bucket_id: route.params?.id as string
  }).then(res => {
    tagData.value.labelList = res.list?.map(item => {
      return { ...item, edit: true }
    }) as TagModel[]
  })
}

onMounted(() => {
  getTagData()
  if (route.params?.label) {
    document.getElementById('anthor-label')?.scrollIntoView()
  }
})
</script>

<style scoped lang="less">
.space-setting-table {
  overflow-y: auto;
  max-height: 450px;
  :deep(.arco-anchor-link) {
    @apply p-0!;
  }
}
:deep(.arco-list-header) {
  padding: 10px 0px 10px 16px !important;
  background: #f2f3f5;
}
:deep(.arco-list-item) {
  @apply py-2! px-4!;
  border-bottom: 1px solid var(--color-neutral-3);
  .arco-list-item-content {
    @apply flex h-full items-start;
  }
  &.add-list-item {
    border-bottom: none !important;
  }
}
.label-form-box {
  :deep(.arco-form-item) {
    width: 86%;
  }
  :deep(.arco-form-item-label-col) {
    @apply hidden !important;
  }
  :deep(.arco-form-item-wrapper-col) {
    width: 100%;
    flex: 0 0 100%;
  }
}
</style>
