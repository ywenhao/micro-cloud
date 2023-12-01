<script setup lang="ts">
import {
  IconCheckCircleFill,
  IconExclamationCircleFill
} from '@arco-design/web-vue/es/icon'
import type { ProductModel } from '@vca/apis/pedestal'

const record = defineModel<ProductModel>('record', { required: true })
const visible = ref(false)
const router = useRouter()

const toSetup: Record<number, string> = {
  // DNS控制台，DNS配置菜单
  1: '/product/dns/dns-config',
  // DNS控制台，系统域名菜单
  2: '/product/dns/sys-domain',
  // 云存储控制台，区域管理菜单
  3: '/product/oss/region',
  // 云存储控制台，外链调度域名菜单
  4: '/product/oss/chain-domain',
  // CDN控制台，节点列表菜单
  5: '/product/cdn/node/list',
  // DNS控制台，系统域名菜单
  6: '/product/dns/sys-domain',
  // CDN控制台，解析域名菜单
  7: '/product/cdn/analysis/domain',
  // 云转码控制台，节点管理菜单
  8: '/product/mts/dispatch/node',
  // SSL控制台，申请配置菜单
  9: '/product/ssl/config'
}
const handleBeforeOk = async () => {
  const { index } = (record.value?.config_status || []).find(
    item => !item.success
  )!

  const { href } = router.resolve(toSetup[index!])
  window.open(href, '_blank')

  return Promise.reject()
}
</script>

<template>
  <div v-if="record.config_status?.length">
    <a-tooltip content="未完成配置">
      <icon-exclamation-circle-fill
        @click="visible = true"
        class="text-danger! text-2xl cursor-pointer"
      />
    </a-tooltip>
    <vc-dialog
      :on-before-ok="handleBeforeOk"
      title="产品未完成配置"
      v-model="visible"
      ok-text="去配置"
      @close="visible = false"
      :renderToBody="false"
    >
      <a-list
        :split="false"
        class="bg-fill-1 rounded-md! p-4!"
        :bordered="false"
      >
        <div class="divide-y divide-dashed divide-[var(--color-border-2)]">
          <a-list-item
            v-for="(item, i) in record?.config_status || []"
            :class="[
              'p-0! text-ct-3 pr-3 w-full overflow-hidden border-x-none!',
              {
                'pb-4!': i !== (record?.config_status || []).length - 1,
                'pt-4!': i !== 0
              },
              item?.success ? 'text-success' : 'text-danger'
            ]"
            :key="i"
          >
            <div class="flex items-center gap-x-10">
              <span class="flex-1">{{ item.content }}</span>
              <div class="min-w-6">
                <icon-check-circle-fill class="text-xl" v-if="item?.success" />
                <icon-exclamation-circle-fill v-else class="text-xl" />
              </div>
            </div>
          </a-list-item>
        </div>
      </a-list>
    </vc-dialog>
  </div>
</template>
