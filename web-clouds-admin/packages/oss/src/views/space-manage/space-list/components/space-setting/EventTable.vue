<template>
  <div class="space-setting-table mt-4">
    <div class="flex items-center justify-between mb-4">
      <div class="flex flex-col">
        <span class="space-table-title">事件通知</span>
        <span class="space-table-sub-title"
          >通过规则配置，可以及时获得所关心的存储资源操作的消息通知。（最多20条）</span
        >
      </div>

      <a-button
        type="primary"
        :disabled="(dataSource as EventListModel[])?.length>=20"
        @click="handleCommand('create')"
        >创建事件规则</a-button
      >
    </div>
    <a-table
      column-resizable
      :loading="loading"
      :columns="eventColumns"
      :data="pageList"
      :pagination="{ ...pageData }"
      @page-change="handlePageChange"
    >
      <template #prefix="{ record }">
        {{
          record?.prefix
            ? `前缀：${record?.prefix}`
            : record?.suffix
            ? `后缀：${record?.suffix}`
            : '整个空间'
        }}
      </template>
      <template #url="{ record }">
        <span v-for="(item, index) in record.callback_urls" :key="item">
          <span>{{ item }}</span>
          <span v-if="index !== record.callback_urls.length - 1">、</span>
        </span>
      </template>
      <template #actions="{ record }">
        <a-link
          :hoverable="false"
          @click="handleCommand('edit', record)"
          type="primary"
        >
          编辑
        </a-link>
        <a-link
          :hoverable="false"
          @click="handleCommand('del', record)"
          status="danger"
        >
          删除
        </a-link>
      </template>
      <template #pagination-left>
        <span class="pr-5">共{{ dataSource?.length }}条</span>
      </template>
    </a-table>
    <event-rules
      v-model="editorState.visible"
      v-model:loading="editorState.loading"
      v-model:record="editorState.record"
      v-model:list="dataSource"
      @reload="getTableList()"
    />
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { delEventApi, eventListApi, type EventListModel } from '@vca/apis/oss'
import { cloneDeep } from 'lodash-es'
import { VcModal } from 'vc-material'
import { useRoute } from 'vue-router'

import { eventColumns } from '../columns'
import EventRules from './EventRules.vue'

const route = useRoute()

const editorState = reactive<CommonState<EventListModel>>({
  visible: false,
  record: undefined,
  loading: false
})

const loading = ref<boolean>(false)

const dataSource = ref<EventListModel[] | undefined>([])
const pageList = ref<EventListModel[] | undefined>([])
const pageData = ref({
  pageSize: 5,
  currentPage: 1,
  total: 0
})

const getTableList = () => {
  loading.value = true
  eventListApi({ bucket_id: route.params.id as string })
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

const handleCommand = (command: ICommand, record?: EventListModel) => {
  const actions: Record<ICommand, () => void> = {
    create: () => {
      editorState.record = undefined
      editorState.visible = true
    },
    edit: () => {
      editorState.record = cloneDeep(record)
      editorState.visible = true
    },
    del: () => {
      const request = () =>
        delEventApi({
          bucket_id: route.params?.id as string,
          id: record!.id!
        }).then(() => {
          Message.success('删除成功')
          getTableList()
        })
      VcModal.error(
        {
          title: '删除规则',
          content: '确定要删除这条规则吗？'
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
