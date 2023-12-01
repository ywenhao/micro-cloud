<template>
  <vc-container
    admin
    header-bordered
    class="rounded-sm! region-manage"
    page-title="区域管理"
  >
    <vc-filter-bar
      v-model="state"
      :schemas="filterBarScheme"
      @search="handleSearch"
    >
      <template #prefix>
        <a-button type="primary" @click="handleCommand('create')"
          >新建</a-button
        >
      </template>
    </vc-filter-bar>

    <a-table
      column-resizable
      :bordered="false"
      :loading="loading"
      :columns="columns"
      :data="dataSource"
      :pagination="false"
      class="mt-4"
      :row-class="'current-table-row'"
    >
      <template #remark="{ record }">
        <vc-remark-input
          :content="record.remark"
          :maxLength="20"
          :on-submit="(v:string) => editRemark(record, v)"
        ></vc-remark-input>
      </template>
      <template #domain_id="{ record }">
        {{ record.domain_name || '-' }}
      </template>
      <template #total_kb="{ record }">
        {{ convertByte(Number(record.total_kb) * 1024) }}
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
          :disabled="record.bucket_num !== '0'"
          @click="handleCommand('del', record)"
          status="danger"
        >
          <a-tooltip
            :disabled="record.bucket_num === '0'"
            position="br"
            content-class="delete-tigger"
          >
            <span>删除</span>
            <template #content>
              <div class="p-1 rounded bg-white flex flex-col text-sm">
                <span class="text-ct-1 font-medium pb-[6px] flex items-center">
                  <img src="@/assets/svgs/icon_warn.svg" class="mr-1" alt="" />
                  不可删除</span
                >
                <span class="text-ct-2">区域下存在空间，不可删除</span>
              </div>
            </template>
          </a-tooltip>
        </a-link>
      </template>
    </a-table>
    <!-- 新建/编辑 -->
    <editor-drawer
      v-model="editorState.visible"
      v-model:loading="editorState.loading"
      v-model:record="editorState.record"
      @reload="handleAddRegion"
    ></editor-drawer>
  </vc-container>
</template>

<script setup lang="tsx">
import { Message } from '@arco-design/web-vue'
import {
  regionDelApi,
  regionListApi,
  type RegionTypeModel,
  updateRegionApi
} from '@vca/apis/oss'
import { pick } from 'lodash-es'
import { cloneDeep } from 'lodash-es'
import { convertByte, useListRequest, VcModal } from 'vc-material'

import { useAppStore } from '@/stores/modules/app'

import columns from './columns'
import EditorDrawer from './components/EditorDrawer.vue'
import filterBarScheme from './filterBarScheme'

const useStore = useAppStore()

const state = ref({})
const {
  loading,
  data: dataSource,
  run: getTableList
} = useListRequest(regionListApi, state, {
  showTotal: true
})

const editorState = reactive<CommonState<RegionTypeModel>>({
  visible: false,
  record: undefined,
  loading: false
})

const handleSearch = () => {
  getTableList()
}

const handleAddRegion = () => {
  getTableList()
  useStore.GET_REGION_DATA_LIST()
}

type ICommand = 'del' | 'create' | 'edit'
const handleCommand = (command: ICommand, record?: RegionTypeModel) => {
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
        regionDelApi({ id: record!.id! }).then(() => {
          Message.success('删除成功')
          getTableList()
          useStore.GET_REGION_DATA_LIST()
        })
      VcModal.error(
        {
          title: '删除区域',
          content: '删除后不可恢复，确定删除？'
        },
        request
      )
    }
  }
  actions[command]()
}

// 修改备注
const editRemark = async (record: RegionTypeModel, v: string) => {
  const data = pick(
    {
      ...record,
      remark: v
    },
    ['id', 'name', 'ip', 'domain_id', 'remark']
  )
  try {
    //@ts-ignore
    await updateRegionApi(data).then(() => {
      Message.success('修改成功')
      getTableList()
    })
  } catch (e) {
    Message.error('请求错误，请稍后重试')
  }
}

onMounted(() => {
  getTableList()
})
</script>

<style scoped lang="less">
.region-manage {
  .vc-filter-bar {
    column-gap: 8px;
  }
  :deep(.current-table-row) {
    .edit-svg {
      @apply hidden;
    }
    &:hover {
      .edit-svg {
        display: inline-block;
      }
    }
  }
}
</style>
<style lang="less">
.delete-tigger {
  width: 300px;
  border: 1px solid #f2f3f5;
  box-shadow: 0px 5px 10px #f2f3f5;
  @apply bg-white;
}
.arco-tooltip-popup-arrow {
  background: #fff !important;
  box-shadow: 0px 5px 15px #a29e9e;
}
</style>
