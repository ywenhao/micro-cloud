<template>
  <a-spin :loading="loading" class="w-full h-full">
    <a-descriptions
      class="site-setup__basic"
      :column="1"
      title="站点信息"
      bordered
    >
      <a-descriptions-item label="加速域名"
        >{{ formState?.domain || '-' }}
      </a-descriptions-item>
      <a-descriptions-item>
        <template #label>
          <div class="flex items-center">
            <span>CNAME域名</span>
            <a-popover position="right" content-class="py-3! max-w-365px">
              <icon-question-circle-fill class="cursor-pointer" />
              <template #content>
                启用CDN加速产品需要将加速域名指向CNAME地址，
                这样访问加速域名的请求才能转发到CDN节点上。
              </template>
            </a-popover>
          </div>
        </template>
        <span v-table-cell="formState?.cname_domain"></span>
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        <span v-uts="formState?.created_at"></span>
      </a-descriptions-item>
      <a-descriptions-item label="所属区域">
        <div class="flex items-center w-full">
          <span class="flex-1 truncate">{{
            formState?.attach?.region_name ?? ''
          }}</span>
          <a-link :hoverable="false" @click="selectRegion">调整区域</a-link>
        </div>
      </a-descriptions-item>
      <a-descriptions-item label="站点状态">
        <div class="flex items-center w-full">
          <a-tag v-if="formState?.status === 1" class="is-success">有效</a-tag>
          <a-tag
            v-if="formState?.status === 2"
            class="is-success"
            color="orange"
            >暂停</a-tag
          >
          <i class="flex-1"></i>
          <a-link :hoverable="false" @click="getBasicInfo">刷新</a-link>
        </div>
      </a-descriptions-item>
      <a-descriptions-item label="宽带速度限制">
        <div class="flex flex-row gap-x-8 w-full h-full items-center">
          <a-switch
            v-model="formState.attach.rate_limit.is_open"
            :default-checked="false"
          ></a-switch>
          <div
            v-if="formState.attach.rate_limit.is_open"
            class="time-input-container"
          >
            <a-input-number
              v-model="formState.attach.rate_limit.speed"
              placeholder="请输入"
              :step="1"
              :min="0"
              class="time-input"
            />
            <a-tag color="gray" class="input-des">Mbps</a-tag>
          </div>
        </div>
      </a-descriptions-item>
    </a-descriptions>
    <a-space class="mt-6">
      <a-button type="primary" :loading="loading" @click="saveConfig"
        >保存配置</a-button
      >
      <a-button type="outline" status="danger" @click="deleteSite"
        >删除站点</a-button
      >
    </a-space>
  </a-spin>
</template>

<script setup lang="ts">
import { Message, Option, Select } from '@arco-design/web-vue'
import { IconQuestionCircleFill } from '@arco-design/web-vue/es/icon'
import {
  deleteCdnSiteByIdApi,
  getCdnResolvRegionsListApi,
  getCdnSiteDetailByIdApi,
  updateCdnSiteBasicByIdApi
} from '@vca/apis/cdn'
import type { RegionListItem } from '@vca/apis/src/cdn/model/'
import { omit } from 'lodash-es'
import { VcModal } from 'vc-material'

const route = useRoute()
const router = useRouter()
const formState = ref<Partial<any>>({
  cname_domain: '',
  created_at: '',
  domain: '',
  id: '',
  status: 1,
  updated_at: '',
  attach: {
    region_id: '',
    region_name: '',
    rate_limit: {
      site_id: '',
      is_open: false,
      speed: 0
    }
  }
})
const loading = ref(false)

const regionList = ref<RegionListItem[]>()
const getBasicInfo = () => {
  loading.value = true
  const siteId = route.params.id as string
  getCdnSiteDetailByIdApi({ site_id: siteId })
    .then(res => {
      formState.value = {
        ...omit(res, 'attach'),
        attach: {
          region_id: res.attach?.region_id ?? '',
          region_name: res.attach?.region_name ?? '',
          rate_limit: JSON.parse(res.attach?.rate_limit ?? '')
        }
      }
    })
    .finally(() => {
      loading.value = false
    })
}
// 调整区域
const selectRegion = async () => {
  await getRegions()
  const selected = ref(formState.value?.attach?.region_id ?? '')
  VcModal.confirm(
    {
      title: '调整区域',
      content: () =>
        h(
          Select,
          {
            modelValue: selected.value,
            onChange: v => {
              selected.value = v
            }
          },
          regionList.value?.map(item =>
            h(Option, { key: item.id, value: item.id }, item.name)
          )
        )
    },
    () => {
      return new Promise<void>(resolve => {
        const selectItem = regionList.value?.find(
          item => item.id === selected.value
        )
        formState.value.attach!.region_id = selectItem?.id ?? ''
        formState.value.attach.region_name = selectItem?.name
        resolve()
      })
    }
  )
}
// 获取区域列表
const getRegions = () => {
  getCdnResolvRegionsListApi({}).then(res => {
    regionList.value = res.list
  })
}
//保存配置
const saveConfig = () => {
  const data = {
    site_id: formState.value.id ?? '',
    region_id: formState.value?.attach?.region_id,
    rate_limit: {
      site_id: formState.value.id ?? '',
      is_open: formState.value.attach.rate_limit.is_open,
      speed: (formState.value.attach.rate_limit?.speed ?? '').toString()
    }
  }
  updateCdnSiteBasicByIdApi(data).then(() => {
    Message.success('保存成功')
  })
}

const deleteSite = () => {
  VcModal.error(
    {
      title: '删除站点',
      content: '确认删除站点？删除后不可恢复。'
    },
    () =>
      deleteCdnSiteByIdApi({ site_id: formState.value.id }).then(() => {
        Message.success('删除成功')
        router.replace({ name: 'SiteList' })
      })
  )
}
onMounted(() => {
  getBasicInfo()
})
</script>

<style scoped lang="less">
.site-setup__basic {
  width: 544px;
  :deep(.arco-descriptions-row) {
    .arco-descriptions-item-label {
      color: var(--color-text-2);
      // background-color: transparent;
      font-weight: normal;
    }
    .arco-descriptions-item-value {
      color: var(--color-text-1);
    }
    .arco-descriptions-item-value,
    .arco-descriptions-item-label {
      padding: 14px 16px;
    }

    .is-success {
      padding: 3px 8px;
      height: 24px;
      font-size: 12px !important;
    }
  }
  .time-input-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    .time-input {
      flex: 1;
      border-radius: 6px 0 0 6px;
      :deep(.arco-input-suffix) {
        display: none;
        border-radius: 6px 0 0 6px;
        .arco-input-number-step-button,
        .arco-input-number-step {
          border-radius: 0 !important;
        }
      }
      &:hover {
        :deep(.arco-input-suffix) {
          display: block;
        }
      }
    }
    .input-des {
      width: 60px;
      height: 32px;
      border-radius: 0 6px 6px 0;
      flex-shrink: 0;
    }
  }
}
</style>
