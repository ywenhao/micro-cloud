<template>
  <div class="dns-status">
    <a-tooltip
      v-if="status === 2"
      position="top"
      class="light dns-status-tooltip"
      content-class="dns-tooltip-content"
    >
      <dns-status-item :type="statusConfig.type" :text="statusConfig.text" />
      <template #content>
        <div class="break-all flex flex-col">
          <div
            class="flex items-center whitespace-nowrap leading-[20px] color-$color-text-1 font-500"
          >
            <vc-svg-icon
              prefix="dns"
              :size="18"
              name="warning"
              class="mr-6px"
            />
            请到域名注册商处修改DNS服务器为：
          </div>
          <div class="break-all leading-[20px]">
            <div class="pt-6px color-$color-text-2">
              {{ getAddr(nsList[0]) }}
            </div>
            <div class="color-$color-text-2">
              {{ getAddr(nsList[1]) }}
            </div>
          </div>
          <div class="whitespace-nowrap mt-6px text-end">
            <a-button
              size="mini"
              class="dns-edit-btn"
              type="primary"
              @click="emit('edit')"
            >
              修改
            </a-button>
          </div>
        </div>
      </template>
    </a-tooltip>
    <dns-status-item
      v-else
      :type="statusConfig.type"
      :text="statusConfig.text"
    />
  </div>
</template>

<script setup lang="ts">
import DnsStatusItem from './DnsStatusItem.vue'

interface IProps {
  status: number
  nsList: ({ addr: string } | string)[]
}

interface StatusConfig {
  type: '' | 'success' | 'warning' | 'danger' | 'info'
  text: string
}

const props = defineProps<IProps>()

const emit = defineEmits<{
  edit: []
}>()

const getAddr = (ns: { addr: string } | string) => {
  return typeof ns === 'string' ? ns : ns.addr
}

const statusMap = [
  {
    type: 'success',
    text: '正常'
  },
  {
    type: 'warning',
    text: '异常'
  }
]

const statusConfig = computed<StatusConfig>(() => {
  return (statusMap[props.status - 1] || {
    type: '',
    text: ''
  }) as StatusConfig
})
</script>

<style lang="less">
.dns-tooltip-content {
  width: 296px;
}
.dns-edit-btn {
  line-height: 24px;
}
</style>
