<script setup lang="ts">
import { Message, type SelectOptionData } from '@arco-design/web-vue'
import {
  getUserGroupsListApi,
  getUsersListApi,
  updateUserApi
} from '@vca/apis/pedestal'
import type { UserModel } from '@vca/apis/src/pedestal'
import { cloneDeep } from 'lodash-es'
import { useListRequest, useTable } from 'vc-material'

import columns from './columns'
import EditorDialog from './components/EditorDialog.vue'
import JoinGroup from './components/JoinGroup.vue'
import filterBarScheme from './filterBarScheme'
const filterBarRef = ref()
const state = ref<Record<string, any>>({})
const {
  pagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(getUsersListApi, state)

const { tableRef, selectedKeys, createSortChange, checkAll, indeterminate } =
  useTable(dataSource)

const handleSortChange = createSortChange(getTableList, state)

const editorState = reactive<CommonState>({
  visible: false,
  record: undefined
})

const joinState = reactive<CommonState>({
  visible: false,
  record: undefined
})
const route = useRoute()
const router = useRouter()
const userId = ref('')
const userResetVisible = ref(false)
const groups = ref<SelectOptionData[]>([])

const handleSearch = () => {
  pagination.page = 1
  if (route.query?.groupId !== state.value?.group_id) {
    router.replace({
      ...route,
      query: { ...(route?.query || {}), user_id: undefined }
    })
    getTableList()
  }
}

const getUserGroups = () => {
  getUserGroupsListApi({ limit: 0 }).then(res => {
    const data = (res.list ?? []).map(item => ({
      id: String(item.id),
      is_default: item.is_default,
      label: String(item.name),
      value: String(item.id)
    }))
    groups.value = data

    filterBarRef.value?.setFieldSchema('group_id', {
      attrs: {
        options: [{ label: '全部分组', value: '0' }].concat(data)
      }
    })
    getTableList()
  })
}
type ICommand = 'CREATE' | 'EDITOR' | 'DETAIL' | 'STATUS' | 'RESET' | 'JOIN'

/** 事件处理集合 */
const handleCommand = (command: ICommand, record?: UserModel) => {
  const actions: Record<ICommand, () => void> = {
    CREATE() {
      editorState.record = undefined
      editorState.visible = true
    },
    RESET: () => {
      userId.value = record!.id!
      userResetVisible.value = true
    },
    EDITOR() {
      getUserGroups()
      editorState.record = cloneDeep(record)
      editorState.visible = true
    },
    /** 状态切换事件 */
    STATUS() {
      const request = () => {
        return new Promise<void>((resolve, reject) => {
          loading.value = true
          updateUserApi({
            id: record?.id ?? '',
            status: record?.status === 1 ? 2 : 1
          })
            .then(() => {
              Message.success(record?.status === 1 ? '禁用成功' : '启用成功')
              getTableList()
              resolve()
            })
            .finally(() => {
              loading.value = false
            })
            .catch(() => reject())
        })
      }

      if (record?.status !== 1) {
        request()
      } else {
        VcModal.error(
          {
            okText: '禁用',
            title: '确认禁用用户',
            content: '确定要禁用该用户吗？'
          },
          request
        )
      }
    },
    JOIN() {
      getUserGroups()
      joinState.visible = true
    },
    DETAIL() {
      router.push({
        name: 'UserDetails',
        params: { userId: record?.id ?? '', groupId: record?.group_id ?? '' }
      })
    }
  }
  actions[command]()
}

onActivated(() => {
  const groupId = route.query?.groupId
  if (groupId) {
    filterBarRef.value?.setFieldValue('group_id', groupId)
  }

  getUserGroups()
  getTableList()
})
</script>

<template>
  <vc-container admin page-title="用户列表" header-bordered>
    <vc-filter-bar
      ref="filterBarRef"
      class="mb-4"
      :loading="loading"
      v-model:page="pagination.page"
      v-model="state"
      :schemas="filterBarScheme"
      @search="handleSearch"
    >
      <template #prefix>
        <a-button @click="handleCommand('CREATE')" type="primary">
          添加用户
        </a-button>
      </template>
    </vc-filter-bar>
    <vc-table
      row-key="id"
      ref="tableRef"
      class="mt-4"
      :bordered="false"
      :data="dataSource"
      :columns="columns"
      column-resizable
      @sorter-change="handleSortChange"
      @get-list="getTableList"
      :page-data="pagination"
      :loading="loading"
      is-selection
      v-model:selectedKeys="selectedKeys"
    >
      <template #id="{ record }">
        <span class="cursor-pointer" @click="handleCommand('DETAIL', record)">
          {{ record.id }}
        </span>
      </template>
      <template #pagination-left>
        <a-checkbox v-model="checkAll" :indeterminate="indeterminate" />
        <a-button
          :disabled="!selectedKeys.length"
          type="outline"
          class="ml-3"
          @click="handleCommand('JOIN')"
        >
          加入分组
        </a-button>
      </template>

      <template #status="{ record }">
        <a-switch
          :model-value="record?.status"
          inlinePrompt
          :before-change="() => handleCommand('STATUS', record)"
          :unchecked-value="2"
          :checked-value="1"
        ></a-switch>
      </template>
      <template #actions="{ record }">
        <a-link
          @click="handleCommand('EDITOR', record)"
          :hoverable="false"
          type="primary"
        >
          编辑
        </a-link>
        <a-link @click="handleCommand('DETAIL', record)" :hoverable="false">
          详情
        </a-link>
        <a-link :hoverable="false" @click="handleCommand('RESET', record)">
          重置密码
        </a-link>
      </template>
    </vc-table>
    <editor-dialog
      :groups="groups"
      v-model="editorState.visible"
      v-model:record="editorState.record"
      @reload="getTableList"
    />

    <join-group
      :groups="groups"
      @reload="getTableList"
      :ids="selectedKeys"
      v-model:visible="joinState.visible"
    ></join-group>

    <reset-password
      v-model="userResetVisible"
      :record-id="userId"
    ></reset-password>
  </vc-container>
</template>
