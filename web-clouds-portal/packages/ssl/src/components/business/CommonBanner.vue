<template>
  <div
    class="flex flex-row gap-x-2 w-full text-sm px-4 py-[6px] rounded-[6px] mt-2"
    :class="bgClass"
  >
    <vc-svg-icon prefix="ssl" :name="status" :size="20"></vc-svg-icon>
    <div class="w-full text-ct-1">
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
  const { domain, primary_domain } = props.record ?? {}
  if (domain && primary_domain) {
    return `${primary_domain}、${domain}`
  } else {
    return domain || ''
  }
})

const bgClass = computed(() =>
  props.status === 'error' ? 'bg-danger-1' : 'bg-success-1'
)
</script>
