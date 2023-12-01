<template>
  <div class="space-setting-table">
    <div class="flex items-center justify-between mb-4">
      <div class="flex flex-col">
        <span class="space-table-title">生命周期设置</span>
        <span class="space-table-sub-title"
          >通过规则配置可以定期删除相匹配的文件，及时自动清除不需要的数据。（最多100条）</span
        >
      </div>
      <a-button
        type="primary"
        :disabled="(dataSource as LifeCycleModel[])?.length >= 100"
        @click="handleCommand('create')"
        class="add-btn"
        >添加规则</a-button
      >
    </div>
    <a-table
      v-if="pageList!.length > 0"
      column-resizable
      :loading="loading"
      :columns="lifeColumns"
      :data="pageList"
      :pagination="{ ...pageData }"
      @page-change="handlePageChange"
    >
      <template #prefix="{ record }">
        {{
          record?.prefix ? `对前缀生效：${record?.prefix}` : '对整个空间生效'
        }}
      </template>
      <template #expire_days="{ record }">
        删除文件:
        {{ record.expire_days ?? 0 }}天
      </template>
      <template #actions="{ record, rowIndex }">
        <a-link
          :hoverable="false"
          @click="handleCommand('edit', record)"
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
    <span v-else class="text-sm text-ct-4 leading-5">暂无规则</span>
    <life-rule
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
import { editCycleApi, lifeCycleApi, type LifeCycleModel } from '@vcp/apis/oss'
import { cloneDeep } from 'lodash-es'
import { VcModal } from 'vc-material'
import { useRoute } from 'vue-router'

import { lifeColumns } from '../columns'
import LifeRule from './drawer/LifeRule.vue'

const route = useRoute()
const loading = ref<boolean>(false)

const dataSource = ref<LifeCycleModel[]>([])
const pageList = ref<LifeCycleModel[]>([])
const pageData = ref({
  pageSize: 5,
  currentPage: 1,
  total: 0
})

const getTableList = () => {
  loading.value = true
  lifeCycleApi({ bucket_id: route.params.id as string })
    .then(res => {
      dataSource.value = res.list || []
      pageData.value.total = res.list?.length as number
      if (pageList.value?.length === 1 && pageData.value.currentPage !== 1) {
        pageData.value.currentPage -= 1
      }
      const { currentPage, pageSize } = pageData.value
      pageList.value =
        res.list?.slice((currentPage - 1) * pageSize, currentPage * pageSize) ??
        []
    })
    .finally(() => {
      loading.value = false
    })
}

const editorState = reactive<CommonState<LifeCycleModel>>({
  visible: false,
  record: undefined,
  loading: false
})

const handlePageChange = (page: number) => {
  pageData.value.currentPage = page

  getTableList()
}

type ICommand = 'del' | 'edit' | 'create'

const handleCommand = (
  command: ICommand,
  record?: LifeCycleModel,
  index?: number
) => {
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
      const obj_list = cloneDeep(dataSource.value)
      //@ts-ignore
      obj_list.splice(index as number, 1)

      const request = () =>
        editCycleApi({
          bucket_id: route.params?.id as string,
          rules: obj_list
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
<style lang="less" scoped>
.space-setting-table {
  max-height: 300px;
  cursor: pointer;
  .add-btn {
    display: none;
  }
  &:hover {
    .add-btn {
      display: block;
    }
  }
}
</style>
