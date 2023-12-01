<template>
  <div>
    <statistic-card :data="userDateOverview" class="mt-4"></statistic-card>
    <vc-filter-bar
      ref="filterBar"
      :key="isOwn"
      v-model="state"
      :schemas="filterBarScheme(false, isOwn)"
      @search="handleSearch"
      @refresh="getList()"
      class="my-4"
    >
    </vc-filter-bar>
    <vc-table
      :key="isOwn"
      row-key="id"
      ref="tableRef"
      :data="tableData || []"
      :columns="columns"
      v-model:page-data="pagination"
      :loading="loading"
      v-model:selectedKeys="selectedKeys"
      is-selection
      @sorter-change="handleSortChange"
      @get-list="getList(state)"
    >
      <template #remark="{ record }">
        <vc-remark-input
          :content="record.desc"
          :on-submit="(v:string) => editRemark(record, v)"
        ></vc-remark-input>
      </template>
      <template #autoRenewTitle>
        <vc-tips-pop title="自动续期" icon="help-outline">
          仅NS自动验证域名方式支持自动续期功能
        </vc-tips-pop>
      </template>
      <template #autoRenew="{ record }">
        <a-switch
          v-if="record.is_verify === 1"
          :model-value="(record as LicenseItem).is_renewal"
          :disabled="[3, 4].includes(record.status)"
          :checked-value="1"
          :uncheckedValue="2"
          @change="handleCommand('autoRenew', record as LicenseItem)"
        ></a-switch>
        <span v-else>-</span>
      </template>
      <template #optional="{ record }">
        <template v-if="isOwn === 1">
          <div class="flex flex-row gap-x-4 items-center justify-end">
            <a-link
              v-show="record.status !== 6"
              @click="handleCommand('download', record)"
              >下载</a-link
            >
            <a-link @click="handleCommand('details', record)">详情</a-link>
            <a-link @click="handleCommand('delete', record)" status="danger"
              >删除</a-link
            >
          </div>
        </template>
        <template v-else>
          <div class="flex flex-row gap-x-4 items-center justify-start">
            <a-link
              v-if="[2,5,6].includes(record.status!)"
              :disabled="record.status === 2"
              @click="handleApplyAndVerify('renew', false, record)"
              >续期</a-link
            >
            <a-link v-else @click="handleCommand('details', record)"
              >详情</a-link
            >
            <a-link
              v-if="record.status === 4"
              @click="handleCommand('delete', record)"
              status="danger"
              >删除</a-link
            >

            <a-link
              v-if="record.status !== 4"
              @click="handleCommand('download', record)"
              >下载</a-link
            >
            <a-dropdown
              v-if="record.status !== 4"
              @select="(v)=>handleCommand(v as Command,record)"
            >
              <vc-svg-icon
                prefix="ssl"
                name="table_actions"
                :size="16"
                class="cursor-pointer"
              ></vc-svg-icon>
              <template #content>
                <a-doption
                  v-show="[2, 5].includes(record.status!)"
                  value="details"
                  >详情</a-doption
                >
                <a-doption value="delete">删除</a-doption>
                <a-doption v-show="record.status !== 4" value="revoke">
                  吊销证书</a-doption
                >
              </template>
            </a-dropdown>
          </div>
        </template>
      </template>
      <template #pagination-left>
        <a-checkbox v-model="checkAll" :indeterminate="indeterminate" />
        <a-dropdown @select="(v)=>handleCommand(v as Command,selectedKeys)">
          <a-button :disabled="selectedKeys.length < 1" type="outline">
            批量操作 <icon-up class="ml-2" />
          </a-button>
          <template #content>
            <a-doption
              v-if="isOwn === 2"
              :disabled="batchDisabled('renew')"
              @click="handleApplyAndVerify('renew', true, selected)"
              >批量续期</a-doption
            >
            <a-doption
              v-if="isOwn === 2"
              :disabled="batchDisabled('download')"
              value="download"
              >批量下载</a-doption
            >
            <a-doption :disabled="selected.length < 1" value="batchDelete"
              >批量删除</a-doption
            >
            <a-doption :disabled="batchDisabled('revoke')" value="revoke"
              >批量吊销证书</a-doption
            >
            <a-doption
              v-if="isOwn === 2"
              :disabled="batchDisabled('autoRenewOpen')"
              value="autoRenewOpen"
              >批量开启自动续期</a-doption
            >
            <a-doption
              v-if="isOwn === 2"
              :disabled="batchDisabled('autoRenewClose')"
              value="autoRenewClose"
              >批量关闭自动续期</a-doption
            >
          </template>
        </a-dropdown>
      </template>
    </vc-table>
    <license-details
      v-model:visible="detailDraw.visible"
      v-model:apply-id="detailDraw.record"
      :is-own="isOwn"
    ></license-details>
    <apply-license-draw
      v-model:visible="applyDraw.visible"
      v-model:data="applyDraw.data"
      :command="applyDraw.command"
      :is-batch="applyDraw.isBatch"
      @update-list="handleUpdate"
      title="申请证书"
    ></apply-license-draw>
    <!-- <upload-license v-model:visible="uploadState.visible"></upload-license> -->
  </div>
</template>

<script lang="ts" setup>
// import 'vc-material/theme-chalk/table.css'

import { Message } from '@arco-design/web-vue'
import { IconUp } from '@arco-design/web-vue/es/icon'
import { editLicenseApi, licenseListApi } from '@vca/apis/src/ssl'
import { decPageByData } from 'vc-material'
import { useListRequest, useTable } from 'vc-material/hooks'

import { ApplyLicenseDraw } from '@/components/business/'
import LicenseDetails from '@/components/business/LicenseDetails.vue'
import StatisticCard from '@/components/business/StatisticCard.vue'
import { filterBarScheme } from '@/config/'
import { tableColumn } from '@/config/index'
import useStatistic from '@/hooks/useStatistic'
import type { Command } from '@/hooks/useTableColumn'
import useTableColumn from '@/hooks/useTableColumn'
import type { ApplyCommand, LicenseInfo } from '@/types/applyList'
import type { LicenseItem } from '@/types/licenseList'
const isOwn = defineModel<number>('isOwn', { default: 2, required: true })
const state = reactive({
  is_own: isOwn.value,
  user_id: ''
})
// 获取列表数据
const {
  pagination,
  loading,
  run: getList,
  data: tableData
} = useListRequest(licenseListApi, state)
const { userDateOverview, getStatistic } = useStatistic({
  apply: false,
  is_own: isOwn
})
const {
  tableRef,
  selectedKeys,
  selected,
  checkAll,
  indeterminate,
  createSortChange
} = useTable(tableData)

const { detailDraw, handleCommand } = useTableColumn(
  handleUpdate,
  handlePagination
)

const columns = tableColumn(false, isOwn.value)
const route = useRoute()
const router = useRouter()
const filterBar = ref()
const editRemark = async (record: LicenseItem, v: string) => {
  const data = {
    id: record.id ?? '',
    desc: v,
    is_renewal: record.is_renewal ?? 1
  }
  try {
    await editLicenseApi(data).then(() => {
      Message.success('修改成功')
      getList()
    })
  } catch (e) {
    Message.error('请求错误，请稍后重试')
  }
}

function handleUpdate() {
  getList()
  getStatistic()
}

function handlePagination(isBatch: boolean) {
  if (isBatch) {
    decPageByData(pagination, tableData, selected)
  } else {
    decPageByData(pagination, tableData)
  }
}

/**
 * 申请或验证抽屉
 */
const applyDraw = reactive<any>({
  visible: false,
  record: undefined,
  command: 'apply',
  isBatch: false,
  data: undefined
})

// /**上传自有证书 */
// const uploadState = reactive({
//   visible: false,
//   loading: false
// })

/**申请或验证事件
   * @params
   *apply:申请/验证
   batch:批量或单个申请
   */
const handleApplyAndVerify = (
  command: ApplyCommand,
  batch: boolean,
  record?: LicenseInfo | LicenseInfo[]
) => {
  applyDraw.command = command
  applyDraw.isBatch = batch ? true : false
  applyDraw.visible = true
  applyDraw.data = record
}

const handleSearch = () => {
  pagination.page = 1
  if (route.query?.user_id !== state.user_id) {
    router.replace({
      ...route,
      query: { ...(route?.query || {}), user_id: undefined }
    })
    getList()
  }
}
// 排序
const handleSortChange = createSortChange(getList, state)

const batchDisabled = computed(() => (command: string) => {
  let disabled = false
  const map: Record<string, () => boolean> = {
    renew: () => {
      const userId = selected.value[0].user_id
      selected.value.find(item => {
        const disableRenew = [1, 2, 3, 4] //手动dns验证,或包含已提交续期，吊销中，已吊销，正常，无法进行续期
        if (
          item.is_verify === 2 ||
          disableRenew.includes(item.status ?? 1) ||
          userId !== item.user_id
        ) {
          disabled = true
        } else {
          disabled = false
        }
      })
      return disabled
    },
    download: () => {
      selected.value.find(item => {
        if (isOwn.value === 1) {
          // 自有证书已到期的无法下载
          if (item.status === 6) {
            disabled = true
            return disabled
          }
        } else {
          // 已吊销证书无法下载
          if (item.status === 4) {
            disabled = true
            return disabled
          }
        }
      })
      return disabled
    },
    revoke: () => {
      const disabledRevoke = [2, 3, 4] // 包含已吊销或吊销中或已提交续期的无法进行吊销操作
      selected.value.find(item => {
        if (disabledRevoke.includes(item.status ?? 1)) {
          disabled = true
          return disabled
        }
      })
      return disabled
    },
    autoRenewOpen: () => {
      // 只有ns自动验证可以进行开启/关闭自动续期
      const list = [2, 3, 4] // 除已到期或即将到期以外不能进行续期
      selected.value.find(item => {
        if (
          item.is_verify === 2 ||
          item.is_renewal === 1 ||
          list.includes(item.status!)
        ) {
          disabled = true
          return disabled
        }
      })
      return disabled
    },
    autoRenewClose: () => {
      const list = [2, 3, 4]
      selected.value.find(item => {
        if (
          item.is_verify === 2 ||
          item.is_renewal === 2 ||
          list.includes(item.status!)
        ) {
          disabled = true
          return disabled
        }
      })
      return disabled
    }
  }
  if (selected.value.length < 1) {
    return true
  }
  return map[command]()
})

watch(
  () => isOwn.value,
  () => {
    getStatistic()
  }
)
onMounted(() => {
  if (route.query?.user_id) {
    filterBar.value?.setFieldValue('user_id', route.query?.user_id)
  }
  getList()
})
</script>
<style lang="less" scoped>
.apply-list {
  @apply p-6 rounded-sm! bg-white h-full w-full;
}
.edit-desc {
  cursor: pointer;
  visibility: hidden;
}
:deep(.user-cell) {
  color: rgb(var(--primary-6));
  cursor: pointer;
}
:deep(.arco-tabs-tab) {
  padding-top: 16px !important;
}
:deep(.arco-tabs-content) {
  display: none !important;
}
.arco-link {
  margin-left: 0 !important;
}
</style>
