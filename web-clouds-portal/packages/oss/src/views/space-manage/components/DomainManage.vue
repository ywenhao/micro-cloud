<template>
  <div class="spce-file-manage">
    <vc-filter-bar @search="getTableList()" :schemas="{ widgets: [] }">
      <template #prefix>
        <div class="flex flex-col">
          <span class="text-[var(--color-text-1)] text-base font-medium pb-1"
            >自定义外链域名</span
          >
          <span class="text-xs text-[#86909C]"
            >绑定自定义域名为空间的外链域名，即可通过该域名直接访问存储空间内的文件。</span
          >
        </div>
      </template>
      <template #suffix>
        <a-button
          type="primary"
          class="mr-2!"
          :disabled="pagination.total >= 100"
          @click="handleCommand('bind')"
          >绑定域名</a-button
        >
      </template>
    </vc-filter-bar>
    <vc-table
      class="mt-4"
      :data="dataSource"
      :columns="columns"
      :page-data="pagination"
      :loading="loading"
    >
      <template #agreement="{ record }">
        {{ record?.ssl_status === 1 ? 'HTTP' : 'HTTPS' }}
      </template>
      <template #ssl_status="{ record }">
        {{ sllStatus(record?.ssl_status)?.label }}
      </template>
      <template #actions="{ record }">
        <a-tooltip background-color="white" :content="record?.cname">
          <a-link
            :hoverable="false"
            @click="handleCommand('copy', record)"
            type="primary"
          >
            复制CNAME
          </a-link>
        </a-tooltip>

        <a-link
          :hoverable="false"
          @click="handleCommand('setting', record)"
          type="primary"
        >
          配置HTTPS
        </a-link>
        <a-link
          :hoverable="false"
          @click="handleCommand('untie', record)"
          type="primary"
        >
          解绑
        </a-link>
      </template>
    </vc-table>
    <setting-http
      v-model="detailState.visible"
      v-model:loading="detailState.loading"
      v-model:record="detailState.record"
      v-model:user_id="userId"
      @reload="getTableList()"
    />
    <bind-domain
      v-model="bindState.visible"
      v-model:loading="bindState.loading"
      v-model:spaceName="spaceName"
      @reload="getTableList()"
    />
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { delLinkDomainApi, spaceDomainApi } from '@vcp/apis/oss'
import { useClipboard, useListRequest, VcModal } from 'vc-material'
import { useRoute } from 'vue-router'

import { SSL_STATUS_LIST } from '@/components/SelectData'

import columns from './columns/domainManage'
import BindDomain from './domian-manage/BindDomain.vue'
import SettingHttp from './domian-manage/SettingHttps.vue'

const route = useRoute()

const state = ref({
  bucket_id: route.params?.id as string,
  source_type: 1
})

const spaceDetail = defineModel<any>('spaceDetail')

const spaceName = ref<string>('')
const userId = ref<string>('')

const sllStatus = computed(() => (status: number) => {
  return SSL_STATUS_LIST.value.find(item => item.value === status)
})

const {
  pagination,
  loading,
  data: dataSource,
  run: getTableList
} = useListRequest(spaceDomainApi, state, {
  showPageSize: true,
  showTotal: true
})

const detailState = reactive<CommonState<any>>({
  visible: false,
  record: undefined,
  loading: false
})

const bindState = reactive<CommonState<any>>({
  visible: false,
  record: undefined,
  loading: false
})

const cName = ref<string>('')

const { copy: handleCopy } = useClipboard(cName)

type ICommand = 'untie' | 'setting' | 'bind' | 'copy'
const handleCommand = (command: ICommand, record?: any) => {
  const actions: Record<ICommand, () => void> = {
    copy: () => {
      cName.value = record?.cname
      try {
        handleCopy()
        Message.success('复制成功')
      } catch (e) {
        Message.error('复制失败')
      }
    },

    bind: () => {
      bindState.record = undefined
      bindState.visible = true
    },

    untie: () => {
      const request = () =>
        delLinkDomainApi({
          bucket_id: route.params?.id as string,
          ids: [record!.id!]
        }).then(() => {
          Message.success('解绑成功')
          getTableList()
        })

      VcModal.confirm(
        {
          title: '解绑域名',
          content: `确定要解绑该域名吗？`
        },

        request
      )
    },
    setting: () => {
      detailState.record = record!
      detailState.visible = true
    }
  }
  actions[command]()
}

onMounted(() => {
  getTableList()
})

watch(
  () => spaceDetail.value,
  v => {
    spaceName.value = v?.name
    userId.value = v?.user_id
  },
  { deep: true, immediate: true }
)
</script>

<style scoped lang="less">
.spce-file-manage {
  :deep(.detail-icon) {
    &:hover {
      background: #f2f3f5 !important;
    }
  }
}
</style>
<style lang="less">
.vc-dropdown-file {
  .arco-scrollbar {
    @apply p-2!;
  }
}
</style>
