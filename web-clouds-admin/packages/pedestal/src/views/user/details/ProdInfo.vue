<template>
  <div class="grid grid-cols-3 p-4 gap-4 bg-fill-1">
    <prod-card
      v-for="(item, index) in cardInfo"
      :key="`prod__${index}`"
      :data="item"
    ></prod-card>
  </div>
</template>
<script lang="tsx" setup>
import { IconInfoCircle } from '@arco-design/web-vue/es/icon'
import {
  getUserProductDetailApi,
  productListApi,
  type UserProduct
} from '@vca/apis/pedestal'
import { get } from 'lodash-es'
import { useListRequest } from 'vc-material'

import ProdCard from './components/ProdCard.vue'
import type { CardInfo } from './type'
const route = useRoute()

const state = reactive<UserProduct>({})

const { run: getProducts, data: products } = useListRequest(productListApi)
const productIcon = computed<Record<string, string>>(() => {
  return products.value.reduce((pre, curr) => {
    pre[String(curr.symbol)] = String(curr.icon)
    return pre
  }, {} as Record<string, string>)
})
const cardInfo = computed<CardInfo[]>(() => {
  const res: CardInfo[] = [
    {
      name: '云存储 OSS',
      icon: {
        symbol: 'oss',
        icon: get(productIcon.value, 'oss')
      },
      content: [
        {
          label: '存储空间',
          value: get(state, 'oss.storage_bytes') || '0'
        },
        {
          label: '剩余',
          value: get(state, 'oss.remain_storage_bytes') || '0'
        },
        {
          label: '空间数量',
          value: get(state, 'oss.bucket_count') || '0'
        },
        { label: '剩余', value: get(state, 'oss.remain_bucket_count') || '0' }
      ],
      portal: `/product/oss/space-list`
    },
    {
      name: '云转码 MTS',
      icon: {
        symbol: 'mts',
        icon: get(productIcon.value, 'mts')
      },
      content: [
        {
          label: '总任务数量',
          value: get(state, 'mts.total_task_count') || '0'
        },
        { label: '已成功', value: get(state, 'mts.success_task_count') || '0' },
        {
          label: '转码总时长',
          value: get(state, 'mts.total_duration') || '0'
        },
        {
          label: '截图总数量',
          value: get(state, 'mts.total_screenshot_count') || '0'
        }
      ],
      portal: `/product/mts/task/manage`
    },
    {
      name: '云分发 CDN',
      icon: {
        symbol: 'cdn',
        icon: get(productIcon.value, 'cdn')
      },
      content: [
        {
          label: '总流量',
          value: get(state, 'cdn.total_bytes') || '0'
        },
        {
          label: '节省流量',
          value: get(state, 'cdn.total_hit_bytes') || '0'
        },
        {
          label: '请求数量',
          value: get(state, 'cdn.total_request_count') || '0'
        },
        {
          label: '加速站点',
          value: () => (
            <div class="flex items-center justify-end gap-x-1">
              <span>{get(state, 'cdn.site_count') || '0'}</span>
              <a-popover>
                {{
                  default: () => <IconInfoCircle />,
                  content: () => (
                    <div class="flex flex-col text-xs">
                      <div>
                        正常: {get(state, 'cdn.enable_site_count') || '0'}个
                      </div>
                      <div>
                        失败: {get(state, 'cdn.disable_site_count') || '0'}个
                      </div>
                    </div>
                  )
                }}
              </a-popover>
            </div>
          )
        }
      ],
      portal: `/product/cdn/site/list`
    },
    {
      name: 'SSL 证书',
      icon: {
        symbol: 'ssl',
        icon: get(productIcon.value, 'ssl')
      },
      content: [
        {
          label: '申请总数量',
          value: get(state, 'ssl.total') || '0'
        },
        {
          label: '已签发证书数量',
          value: get(state, 'ssl.issued') || '0'
        },
        {
          label: '即将过期',
          value: get(state, 'ssl.expiring') || '0'
        },
        {
          label: '自有证书总数',
          value: get(state, 'ssl.own') || '0'
        }
      ],
      portal: `/product/ssl/license`
    },
    {
      name: '云解析 DNS',
      icon: {
        symbol: 'ssl',
        icon: get(productIcon.value, 'dns')
      },
      content: [
        {
          label: '域名数量',
          value: get(state, 'dns.domain_count') || '0'
        },
        {
          label: '异常域名',
          value: get(state, 'dns.abnormal_domain_count') || '0'
        }
      ],
      portal: `/product/dns/user-domain`
    }
  ]

  return res
})
const getUserProduct = () => {
  getUserProductDetailApi({ id: String(route.params?.userId) }).then(res => {
    Object.assign(state, res)
  })
}
onMounted(() => {
  getProducts()
  getUserProduct()
})
</script>
