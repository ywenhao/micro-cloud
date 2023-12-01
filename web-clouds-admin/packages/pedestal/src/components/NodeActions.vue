<template>
  <div
    class="extra-wrap"
    :class="{ 'flex! opacity-100!': popoverVisible || visible }"
  >
    <a-dropdown
      @popup-visible-change="handlePopupVisibleChange"
      @select="handleSelect"
      class="vc-dropdown"
      trigger="click"
    >
      <a-popover
        trigger="click"
        :popup-visible="popoverVisible"
        @update:popup-visible="handleUpdatePopupVisible"
        position="br"
        popup-container="body"
        :arrow-style="{ display: 'none' }"
        :content-style="{ padding: '8px' }"
        content-class="doc-input-wrap"
      >
        <div
          @click.stop
          class="icon-box"
          :class="{ 'is-active': popoverVisible || visible }"
        >
          <vc-svg-icon
            class="vc-icon-button"
            :size="16"
            :name="isTree ? 'more-vertical' : 'plus'"
          ></vc-svg-icon>
        </div>
        <template #content>
          <div class="flex items-center">
            <a-input
              ref="autofocusRef"
              :disabled="loading"
              v-model="content"
              :max-length="20"
              :placeholder="`${
                createType === 1
                  ? '请输入分类名称，按回车保存'
                  : '请输入文档名称，按回车保存'
              }`"
              @press-enter="handleEditorDoc"
            >
              <template #suffix>
                <vc-svg-icon
                  class="cursor-pointer"
                  @click="handleEditorDoc"
                  name="enter"
                />
              </template>
            </a-input>
            <a-button
              :disabled="loading"
              class="bg-transparent!"
              @click="handleResetEditor"
            >
              取消
            </a-button>
          </div>
        </template>
      </a-popover>
      <template #content>
        <a-doption
          v-if="actions.includes('category')"
          :value="actionData('product')"
        >
          新建分类
        </a-doption>
        <a-doption v-if="actions.includes('sub')" :value="actionData('sub')">
          新建子类
        </a-doption>
        <a-doption v-if="actions.includes('doc')" :value="actionData('doc')">
          新建文档
        </a-doption>
        <a-doption
          v-if="actions.includes('rename')"
          :value="actionData('rename')"
        >
          重命名
        </a-doption>
        <a-doption
          v-if="actions.includes('delete')"
          :value="actionData('delete')"
        >
          删除
        </a-doption>
      </template>
    </a-dropdown>
    <vc-svg-icon
      v-if="drag"
      @click.stop
      class="vc-icon-button cursor-move!"
      :size="16"
      name="drag"
    ></vc-svg-icon>
  </div>
  <slot name="expend" v-bind="nodeData || {}"></slot>
</template>

<script setup inheritAttrs lang="ts">
import {
  type InputInstance,
  Message,
  type TreeNodeData
} from '@arco-design/web-vue'
import {
  docCreateApi,
  docDelApi,
  type DocModel,
  type ProductModel
} from '@vca/apis/pedestal'
import { VcModal } from 'vc-material'

const route = useRoute()
const isDoc = computed(() =>
  String(route.name).toLowerCase().includes('documents')
)
const currentNode = defineModel<DocModel>('currentNode')
type Action = 'category' | 'sub' | 'doc' | 'rename' | 'delete'
const loading = ref(false)
const autofocusRef = ref<InputInstance>()
const content = ref('')
const props = withDefaults(
  defineProps<{
    document_type?: 1 | 2
    drag?: boolean
    isTree?: boolean
    actions?: Action[]
    nodeData?:
      | (TreeNodeData & {
          [k in string]: any
        })
      | ProductModel
  }>(),
  { actions: () => [], drag: true, isTree: true, document_type: 1 }
)

const visible = ref(false)
const popoverVisible = ref(false)
const handlePopupVisibleChange = (value: boolean) => {
  visible.value = value
}

const emit = defineEmits(['rename', 'reload'])
const handleSelect = (value: any) => {
  if (value.type === 'rename') {
    emit('rename', value, props.nodeData)
    return
  }

  if (value.type === 'delete') {
    if (value?.children?.length) {
      Message.error('不允许删除,该分类下有子类或文档')
      return
    }
    const request = () =>
      docDelApi({ id: value.id }).then(() => {
        Message.success('删除成功')
        if (currentNode.value?.id === value.id) {
          currentNode.value = undefined
        }
        emit('reload')
      })
    const msg = isDoc.value ? '文档' : '问题'
    const title = value.file_type === 1 ? '删除分类' : `删除${msg}`
    const text =
      value.file_type === 1 ? '确定要删除该分类吗？' : `确定要删除该${msg}吗？`
    VcModal.error({ title, content: text }, request)
  } else {
    createType.value = value.type === 'doc' ? 2 : 1
    popoverVisible.value = true
  }
}

const handleEditorDoc = () => {
  if (!content.value.trim()) {
    Message.error('请输入名称')
    return
  }
  loading.value = true
  const data: any = {
    // 文件类型{1:目录，2：文本}
    file_type: createType.value,
    title: content.value,
    parent_id: String(
      !props.nodeData || props.nodeData?.symbol ? 1 : props?.nodeData?.id
    ),
    product_id:
      props.nodeData && props.document_type === 1
        ? props.nodeData?.symbol
          ? props.nodeData?.id
          : (props.nodeData as DocModel).product_id!
        : undefined,
    // 文档类型{1:产品文档，2：常见问题}
    document_type: props.document_type
  }
  docCreateApi(data)
    .then(() => {
      handleResetEditor()
      Message.success('创建成功')
      emit('reload')
    })
    .finally(() => {
      loading.value = false
    })
}

const handleResetEditor = () => {
  content.value = ''
  popoverVisible.value = false
}
const handleUpdatePopupVisible = () => {
  popoverVisible.value = false
}
const createType = ref(1)
watch(popoverVisible, async () => {
  await nextTick()
  autofocusRef.value?.focus()
})
const actionData = computed(
  () => (type: 'product' | 'doc' | 'rename' | 'delete' | 'sub') => {
    const res = {
      ...props.nodeData,
      type
    }
    return res
  }
)
</script>

<style lang="less" scoped>
.icon-box {
  display: inline-block;
  padding: 3px;
  color: #86909c;
  transition: 0.3s;
  cursor: pointer;
  line-height: 1;
  &:hover,
  &.is-active {
    background: var(--color-fill-3, #e5e6eb);
    border-radius: 4px;
    .vc-icon-button {
      color: rgb(var(--primary-6));
    }
  }
}
</style>

<style lang="less">
.doc-input-wrap {
  .arco-input-wrapper {
    padding-right: 8px;
    padding-left: 8px;
    .arco-input.arco-input-size-medium {
      padding-top: 6px;
      padding-bottom: 6px;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
    }
    .arco-input-suffix {
      padding-left: 8px;
      .svg-icon {
        width: 14px;
        height: 14px;
      }
    }
  }
  .arco-btn-size-medium {
    padding-right: 8px;
    padding-left: 8px;
  }
}
</style>
