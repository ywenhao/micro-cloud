<template>
  <vc-container page-title="节点管理" header-bordered admin>
    <vc-filter-bar
      ref="filterBarRef"
      @search="getList()"
      :loading="loading"
      v-model="filterData"
      :schemas="filterBarScheme"
      v-model:page="pagination.page"
    >
      <template #prefix>
        <a-button type="primary" @click="handleCommand('obtain')"
          >获取安装脚本</a-button
        >
      </template>
    </vc-filter-bar>
    <div table-box>
      <vc-table
        row-key="id"
        ref="tableRef"
        :data="tableData"
        :columns="columns"
        :bordered="false"
        @sorter-change="handleSortChange"
        @get-list="getList()"
        :page-data="pagination"
        :loading="loading"
      >
        <template #address="{ record }">
          <table-tips
            v-if="record.ip_warn === 1"
            :data="ipTipsData"
            icon="warning"
          >
            {{ emptyText(record.address) }}
          </table-tips>
          <vc-text-ell v-else>{{ emptyText(record.address) }}</vc-text-ell>
        </template>
        <template #version="{ record }">
          <div class="flex items-center">
            {{ record.version || '-' }}

            <a-tag
              color="green"
              v-if="record.is_update"
              @click="handleCommand('update', record)"
              hover="opacity-80"
              class="text-12px! leading-18px! ml-2 py-0! px-1! py-1px! rounded-4px! cursor-pointer"
            >
              有更新
              <vc-svg-icon
                class="ml-2px"
                name="upgrade"
                prefix="mts"
                :size="14"
              />
            </a-tag>
          </div>
        </template>
        <template #remark="{ record }">
          <span v-if="record.status === 3" v-table-cell="record.remark"></span>
          <vc-remark-input
            v-else
            :content="record.remark"
            :on-submit="(v:string) => editRemark(record,v)"
          ></vc-remark-input>
        </template>
        <template #action="{ record }">
          <a-link @click="handleCommand('edit', record)">编辑</a-link>
          <a-link @click="handleCommand('nodeDetails', record)" class="mr-4"
            >节点详情</a-link
          >
          <a-dropdown
            class="down-menu"
            @select="(v) => handleCommand(v as Command, record)"
          >
            <vc-svg-icon
              prefix="mts"
              name="table_actions"
              :size="16"
              class="cursor-pointer"
            ></vc-svg-icon>
            <template #content>
              <a-doption value="update" v-if="record.is_update">升级</a-doption>
              <a-doption value="taskDetails">任务详情</a-doption>
              <a-doption value="delete" class="text-danger!">删除</a-doption>
            </template>
          </a-dropdown>
        </template>
      </vc-table>
    </div>
    <obtain-install-script
      v-model="obtainState.visible"
    ></obtain-install-script>
    <node-detail
      @reload="getList()"
      v-model="detailState.visible"
      :id="detailState.record"
    ></node-detail>
    <edit-node
      v-model="editState.visible"
      :record="editState.record"
      @submit="getList()"
    ></edit-node>
    <upgrade-dialog
      v-model="updateState.visible"
      :record="updateState.record"
      @submit="getList()"
    ></upgrade-dialog>
  </vc-container>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import type { NodeItemModel } from '@vca/apis/mts'
import {
  deleteMtsNodeApi,
  getMtsNodeApi,
  updateMtsNodeApi
} from '@vca/apis/mts'
import { regionListApi } from '@vca/apis/oss'
import {
  decPageByData,
  emptyText,
  useListRequest,
  useTable,
  VcModal
} from 'vc-material'

import TableTips from '@/components/TableTips.vue'

import { ipTipsData } from '../state'
import { columns } from './columns'
import EditNode from './components/EditNode.vue'
import NodeDetail from './components/NodeDetail.vue'
import ObtainInstallScript from './components/ObtainInstallScript.vue'
import UpgradeDialog from './components/UpgradeDialog.vue'
import { filterBarScheme } from './scheme'
const filterData = reactive({
  name: '',
  ip: ''
})
const {
  loading,
  pagination,
  run: getList,
  data: tableData
} = useListRequest(getMtsNodeApi, filterData)
const { tableRef, createSortChange } = useTable(tableData)
const router = useRouter()
const handleSortChange = createSortChange(getList, filterData)

const filterBarRef = ref()
const obtainState = reactive<CommonState>({
  visible: false,
  record: undefined
})
const detailState = reactive<CommonState>({
  visible: false,
  record: undefined
})
const editState = reactive<CommonState<NodeItemModel | undefined>>({
  visible: false,
  record: undefined
})
const updateState = reactive<CommonState<NodeItemModel | undefined>>({
  visible: false,
  record: undefined
})
type Command =
  | 'obtain'
  | 'edit'
  | 'nodeDetails'
  | 'update'
  | 'taskDetails'
  | 'delete'
const handleCommand = (command: Command, record?: NodeItemModel) => {
  const map: Record<Command, () => void> = {
    obtain() {
      detailState.record = record?.id
      obtainState.visible = true
    },
    edit() {
      editState.record = record!
      editState.visible = true
      return record
    },
    nodeDetails() {
      detailState.record = record?.id!
      detailState.visible = true
    },
    update() {
      updateState.visible = true
      updateState.record = record!
    },
    taskDetails() {
      router.push({ name: 'TaskManage', query: { node_id: record?.id } })
    },

    delete() {
      const request = () =>
        deleteMtsNodeApi({ id: record?.id! }).then(() => {
          Message.success('删除成功')
          decPageByData(pagination, tableData)
          getList()
        })

      VcModal.error(
        {
          title: '删除节点',
          content: '删除后会导致转码整体性能变弱，是否确定删除？'
        },
        request
      )
    }
  }
  map[command]()
}

const editRemark = async (record: NodeItemModel, v: string) => {
  const data = {
    id: record.id!,
    remark: v,
    update_type: 2
  }
  await updateMtsNodeApi(data)
  Message.success('修改成功')
  getList()
}

const getArea = () => {
  regionListApi({}).then(res => {
    const list = res.list ?? []
    filterBarRef.value?.setFieldSchema('region_id', {
      attrs: {
        options: [{ label: '全部区域', value: '0' }].concat(
          list.map(v => ({ label: v.name!, value: v.id! }))
        )
      }
    })
  })
}

onMounted(() => {
  getList()
  getArea()
})
</script>

<style lang="less">
.down-menu {
  .arco-dropdown {
    padding: 8px;
    .arco-dropdown-option {
      padding: 0 12px;
      width: 80px;
      height: 36px;
      &:not(.arco-dropdown-option-disabled):hover {
        background: var(--color-fill-2, #f2f3f5);
        border-radius: 4px;
      }
    }
  }
}
</style>
