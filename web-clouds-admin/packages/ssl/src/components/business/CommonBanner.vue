<template>
  <div
    class="flex flex-row gap-x-2 w-full text-sm px-4 py-[6px] rounded-[6px] mt-2"
    :class="bgClass"
  >
    <vc-svg-icon prefix="ssl" :name="iconName" :size="20"></vc-svg-icon>
    <div class="text-ct-1 w-full">
      {{ content }}<br />
      <div v-if="unVerifyDomain && status === 'error'" class="truncate">
        {{ unVerifyDomain }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { LicenseInfo } from '@/types/applyList'

interface IProps {
  status: string
  record?: LicenseInfo
  content: string
}
const props = withDefaults(defineProps<IProps>(), {
  domain: '',
  content: ''
})
const unVerifyDomain = computed(() => {
  if (props.record?.domain && props.record?.primary_domain) {
    return `${props.record?.primary_domain}、${props.record?.domain}`
  } else {
    return props.record?.domain || ''
  }
})

const iconName = computed(() =>
  props.status === 'error' ? 'error' : 'success'
)
const bgClass = computed(() =>
  props.status === 'error' ? 'bg-danger-1' : 'bg-success-1'
)
</script>
