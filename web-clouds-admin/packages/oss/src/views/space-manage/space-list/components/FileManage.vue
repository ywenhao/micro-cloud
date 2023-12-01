<template>
  <div class="spce-file-manage">
    <div class="flex items-center mb-4">
      <span class="pr-2 text-[var(--color-text-1)] text-sm">外链域名</span>
      <a-select
        class="w-[454px]!"
        v-model="taskCenterStore.outDomain"
        :options="SPACE_OUT_LINK_DOMAIN"
        placeholder="请选择"
        @change="handleChangeUrl"
      >
      </a-select>
    </div>
    <vc-filter-bar
      ref="filterBarRef"
      v-model="state"
      @search="handleSearch"
      :schemas="filterBarScheme"
      class="relative"
    >
      <template #prefix>
        <a-button type="primary" @click="handleCommand('upload')"
          >上传文件</a-button
        >
        <a-button type="outline" @click="handleCommand('create')"
          >创建目录</a-button
        >
      </template>
      <template #middle>
        <a-popover>
          <a-button
            type="outline"
            class="absolute! right-40px! w-8 h-8 p-0!"
            @click="taskCenterStore.visible = true"
          >
            <a-badge
              v-if="taskCenterStore.waitCount"
              dot
              :count="1"
              :offset="[2, -2]"
            >
              <vc-svg-icon name="icon_down_center" prefix="oss" />
            </a-badge>
            <vc-svg-icon name="icon_down_center" prefix="oss" v-else />
          </a-button>
          <template #content>
            <span>在任务中心查看记录</span>
          </template>
        </a-popover>
      </template>
    </vc-filter-bar>
    <div v-if="rootDir.length" class="mt-4 text-sm">
      <a-link :hoverable="false" class="mr-1!" @click="handleCatalog"
        >根目录/</a-link
      >
      <a-link
        v-for="(item, index) in rootDir"
        :key="index"
        :hoverable="false"
        :disabled="rootDir.length - 1 === index"
        class="mr-1! ml-0!"
        :class="
          rootDir.length - 1 === index ? 'text-[var(--color-text-1)]!' : ''
        "
        @click="handleFile(item)"
        >{{ item }}</a-link
      >
    </div>
    <vc-table
      class="mt-4"
      ref="tableRef"
      row-key="id"
      :data="listData"
      :columns="columns"
      @sorter-change="handleSortChange"
      @get-list="handleSearch"
      :pagination="{ showTotal: true }"
      :page-data="pagination"
      :loading="loading"
      v-model:selectedKeys="selectedKeys"
      is-selection
    >
      <template #file_key="{ record }">
        <div
          v-if="record.is_dir"
          class="flex items-center cursor-pointer"
          @click="handleFileCatalog(record)"
        >
          <vc-svg-icon name="icon_file" prefix="oss" class="mr-2"></vc-svg-icon>
          <span class="text-primary">{{ record.key }}</span>
        </div>
        <span v-else>{{ record.key }}</span>
      </template>
      <template #size="{ record }">
        {{ record.is_dir ? '-' : convertByte(Number(record.size)) }}
      </template>
      <template #content_type="{ record }">
        {{ record.content_type || '-' }}
      </template>
      <template #actions="{ record }">
        <a-link
          v-if="record.is_dir"
          :hoverable="false"
          @click="handleDelCatalog(record)"
          status="danger"
        >
          删除
        </a-link>
        <span v-else class="flex items-center">
          <a-link :hoverable="false" @click="handleCommand('detail', record)">
            详情
          </a-link>

          <a-dropdown
            position="br"
            trigger="hover"
            class="vc-dropdown-file"
            @select="v => handleCommand(v as ICommand, record)"
          >
            <img
              src="@/assets/svgs/icon_detail.svg"
              class="ml-4 bg-[rgba(255, 255, 255, 1e-05)] rounded-sm! detail-icon"
              alt=""
            />
            <template #content>
              <a-doption value="download">下载</a-doption>
              <a-doption value="copy">复制外链</a-doption>
              <a-doption value="del" class="text-[#F53F3F]!">删除</a-doption>
            </template>
          </a-dropdown>
        </span>
      </template>
      <template #pagination-left>
        <div>
          <a-checkbox
            v-model="checkAll"
            :indeterminate="indeterminate"
            class="mr-7!"
          />
          <a-button
            type="outline"
            :disabled="!selected.length"
            @click="handleBatchDownload"
            >下载<a-popover v-if="selected.length">
              <vc-svg-icon
                @click.stop
                name="icon_help"
                prefix="oss"
                class="ml-2px"
              />
              <template #content>
                <span class="color-ct-1 leading-22px"
                  >批量下载，需要在浏览器设置允许打开新弹出窗口。</span
                >
              </template>
            </a-popover>
            <vc-svg-icon
              v-show="!selected.length"
              @click.stop
              name="icon_help"
              prefix="oss"
              class="ml-2px opacity-50"
            />
          </a-button>
          <a-button
            type="outline"
            :disabled="!selected.length"
            @click="handleOutLinkDomain('export')"
            >导出外链</a-button
          >
          <a-button
            type="outline"
            status="danger"
            :disabled="!selected.length"
            @click="batchDelete"
            >删除</a-button
          >
        </div>
      </template>
      <template #pagination-right>
        <div class="flex items-center">
          <span>第 {{ pageIndex + 1 }} 页</span>
          <a-button
            type="outline"
            class="w-8 h-8 p-0! mr-2 border-none!"
            @click="handleCommand('upPage')"
            :disabled="pageIndex === 0"
          >
            <vc-svg-icon name="icon_left_arrow" prefix="oss"></vc-svg-icon>
          </a-button>
          <a-button
            type="outline"
            class="w-8 h-8 p-0! ml-0! border-none!"
            @click="handleCommand('nextPage')"
            :disabled="disabledNextBtn"
          >
            <vc-svg-icon name="icon_right_arrow" prefix="oss"></vc-svg-icon>
          </a-button>
          <a-select
            v-model="pagination.limit"
            @change="handleSearch()"
            :options="pageOptions"
            class="w-[108px]! ml-4"
          >
          </a-select>
        </div>
      </template>
    </vc-table>
    <file-detail
      v-model="detailState.visible"
      v-model:loading="detailState.loading"
      v-model:record="detailState.record"
      v-model:options="SPACE_OUT_LINK_DOMAIN"
      v-model:space_role="space_role"
      v-model:catalogUrl="catalogUrl"
      :baseOutDomain="taskCenterStore.outDomain"
      @update-domain="GET_SPACE_LINK_DOMAIN_LIST(route.params.id as string)"
    />
    <catalogue-view
      v-model="catalogueVisible"
      v-model:catalogUrl="catalogUrl"
      @reload="handleAddCatalog"
    />
    <upload-file-dialog
      v-model="uploadFileVisible"
      :catalogUrl="catalogUrl"
      v-model:spaceName="spaceName"
    />
  </div>
</template>

<script setup lang="tsx">
import { Message } from '@arco-design/web-vue'
import type { SpaceBasicModel } from '@vca/apis/oss'
import {
  deleteObjectsApi,
  fileListApi,
  type fileListModel,
  getObjectsPreSignApi,
  postObjectsUploadCheckApi,
  setDomainApi
} from '@vca/apis/oss'
import { useClipboard, type VcFilterBarScheme } from 'vc-material'
import { convertByte, useRequest, useTable } from 'vc-material'
import { VcModal } from 'vc-material/utils'
import { useRoute } from 'vue-router'

import {
  GET_SPACE_LINK_DOMAIN_LIST,
  SPACE_OUT_LINK_DOMAIN
} from '@/components/SelectData'
import { type IDownLoadList, useExportCsv } from '@/hooks/useDownloadCsv'
import type { DelCatalogItem } from '@/stores/modules/taskCenter'
import { useTaskCenterStore } from '@/stores/modules/taskCenter'

import columns from './columns/fileColumns'
import CatalogueView from './file-manage/AddCatalogueDialog.vue'
import FileDetail from './file-manage/FileDetail.vue'
import UploadFileDialog from './file-manage/UploadFileDialog.vue'

const taskCenterStore = useTaskCenterStore()

const route = useRoute()
const rootDir = ref<string[]>([])

const spaceDetail = defineModel<SpaceBasicModel>('spaceDetail', {
  required: true
})

// const getSpaceDetail = inject('getSpaceDetail') as () => void

const default_domain = computed(
  () => SPACE_OUT_LINK_DOMAIN.value.find(item => item?.is_default === 1)?.value
)
const filterBarRef = ref()

const catalogUrl = computed<string>(() => rootDir.value.join(''))

const state = ref({
  bucket_id: route.params.id as string,
  delimiter: '/',
  prefix: ''
})
const filterBarScheme: VcFilterBarScheme = {
  widgets: [
    {
      field: 'prefix',
      widget: 'input-icon',
      attrs: {
        placeholder: '输入文件前缀搜索',
        maxLength: 256
      }
    }
  ]
}

const pageOptions = ref([
  { value: 10, label: '10 条/页' },
  { value: 20, label: '20 条/页' },
  { value: 30, label: '30 条/页' },
  { value: 40, label: '40 条/页' },
  { value: 50, label: '50 条/页' }
])

const {
  loading,
  data: dataSource,
  run: getTableList
} = useRequest(fileListApi, state)

const detailState = reactive<CommonState<fileListModel>>({
  visible: false,
  record: undefined,
  loading: false
})

const pageIndex = ref<number>(0)
const marker = ref<string>('')
const allTableList = ref<any[]>([])

const pagination = reactive({
  limit: 10,
  page: 1,
  offset: 0,
  total: 0
})

const limit = computed(() =>
  pageIndex.value === 0 ? pagination.limit + 1 : pagination.limit
)

const catalogueVisible = ref<boolean>(false)
const uploadFileVisible = ref<boolean>(false)

const tableList = computed(() => {
  marker.value = dataSource.value?.marker as string
  dataSource.value?.list?.map((item: any, index: number) => {
    if (item.key === rootDir.value.join('')) {
      dataSource.value.list?.splice(index, 1)
    }
  })
  return (
    dataSource.value?.list?.map(item => ({
      ...item,
      key: getKey(item.key as string),
      disabled: !!item.is_dir
    })) || []
  )
})

const getKey = (key: string) => {
  return key.replace(rootDir.value.join(''), '')
}

const dataList = ref<any[]>([])
const spaceName = ref<string>('')

const listData = computed(() =>
  dataList.value.map(item => ({
    ...item,
    id: catalogUrl.value.concat(item.key)
  }))
)

const disabledNextBtn = computed(
  () => !marker.value && !allTableList.value[pageIndex.value + 1]
)

const {
  tableRef,
  selectedKeys,
  selected,
  checkAll,
  indeterminate,
  createSortChange
} = useTable(listData)

const handleSearch = (data?: any) => {
  allTableList.value = []
  pageIndex.value = 0
  let prefix = ''
  if (!data) {
    if (state.value.prefix && state.value.prefix.endsWith('/')) {
      rootDir.value.push(state.value.prefix as string)
      prefix = rootDir.value.join('')
      filterBarRef.value?.setFieldValue('prefix', '')
    } else if (state.value.prefix.lastIndexOf('/') !== -1) {
      const subStr = state.value.prefix.substring(
        0,
        state.value.prefix.lastIndexOf('/') + 1
      )
      rootDir.value.push(subStr)
      prefix = rootDir.value.join('')
      filterBarRef.value?.setFieldValue(
        'prefix',
        state.value.prefix.substring(state.value.prefix.lastIndexOf('/') + 1)
      )
    } else {
      prefix = rootDir.value.join('').concat(state.value.prefix)
    }
  } else {
    prefix = rootDir.value.join('')
  }
  //@ts-ignore
  getTableList({
    limit: limit.value,
    prefix: prefix,
    ...data
  })
}

const handleSortChange = createSortChange(getTableList, state)

const handleFileCatalog = (record: fileListModel) => {
  rootDir.value.push(record.key as string)
  handleSearch({ prefix: rootDir.value.join('') })
}

const handleCatalog = () => {
  rootDir.value = []
  handleSearch({ prefix: '' })
}

const handleFile = (key: string) => {
  const fileIndex = rootDir.value.indexOf(key as string)
  rootDir.value = rootDir.value.slice(0, fileIndex + 1)
  handleSearch({ prefix: rootDir.value.join('') })
}

const handleAddCatalog = () => {
  handleSearch({ prefix: rootDir.value.join('') })
}

const outLinkDomain = ref<string>('')

const { copy: handleCopy } = useClipboard(outLinkDomain)

type ICommand =
  | 'create'
  | 'del'
  | 'detail'
  | 'upload'
  | 'nextPage'
  | 'upPage'
  | 'copy'
  | 'download'

const handleCommand = (command: ICommand, record?: fileListModel) => {
  const actions: Record<ICommand, () => void> = {
    create: () => {
      catalogueVisible.value = true
    },
    upload: () => {
      postObjectsUploadCheckApi({
        bucket_id: route.params!.id! as string
      }).then(res => {
        const pass = !!res?.pass
        if (!pass) return Message.error('存储空间已达上限')
        uploadFileVisible.value = true
      })
    },

    del: () => {
      const request = () =>
        deleteObjectsApi({
          bucket_id: route.params!.id! as string,
          keys: [rootDir.value.join('').concat(record?.key as string)]
        }).then(() => {
          Message.success('删除成功')
          handleSearch()
        })

      VcModal.error(
        {
          title: '删除',
          content: `确定删除${record?.key}吗？`
        },
        request
      )
    },
    download: () => {
      const url = catalogUrl.value.concat(record?.key as string)
      download([url])
    },
    copy: () => {
      handleOutLinkDomain(
        'copy',
        catalogUrl.value.concat(record?.key as string)
      )
    },
    detail: () => {
      detailState.record = record!
      detailState.visible = true
    },
    nextPage: () => {
      pageIndex.value += 1
      if (
        allTableList.value.length &&
        allTableList.value.length >= pageIndex.value + 1
      ) {
        dataList.value = allTableList.value[pageIndex.value]
      } else {
        //@ts-ignore
        getTableList({ marker: marker.value, limit: limit.value })
      }
    },
    upPage: () => {
      pageIndex.value -= 1
      dataList.value = allTableList.value[pageIndex.value]
    }
  }
  actions[command]()
}

/**批量操作 */
const handleBatchDownload = () => {
  download(selectedKeys.value)
}

const handleDelCatalog = async (record: fileListModel) => {
  const request = async () => {
    const bucket_id = route.params!.id! as string
    const params = {
      marker: '',
      bucket_id,
      prefix: catalogUrl.value.concat(record.key!),
      limit: 500,
      delimiter: ''
    }
    const item: DelCatalogItem = reactive({
      space_name: spaceName.value,
      catalog: record.key!,
      status: 'deleteIng',
      params
    })
    const list = taskCenterStore.delCatalogList
    const hasItem = list.some(
      item =>
        item.catalog === record.key &&
        item.space_name === spaceName.value &&
        item.params.bucket_id === bucket_id
    )
    !hasItem && taskCenterStore.delCatalogList.push(item)
    try {
      const catalog = await fileListApi(params)
      const catalogList = catalog?.list || []
      const keys = catalogList.map(item => item.key!)
      await deleteObjectsApi({ keys, bucket_id })
      item.status = 'success'
    } catch (e) {
      item.status = 'error'
      throw new Error('删除失败')
    }
    handleSearch()
  }

  VcModal.error(
    {
      title: '删除目录',
      content: '目录下的所有文件都将被删除，确定执行删除操作吗？'
    },
    request
  )
}

const space_role = computed<boolean>(() => spaceDetail.value?.acl === 'private')

const download = (keys: string[]) => {
  if (!taskCenterStore.outDomain) {
    Message.error('请先选择外链域名')
    return
  }
  getObjectsPreSignApi({
    bucket_id: route.params!.id! as string,
    keys,
    base_url: taskCenterStore.outDomain
  }).then(res => {
    // downloadPem(res, key, content_type)
    ;(res.list || []).forEach(({ download_url }) => {
      window.open(download_url)
    })
    // getTableList({ limit: limit.value })
  })
}

const handleOutLinkDomain = (type: string, key?: string) => {
  if (!taskCenterStore.outDomain) {
    Message.error('请先选择外链域名')
    return
  }
  getObjectsPreSignApi({
    bucket_id: route.params!.id! as string,
    keys:
      type === 'copy'
        ? [catalogUrl.value.concat(key as string)]
        : selectedKeys.value,
    base_url: taskCenterStore.outDomain
  }).then(res => {
    if (type === 'copy') {
      // @ts-ignore
      outLinkDomain.value = res?.list[0]?.url as string
      try {
        handleCopy()
        Message.success('复制成功')
      } catch (e) {
        Message.error('复制失败')
      }
    } else {
      const downloadList: IDownLoadList[] = []
      res.list?.map(({ url, key }) => {
        downloadList.push({
          key,
          url
        })
      })
      useExportCsv(downloadList)
      //@ts-ignore
      getTableList({ limit: limit.value })
    }
  })
}

const batchDelete = () => {
  const content = (
    <div class="max-h-200px  pr-5">
      <div class="flex flex-col gap-y-2px overscroll-y-auto h-full">
        {selectedKeys.value.map((item: string) => {
          return (
            <span class="flex items-center justify-between">
              <span>{item}</span>
              <span class="text-left">待处理</span>
            </span>
          )
        })}
      </div>
    </div>
  )
  const request = () =>
    deleteObjectsApi({
      bucket_id: route.params?.id as string,
      keys: selectedKeys.value
    }).then(() => {
      Message.success('删除成功')
      //@ts-ignore
      handleSearch()
    })

  VcModal.error(
    {
      title: `确定要删除${selectedKeys.value?.length}个文件吗？`,
      content: () => content
    },

    request
  )
}

const lastFileItem = ref<fileListModel>()

const handleChangeUrl = () => {
  const domain_id = SPACE_OUT_LINK_DOMAIN.value.find(
    item => item?.value === taskCenterStore.outDomain
  )?.id
  domain_id
    ? setDomainApi({
        bucket_id: route.params.id as string,
        domain_id: domain_id
      })
    : Message.error('设置默认域名失败')
}

onMounted(() => {
  //@ts-ignore
  getTableList({ limit: limit.value })
  GET_SPACE_LINK_DOMAIN_LIST(route.params.id as string)
})

watch(
  () => tableList.value,
  v => {
    if (pageIndex.value !== 0 && lastFileItem.value) {
      //@ts-ignore
      v.unshift(lastFileItem.value as fileListModel)
    }
    if (v.length >= limit.value) {
      lastFileItem.value = v?.pop()
    }
    dataList.value = v.map(item => ({
      ...item,
      id: catalogUrl.value.concat(item.key)
    }))

    if (allTableList.value?.length && allTableList.value[pageIndex.value]) {
      allTableList.value[pageIndex.value] = v
    } else {
      allTableList.value.push(v)
    }
  }
)

watch(
  () => spaceDetail.value,
  v => {
    spaceName.value = v?.name!
  },
  { deep: true, immediate: true }
)

watchEffect(() => {
  taskCenterStore.outDomain = (default_domain.value as string) || ''
})
</script>

<style scoped lang="less">
.spce-file-manage {
  :deep(.detail-icon) {
    &:hover {
      background: #f2f3f5 !important;
    }
  }
  :deep(.vc-table) {
    &.arco-table .arco-table-pagination {
      @apply justify-between;
      .arco-pagination {
        display: none !important;
      }
    }
  }
}
.color-inherit.tips-pop {
  :deep(.pop-title) {
    color: inherit;
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
