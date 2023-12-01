<template>
  <a-spin :loading="loading" class="w-full h-full">
    <a-descriptions
      class="site-setup__basic"
      :column="1"
      title="站点信息"
      bordered
    >
      <a-descriptions-item label="站点名称"
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
      <a-descriptions-item label="站点状态">
        <div class="flex items-center w-full">
          <a-tag v-if="formState?.status === 1" class="is-success">有效</a-tag>
          <a-tag
            v-if="formState?.status === 2"
            class="is-success"
            color="orange"
          >
            暂停
          </a-tag>
          <i class="flex-1"></i>
          <a-link :hoverable="false" @click="getBasicInfo">刷新</a-link>
        </div>
      </a-descriptions-item>
    </a-descriptions>
    <a-space class="mt-6">
      <a-button type="outline" status="danger" @click="deleteSite">
        删除站点
      </a-button>
    </a-space>
  </a-spin>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { IconQuestionCircleFill } from '@arco-design/web-vue/es/icon'
import { deleteCdnSiteByIdApi, getCdnSiteDetailByIdApi } from '@vcp/apis/cdn'
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
      site_id: ''
      // is_open: false,
      // speed: 0
    }
  }
})
const loading = ref(false)

const getBasicInfo = () => {
  loading.value = true
  const siteId = route.params.id as string
  getCdnSiteDetailByIdApi({ site_id: siteId })
    .then(res => {
      formState.value = omit(res, 'attach')
    })
    .finally(() => {
      loading.value = false
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
      background-color: transparent;
      font-weight: normal;
    }
    .arco-descriptions-item-value {
      color: var(--color-text-1);
    }
    .arco-descriptions-item-value,
    .arco-descriptions-item-label {
      padding: 13px 16px;
    }

    .is-success {
      height: 24px;
      padding: 3px 8px;
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
        border-radius: 6px 0 0 6px;
        display: none;
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
      flex-shrink: 0;
      border-radius: 0 6px 6px 0;
      width: 60px;
      height: 32px;
    }
  }
}
</style>
