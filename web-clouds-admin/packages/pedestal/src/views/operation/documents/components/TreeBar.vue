<template>
  <a-card class="doc-sider-bar">
    <vc-scrollbar>
      <a-spin :loading="loading" class="w-full min-h-full">
        <a-collapse
          expand-icon-position="right"
          :bordered="false"
          v-model:active-key="activeKeys"
        >
          <template #expand-icon="{ active }">
            <icon-down :class="['transition-all	', { '-rotate-180': active }]" />
          </template>
          <a-collapse-item
            v-for="(item, i) in products"
            :header="item.name"
            :key="item.id"
          >
            <template #extra>
              <node-actions
                v-model:currentNode="currentNode"
                @reload="handleLoadProductTree(item.id!)"
                :actions="['doc', 'category']"
                :node-data="item"
                :drag="false"
                :is-tree="false"
              ></node-actions>
            </template>
            <a-empty v-if="!treeData(item.id!).length" />
            <doc-tree
              ref="treeRefs"
              draggable
              :data="treeData(item.id!)"
              @drag-submit="handleDragSubmit"
              v-model:currentNode="currentNode"
              @reload="handleLoadProductTree(item.id!)"
              @select="(keys: string[]) => handleTreeSelect(keys,i)"
            />
          </a-collapse-item>
        </a-collapse>
      </a-spin>
    </vc-scrollbar>
  </a-card>
</template>

<script setup lang="tsx">
import { IconDown } from '@arco-design/web-vue/es/icon'
import {
  docDirApi,
  docIndexApi,
  type DocModeDragParams,
  type DocModel,
  productListApi,
  type ProductModel
} from '@vca/apis/pedestal'
import { has } from 'lodash-es'

import DocTree from '@/components/DocTree'
import NodeActions from '@/components/NodeActions.vue'
import { restructureRecursively } from '@/utils/tree'
const treeRefs = ref([])

const loading = ref(false)
const emit = defineEmits(['tree-node-select'])

const currentNode = defineModel<DocModel>('currentNode')

const treeData = computed(() => (key: string) => {
  if (treeDataMaps.value && has(treeDataMaps.value, key)) {
    return treeDataMaps.value[key]
  }
  return []
})
/* 当前打开的面板 */
const activeKeys = ref<string[]>([])
const treeDataMaps = ref<Record<string, DocModel[]>>({})
watch(
  activeKeys,
  (newValue, oldValue) => {
    const res = compareArray(newValue, oldValue)
    if (res?.type === 'add' && res?.value) {
      handleLoadProductTree(res.value)
    }
  },
  { deep: true }
)

const handleDragSubmit = (data: DocModeDragParams) => {
  loading.value = true
  docIndexApi(data)
    .then(() => {
      handleLoadProductTree(data.product_id!)
    })
    .finally(() => {
      loading.value = false
    })
}

// watchPostEffect(() => {
//   treeRefs.value.map((item: any) => {
//     console.log(item)
//   })
//   console.log(treeRefs.value)
// })

const products = ref<ProductModel[]>([])
/** 获取产品列表 */
const getProducts = () => {
  loading.value = true
  productListApi({})
    .then(res => {
      if (res.list?.length) {
        products.value = res.list
      }
    })
    .finally(() => {
      loading.value = false
    })
}

/** 加载产品对应的目录树 */
const handleLoadProductTree = (product_id: string) => {
  loading.value = true
  docDirApi({ product_id: product_id, document_type: 1 })
    .then(res => {
      const data = restructureRecursively(res?.list || [], '1')
      treeDataMaps!.value![product_id] = data
    })
    .finally(() => (loading.value = false))
}

const handleTreeSelect = (selectedKeys: string[], index: number) => {
  if (!selectedKeys?.length) {
    emit('tree-node-select', undefined)
    return
  }
  treeRefs.value.forEach((item: any, idx: number) => {
    if (idx !== index) {
      item?.clearSelected()
    }
  })
  emit('tree-node-select', selectedKeys[0])
}

onMounted(() => {
  getProducts()
})

defineExpose({ treeData: treeDataMaps })
</script>

<style lang="less" scoped>
.doc-sider-bar.arco-card {
  @apply flex flex-col shadow-none select-none overflow-hidden;
  width: 304px;
  min-width: 304px;
  border: 1px solid var(--color-border-2, #e5e6eb);
  border-radius: 6px;
  :deep(.arco-card-body) {
    padding: 0 !important;
    @apply h-full;
    // & > .arco-scrollbar {
    //   @apply h-full overflow-hidden;
    //   .arco-scrollbar-container {
    //     @apply h-full overflow-y-auto;
    //   }
    // }

    .arco-collapse-item-content {
      padding: 0;
      background-color: #fff;
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
  }
}
</style>
