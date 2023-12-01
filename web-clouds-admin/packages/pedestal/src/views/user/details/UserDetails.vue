<template>
  <a-scrollbar
    style="
      overflow: auto;
      width: calc(100vw - 200px);
      height: calc(100vh - 52px);
    "
  >
    <a-layout class="user-detail">
      <a-layout-header>
        <vc-svg-icon
          name="back"
          :size="32"
          @click="handleBack"
          class="cursor-pointer"
        ></vc-svg-icon>
      </a-layout-header>
      <a-layout>
        <a-layout-sider class="detail-sider">
          <vc-svg-icon name="default-avatar" :size="96"></vc-svg-icon>
          <a-space :size="16">
            <a-button
              @click="editorState.visible = true"
              type="primary"
              size="large"
            >
              <icon-edit size="16" class="mr-1" />
              编辑账号
            </a-button>
            <a-button
              @click="handleResetPassword"
              type="outline"
              size="large"
              class="reset-btn"
            >
              <icon-refresh size="16" class="mr-1" />重置密码
            </a-button>
          </a-space>
          <div class="w-full">
            <a-divider>最近登录信息</a-divider>
            <a-descriptions
              class="mt-5"
              :data="data"
              size="medium"
              :column="1"
            />
          </div>
        </a-layout-sider>
        <a-layout-content class="detail-content">
          <a-tabs v-model:active-key="activeTab">
            <a-tab-pane key="basic" title="基础信息">
              <basic-info :user-info="userInfo" :loading="loading"></basic-info>
            </a-tab-pane>
            <a-tab-pane key="prod" title="产品信息">
              <prod-info></prod-info>
            </a-tab-pane>
            <a-tab-pane key="log" title="登录记录">
              <sign-log></sign-log>
            </a-tab-pane>
          </a-tabs>
        </a-layout-content>
      </a-layout>
    </a-layout>

    <reset-password
      v-model="userResetVisible"
      :record-id="String(route?.params?.userId)"
    ></reset-password>

    <editor-dialog
      :groups="groups"
      v-model="editorState.visible"
      v-model:record="editorState.record"
      @reload="getUserInfo"
    />
  </a-scrollbar>
</template>
<script lang="ts" setup>
import type { SelectOptionData } from '@arco-design/web-vue'
import { IconEdit, IconRefresh } from '@arco-design/web-vue/es/icon'
import {
  getUserDetailApi,
  getUserGroupsListApi,
  type UserInfo
} from '@vca/apis/pedestal'
import { formatUnix } from 'vc-material'

import EditorDialog from '../list/components/EditorDialog.vue'
import BasicInfo from './BasicInfo.vue'
import ProdInfo from './ProdInfo.vue'
import SignLog from './SignLog.vue'
const route = useRoute()
const router = useRouter()

const editorState = reactive<CommonState>({
  visible: false,
  record: computed(() => userInfo.value)
})

const data = computed(() => {
  const {
    login_at,
    login_ip,
    login_addr,
    login_browser_info,
    login_system_info,
    login_count
  } = userInfo.value

  return [
    {
      label: '登录时间',
      value: formatUnix(Number(login_at)) || '-'
    },
    {
      label: '登录IP',
      value: login_ip || '-'
    },
    {
      label: 'IP所在地',
      value: login_addr || '-'
    },
    {
      label: '系统版本',
      value: login_system_info || '-'
    },
    {
      label: '浏览器版本',
      value: login_browser_info || '-'
    },
    {
      label: '登录次数',
      value: String(login_count || 0)
    }
  ]
})
const activeTab = ref('basic')
const loading = ref(false)
const handleBack = () => {
  router.push({ name: 'UserList' })
}

const userInfo = ref<UserInfo>({})

const groups = ref<SelectOptionData[]>([])
const getUserGroups = () => {
  getUserGroupsListApi({ limit: 0 }).then(res => {
    const data = (res.list ?? []).map(item => ({
      label: String(item.name),
      value: String(item.id)
    }))
    groups.value = data
  })
}
const getUserInfo = () => {
  loading.value = true
  getUserDetailApi({
    id: String(route?.params?.userId || '')
  })
    .then(res => {
      userInfo.value = res
    })
    .finally(() => {
      loading.value = false
    })
}

const userResetVisible = ref(false)
const handleResetPassword = () => {
  userResetVisible.value = true
}

onMounted(() => {
  getUserInfo()
  getUserGroups()
})
</script>
<style lang="less" scoped>
.user-detail {
  padding: 16px 24px;
  width: 100%;
  min-width: 1240px;
  height: 100%;
  background: url('@/assets/images/user_detail_bg.png') no-repeat center top;
  background-color: var(--color-fill-2, #f2f3f5);
  .arco-layout-header {
    margin-bottom: 16px;
  }
  .detail-sider {
    position: relative;
    overflow: hidden;
    padding: 48px 24px;
    margin-right: 16px;
    width: 328px !important;
    height: 100%;
    &::before {
      content: '';
      position: absolute;
      top: -124px;
      right: 0;
      width: 287.631px;
      height: 348px;
      transform: rotate(-32.13deg);
      background-color: #0077fa;
      opacity: 0.05;
      filter: blur(100px);
    }
    &::after {
      content: '';
      position: absolute;
      top: 0px;
      left: 0;
      width: 200px;
      height: 200px;
      background-color: #5a92ff;
      opacity: 0.05;
      filter: blur(100px);
    }

    :deep(.arco-layout-sider-children) {
      display: flex;
      justify-content: start;
      align-items: center;
      flex-direction: column;
      row-gap: 48px;
      overflow-x: hidden;
      .arco-btn {
        padding: 8px 28px;
        width: 132px;
      }
      .reset-btn {
        color: rgb(var(--primary-6));
        border-color: rgb(var(--primary-6));
      }
      .arco-divider {
        border-bottom: 1px solid var(--color-border-1);
        margin: 14px 0;
        .arco-divider-text {
          font-size: 12px;
          color: var(--color-text-3);
        }
      }
      .arco-descriptions-table {
        border: 1px solid var(--color-border-1);
        .arco-descriptions-row {
          border-bottom: 1px solid var(--color-border-1);
        }
        .arco-descriptions-item-label,
        .arco-descriptions-item-value {
          padding: 14px 16px;
        }
        .arco-descriptions-item-value {
          border-left: 1px solid var(--color-border-1);
        }
      }
    }
  }
  .detail-content {
    background-color: white;
  }
  .arco-tabs {
    position: relative;
    padding: 24px;
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 88px;
      background: linear-gradient(180deg, #ebf3fa 0%, #fff 100%);
      content: '';
    }
  }

  :deep(.arco-tabs-content) {
    padding-top: 24px;
  }
}
</style>
