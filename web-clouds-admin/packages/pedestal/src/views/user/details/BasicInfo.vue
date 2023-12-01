<template>
  <a-spin class="w-full h-full" :loading="loading">
    <div class="w-full h-full flex flex-col gap-y-6">
      <section class="info-container">
        <div
          v-for="(item, index) in userInfoCard"
          :key="`basic_${index}`"
          class="info-row"
        >
          <div v-for="ele in item" class="info-item" :key="`${ele.label}`">
            <span class="info-item__title">{{ ele.label }}</span>
            <span class="info-item__desc">{{ ele.value }}</span>
          </div>
        </div>
      </section>
      <section class="w-full h-full">
        <div class="module-title">
          用户权益 <span class="text-ct-3">（所在分组权益）</span>
        </div>

        <div class="info-container">
          <div
            v-for="(item, index) in userEquityCard"
            :key="`basic_${index}`"
            class="info-row"
          >
            <div v-for="ele in item" class="info-item" :key="`${ele.label}`">
              <span class="info-item__title">{{ ele.label }}</span>
              <span class="info-item__desc">{{ ele.value }}</span>
            </div>
          </div>
        </div>
      </section>
      <section class="w-full h-full">
        <div class="module-title">注册信息</div>
        <div class="info-container">
          <div
            v-for="(item, index) in registerInfoCard"
            :key="`basic_${index}`"
            class="info-row"
          >
            <div v-for="ele in item" class="info-item" :key="`${ele.label}`">
              <span class="info-item__title">{{ ele.label }}</span>
              <span class="info-item__desc">{{ ele.value }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </a-spin>
</template>
<script lang="ts" setup>
import type { DescData } from '@arco-design/web-vue'
import {
  getUserGroupDetailApi,
  type UserGroupBenefits,
  type UserInfo
} from '@vca/apis/pedestal'
import { formatUnix } from 'vc-material'
const route = useRoute()
const userInfo = defineModel<UserInfo>('userInfo', { required: true })
const loading = defineModel('loading', { default: false })
const userInfoCard = computed<Array<DescData[]>>(() => {
  const { id, username, email, group_name, api_status, status } = userInfo.value
  const res: Array<DescData[]> = [
    [
      { label: '用户ID', value: id || '-' },
      { label: '账号', value: username || '-' },
      { label: '邮箱', value: email || '-' }
    ],
    [
      { label: '用户分组', value: group_name || '-' },
      { label: '对外接口', value: Number(api_status) === 1 ? '启用' : '禁用' },
      { label: '账号状态', value: Number(status) === 1 ? '启用' : '禁用' }
    ]
  ]
  return res
})

const formatValue = (value: string | number | undefined, unit = '个') => {
  let val: string | number = '-'
  try {
    val = Number(value)
    return val === 0 ? '不限制' : `${val} ${unit}`
  } catch (error) {
    return `${val} ${unit}`
  }
}
const userEquityCard = computed<Array<DescData[]>>(() => {
  const {
    oss_privilege: oss,
    mts_privilege: mts,
    cdn_privilege: cdn,
    ssl_privilege: ssl,
    dns_privilege: dns
  } = userGroupBenefits.value
  return [
    [
      {
        label: '最大存储空间',
        value: formatValue(
          oss?.max_storage_space,
          ['KB', 'GB', 'TB', 'PB'][Number(oss?.storage_space_unit)]
        )
      },
      { label: '可创建空间', value: formatValue(oss?.max_bucket_count, '') },
      {
        label: '可转码时长',
        value: formatValue(mts?.max_video_duration, '小时/月')
      }
    ],
    [
      {
        label: '可截图次数',
        value: formatValue(mts?.max_screenshot_times, '次/月')
      },
      { label: '可创建站点数', value: formatValue(cdn?.max_site_count) },
      { label: '带宽限速', value: formatValue(cdn?.speed_limit, 'Mbps') }
    ],
    [
      {
        label: '可添加域名数量',
        value: formatValue(dns?.max_domain_count)
      },
      {
        label: '单个域名解析记录数量',
        value: formatValue(dns?.max_rr_count_per_domain)
      },
      {
        label: '可申请证书数量',
        value: formatValue(ssl?.max_certificate_count)
      }
    ],
    [
      {
        label: '可申请域名数量',
        value: formatValue(dns?.max_domain_count)
      }
    ]
  ]
})
const registerInfoCard = computed<Array<DescData[]>>(() => {
  const {
    created_at,
    register_addr,
    register_ip,
    register_browser_info,
    register_system_info
  } = userInfo.value
  return [
    [
      { label: '注册时间', value: formatUnix(Number(created_at)) || '-' },
      { label: '注册IP', value: register_ip || '-' },
      { label: 'IP所在地', value: register_addr || '-' }
    ],
    [
      { label: '系统版本', value: register_system_info || '- ' },
      { label: '浏览器版本', value: register_browser_info || '-' }
    ]
  ]
})

const userGroupBenefits = ref<UserGroupBenefits>({})
const getUserGroupBenefits = () => {
  getUserGroupDetailApi({
    id: String(route?.params?.groupId || '')
  }).then(res => {
    userGroupBenefits.value = res
  })
}

onMounted(getUserGroupBenefits)
</script>

<style lang="less" scoped>
.module-title {
  position: relative;
  padding: 10px 24px;
  background-color: var(--color-fill-1);
  &::before {
    position: absolute;
    top: 11px;
    left: 16px;
    width: 3px;
    height: 14px;
    background-color: rgb(var(--primary-6));
    content: '';
  }
}
.info-container {
  padding: 8px 24px;
  border: 1px solid var(--color-border-1, #f2f3f5);
  .info-row {
    @apply grid grid-cols-3;
    padding: 16px 0;
    flex-direction: row;
    border-bottom: 1px solid var(--color-border-1);
    &:last-child {
      border-bottom: none;
    }
    .info-item {
      display: flex;
      flex-direction: column;
      row-gap: 4px;
      &__title {
        color: var(--color-text-3);
        line-height: 20px;
      }
      &__desc {
        color: var(--color-text-1);
        line-height: 20px;
      }
    }
  }
}
</style>
