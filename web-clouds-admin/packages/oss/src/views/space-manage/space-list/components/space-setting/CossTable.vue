<template>
  <div class="space-setting-table mt-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex flex-col">
        <span class="space-table-title">跨域设置</span>
        <span class="space-table-sub-title"
          >设置 CORS 规则，可以根据需求允许或者拒绝相应的 JavaScript
          跨域请求。（最多10条）</span
        >
      </div>
      <div>
        <a-button
          type="outline"
          class="mr-3!"
          :disabled="!pageList?.length"
          @click="handleCommand('del')"
          >清空全部规则</a-button
        >
        <a-button
          type="primary"
          @click="handleCommand('create')"
          :disabled="(dataSource as CorsListModel[])?.length >= 10"
          >添加规则</a-button
        >
      </div>
    </div>
    <a-table
      column-resizable
      :loading="loading"
      :columns="cossColumns"
      :data="pageList"
      :pagination="{ ...pageData }"
      @page-change="handlePageChange"
    >
      <template #allowed_origins="{ record }">
        <span v-for="(item, index) in record.allowed_origins" :key="item"
          >{{ item }}
          <span v-if="index !== record.allowed_origins.length - 1">、</span>
        </span>
      </template>
      <template #allowed_methods="{ record }">
        <span v-for="(item, index) in record.allowed_methods" :key="item"
          >{{ item }}
          <span v-if="index !== record.allowed_methods.length - 1">、</span>
        </span>
      </template>
      <template #allowed_headers="{ record }">
        <span v-for="(item, index) in record.allowed_headers" :key="item"
          >{{ item }}
          <span v-if="index !== record.allowed_headers.length - 1">、</span>
        </span>
      </template>
      <template #expose_headers="{ record }">
        <span v-for="(item, index) in record.expose_headers" :key="item"
          >{{ item }}
          <span v-if="index !== record.expose_headers.length - 1">、</span>
        </span>
      </template>
      <template #actions="{ record, rowIndex }">
        <a-link
          :hoverable="false"
          @click="handleCommand('edit', record, rowIndex)"
          type="primary"
        >
          编辑
        </a-link>
        <a-link
          :hoverable="false"
          @click="handleCommand('del', record, rowIndex)"
          status="danger"
        >
          删除
        </a-link>
      </template>
      <template #pagination-left>
        <span class="pr-5">共{{ dataSource?.length }}条</span>
      </template>
    </a-table>
    <domain-rules
      v-model="editorState.visible"
      v-model:loading="editorState.loading"
      v-model:record="editorState.record"
      v-model:rowIndex="editorState.rowIndex"
      v-model:list="dataSource"
      @reload="getTableList()"
    />
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  cleanCorsApi,
  corsListApi,
  type CorsListModel,
  editCorsApi
} from '@vca/apis/oss'
import { cloneDeep } from 'lodash-es'
import { VcModal } from 'vc-material'
import { useRoute } from 'vue-router'

import { cossColumns } from '../columns'
import DomainRules from './DomainRules.vue'

const route = useRoute()

const editorState = reactive<
  CommonState<CorsListModel> & { rowIndex?: number | undefined }
>({
  visible: false,
  record: undefined,
  rowIndex: undefined,
  loading: false
})

const loading = ref<boolean>(false)

const dataSource = ref<CorsListModel[] | undefined>([])
const pageList = ref<CorsListModel[] | undefined>([])
const pageData = ref({
  pageSize: 5,
  currentPage: 1,
  total: 0
})

const getTableList = () => {
  loading.value = true
  corsListApi({ bucket_id: route.params.id as string })
    .then(res => {
      dataSource.value = res.list
      pageData.value.total = res.list?.length as number
      if (pageList.value?.length === 1 && pageData.value.currentPage !== 1) {
        pageData.value.currentPage -= 1
      }
      const { currentPage, pageSize } = pageData.value
      pageList.value = res.list?.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      )
    })
    .finally(() => {
      loading.value = false
    })
}

const handlePageChange = (page: number) => {
  pageData.value.currentPage = page

  getTableList()
}

type ICommand = 'del' | 'edit' | 'create'

const handleCommand = (
  command: ICommand,
  record?: CorsListModel,
  index?: number
) => {
  const actions: Record<ICommand, () => void> = {
    create: () => {
      editorState.record = undefined
      editorState.rowIndex = undefined
      editorState.visible = true
    },
    edit: () => {
      editorState.record = cloneDeep(record)
      editorState.rowIndex = index
      editorState.visible = true
    },
    del: () => {
      const obj_list = cloneDeep(dataSource.value)
      if (record) {
        //@ts-ignore
        obj_list.splice(index as number, 1)
      }
      const action = record ? editCorsApi : cleanCorsApi

      const request = () =>
        action({
          bucket_id: route.params?.id as string,
          rules: record ? obj_list : undefined
        }).then(() => {
          Message.success('删除成功')
          getTableList()
        })
      VcModal.error(
        {
          title: `${record ? '删除规则' : '清空全部规则'}`,
          content: `确定要${record ? '删除这条' : '清空全部规则'}规则吗？`
        },
        request
      )
    }
  }
  actions[command]()
}

onMounted(() => {
  getTableList()
})
</script>
