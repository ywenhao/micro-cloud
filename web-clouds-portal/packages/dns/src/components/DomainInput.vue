<template>
  <div class="flex flex-col w-full domain-input">
    <a-textarea
      v-model="value"
      class="domain-textarea"
      :placeholder="placeholder"
    />
    <div class="tips w-full flex justify-end text-14px">
      <div class="inline-block text-[var(--color-text-3)]">
        {{ domainTotal }} 条
      </div>
      <div
        class="ml-4 flex items-center cursor-pointer select-none"
        :class="
          domainTotal
            ? 'text-[var(--color-text-3)] hover:opacity-80'
            : 'text-[#C5CBD8] cursor-not-allowed'
        "
        @click="value = ''"
      >
        清空记录
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDomainsTotal } from '@/hooks/useDomainsTotal'

interface IProps {
  modelValue: string
  placeholder?: string
}

const props = withDefaults(defineProps<IProps>(), {
  placeholder: '输入需要添加的域名，每行一个，最多添加1000个'
})

const value = useVModel(props, 'modelValue')

const domainTotal = useDomainsTotal(() => value.value)
</script>

<style lang="less" scoped>
.domain-input {
  position: relative;
}
.tips {
  position: absolute;
  right: 0;
  bottom: -24px;
}
.domain-textarea {
  :deep(.arco-textarea) {
    min-height: 160px;
  }
}
</style>
