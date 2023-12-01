<template>
  <a-card class="doc-sider-bar">
    <template #title>
      <span class="flex-1">常见问题</span>
      <node-actions
        v-model:currentNode="currentNode"
        @reload="() => getTreeData()"
        :actions="['doc', 'category']"
        :drag="false"
        :document_type="2"
        :is-tree="false"
      ></node-actions>
    </template>
    <vc-scrollbar>
      <a-spin :loading="loading" class="w-full min-h-full">
        <doc-tree
          v-model:currentNode="currentNode"
          draggable
          :document_type="2"
          :data="treeData"
          @drag-submit="handleDragSubmit"
          @reload="() => getTreeData()"
          @select="handleTreeSelect"
        />
      </a-spin>
    </vc-scrollbar>
  </a-card>
</template>

<script setup lang="tsx">
import {
  docDirApi,
  docIndexApi,
  type DocModeDragParams,
  type DocTreeModel
} from '@vca/apis/pedestal'

import DocTree from '@/components/DocTree'
import NodeActions from '@/components/NodeActions.vue'
import { restructureRecursively } from '@/utils/tree'

const currentNode = defineModel('currentNode')
const loading = ref(false)
const treeData = ref<DocTreeModel[]>([])
const emit = defineEmits(['tree-node-select'])

const handleTreeSelect = (selectedKeys: string[]) => {
  emit('tree-node-select', selectedKeys?.length ? selectedKeys[0] : undefined)
}

/** 加载目录树 */
const getTreeData = () => {
  loading.value = true
  docDirApi({ document_type: 2 })
    .then(res => {
      treeData.value = restructureRecursively(res?.list || [], '1')
    })
    .finally(() => {
      loading.value = false
    })
}

const handleDragSubmit = (data: DocModeDragParams) => {
  loading.value = true
  docIndexApi(data)
    .then(getTreeData)
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getTreeData()
})

defineExpose({ treeData })
</script>

<style lang="less" scoped>
.doc-sider-bar.arco-card {
  @apply flex flex-col shadow-none select-none border-color-1;
  width: 304px;
  min-width: 304px;
  height: 100%;
  border: 1px solid var(--color-border-2, #e5e6eb);
  border-radius: 6px;
  :deep(.arco-card-header) {
    @apply h-10 min-h-10 bg-fill-1;
    border: none;
    .arco-card-header-title {
      @apply flex items-center;
      &:hover {
        .node-actions {
          @apply opacity-100 flex;
        }
      }
    }
  }
  :deep(.arco-card-body) {
    padding: 0 !important;
    flex: 1;
    .vc-scrollbar {
      display: flex;
      flex-direction: column;
      .vc-scrollbar__wrap {
        flex: 1;
        flex-basis: 0;
      }
    }
  }
}

.arco-collapse {
  .arco-collapse-item {
    border-bottom: none;
    position: relative;
    .arco-collapse-item-header-title {
      font-size: 14px;
      color: var(--color-text-1, #1d2129);
      font-weight: 500;
      line-height: 20px;
    }
    .arco-collapse-item-header {
      border-bottom: none;
      height: 48px;
      &::after {
        position: absolute;
        right: 16px;
        bottom: 0;
        left: 16px;
        height: 1px;
        background-color: var(--color-border-2, #e5e6eb);
        content: '';
      }
      &:hover .extra-wrap {
        display: flex;
      }
    }
    .arco-collapse-item-header-right {
      padding-right: 38px;
      padding-left: 16px;
    }
    .arco-collapse-item-icon-right {
      right: 16px;
      font-size: 13px;
      color: #86909c;
      opacity: 0;
      transition: opacity 0.3s;
      &:hover {
        color: rgb(var(--primary-6));
        &::before {
          width: 22px;
          height: 22px;
          background-color: var(--color-border-2, #e5e6eb);
          border-radius: 4px;
        }
      }
    }

    &:hover,
    &.arco-collapse-item-active {
      .arco-collapse-item-icon-right {
        opacity: 1;
      }
    }
  }
}
</style>
