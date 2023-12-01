<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  docInfoApi,
  type DocModel,
  docUpdateApi,
  ResultEnum,
  uploadFileApi
} from '@vca/apis/pedestal'
import { EmptyGlobal, EmptySearch } from '@vca/shared'
import { has, pick } from 'lodash-es'

import TreeBar from './components/TreeBar.vue'

const treeRef = ref<InstanceType<typeof TreeBar>>()
const loading = ref<boolean>(false)
const formState = ref({
  id: '',
  title: '',
  content: ''
})

const currentNode = ref<DocModel>()
// 是否为编辑状态
const isEditor = ref(false)

watchEffect(() => {
  formState.value = pick(currentNode.value!, ['id', 'content', 'title']) as any
})

/** 保存 */
const handleSaveDoc = () => {
  if (!formState.value?.title?.trim()) {
    Message.clear()
    Message.error('请输入文档标题')
    return
  }
  loading.value = true
  docUpdateApi(formState.value)
    .then(() => {
      Message.success('保存成功')
      handleTreeNodeSelect(currentNode.value?.id)
      currentNode.value = { ...currentNode.value!, ...formState.value }
      handleCommand('cancel')
    })
    .finally(() => {
      loading.value = false
    })
}
type Command = 'save' | 'editor' | 'cancel'
/** 事件处理 */
const handleCommand = (command?: Command) => {
  const actions: Record<Command, () => void> = {
    save: handleSaveDoc,
    editor: () => {
      isEditor.value = true
    },
    cancel: () => {
      isEditor.value = false
      formState.value = pick(currentNode.value!, [
        'id',
        'content',
        'title'
      ]) as any
    }
  }
  if (command && has(actions, command)) {
    actions[command]()
  }
}
const handleUploadFn = (data: any, insertImage: (path: string) => void) => {
  uploadFileApi(data).then(({ data }) => {
    if (data.code !== ResultEnum.SUCCESS) {
      const message = data?.message ?? '上传失败'
      Message.error(message)
      throw new Error(message)
    } else {
      const filepath = data?.data.filepath ?? ''
      insertImage(filepath)
    }
  })
}
const handleTreeNodeSelect = (key?: string) => {
  if (!key) return
  loading.value = true
  docInfoApi({ id: key })
    .then(res => {
      currentNode.value = res!
    })
    .finally(() => {
      loading.value = false
    })
}

const isEmpty = computed(() => !currentNode.value?.content?.trim())

const hasChild = computed(() => {
  if (!currentNode.value?.id) return false
  if (currentNode.value.file_type === 2) return false

  const treeData = treeRef.value?.treeData || {}
  const list = Object.values(treeData).flat()
  if (!list.length) return false

  const getResult = (data: any) => {
    const result = data.some((v: any) => {
      if (v.id === currentNode.value?.id) return !!v?.children?.length
      if (v.children?.length) return getResult(v.children)
      return false
    })
    return result
  }

  return getResult(list)
})
</script>

<template>
  <vc-container
    class="document-container"
    admin
    header-bordered
    page-title="常见问题"
  >
    <tree-bar
      ref="treeRef"
      @tree-node-select="handleTreeNodeSelect"
      v-model:current-node="currentNode"
    ></tree-bar>
    <a-layout-content class="flex-1 overflow-hidden">
      <a-spin :loading="loading" class="w-full h-full">
        <template v-if="currentNode?.id">
          <a-page-header
            class="doc-editor_wrap"
            :show-back="false"
            :title="formState.title"
          >
            <template #title>
              <a-input
                class="title-input"
                v-if="isEditor"
                :max-length="20"
                v-model="formState.title"
                placeholder="请输入文档标题"
              ></a-input>
              <template v-else>
                {{ formState.title }}
              </template>
            </template>
            <template v-if="!isEditor" #subtitle>
              <a-space>
                <template #split>
                  <a-divider margin="0" direction="vertical" />
                </template>
                <div>{{ currentNode.create_account || '-' }}</div>
                <div><span v-uts="currentNode.created_at"></span> 创建</div>
                <div><span v-uts="currentNode.updated_at"></span> 更新</div>
              </a-space>
            </template>
            <template v-if="currentNode.file_type === 2" #extra>
              <a-space>
                <template v-if="isEditor">
                  <a-button @click="handleCommand('cancel')">取消</a-button>
                  <a-button @click="handleCommand('save')" type="primary">
                    保存
                  </a-button>
                </template>
                <a-button
                  v-else
                  type="primary"
                  @click="handleCommand('editor')"
                >
                  编辑
                </a-button>
              </a-space>
            </template>

            <template v-if="isEmpty">
              <empty-global :size="96" v-if="currentNode.file_type === 1">{{
                hasChild ? '请在左侧选择文档' : '该分类下还没有文档'
              }}</empty-global>

              <empty-global :size="96" v-else-if="currentNode.file_type === 2"
                >未输入内容</empty-global
              >
            </template>

            <vc-rich-text-editor
              v-else
              :uploadFn="handleUploadFn"
              :maxLength="isEditor ? 10000 : undefined"
              :toolbar-visible="isEditor"
              :readonly="!isEditor"
              v-model="formState.content"
            ></vc-rich-text-editor>
          </a-page-header>
        </template>
        <empty-search v-else :size="96"
          >暂无数据，请在左侧选择文档</empty-search
        >
      </a-spin>
    </a-layout-content>
  </vc-container>
</template>
