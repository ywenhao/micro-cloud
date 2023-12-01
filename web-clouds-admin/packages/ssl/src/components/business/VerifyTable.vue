<template>
  <div class="domain-tutorial">
    <div
      v-for="item in tutorialData"
      :key="item.key"
      class="tutorial-box"
      :class="{ 'is-title': item.key === 'config' }"
    >
      <!--   -->
      <!-- {{ item.value }} -->
      <div
        v-if="item.key != 'primary_domain' || item.value"
        class="domain-tutorial__item"
      >
        <div class="tutorial-label">
          <div
            v-if="['domain', 'primary_domain'].includes(item.key)"
            class="flex flex-col h-full justify-center"
          >
            <span class="domain-tutorial__item-label">{{ item.label }}</span>
            <span
              v-if="item.key === 'domain'"
              class="domain-tutorial__item-label"
            >
              {{ dealRecordValue(record?.domain ?? '') }}
            </span>
            <span
              v-if="item.key === 'primary_domain'"
              class="domain-tutorial__item-label"
            >
              {{ dealRecordValue(record?.primary_domain ?? '') }}
            </span>
          </div>
          <span v-else>{{ item.label }}</span>
        </div>

        <div class="tutorial-value">
          <span v-if="['domain', 'primary_domain', 'log'].includes(item.key)">
            {{ dealRecordValue(item.value) }}</span
          >
          <span v-else v-table-cell="item.value" class="truncate"></span>
          <a-tooltip
            v-if="item.showTip"
            :content="item.tips"
            background-color="white"
            class="flex-shrink-0"
            content-class="tool-content is-verify"
          >
            <icon-question-circle size="16" class="cursor-pointer" />
          </a-tooltip>
          <i class="flex-1"></i>
          <a-link
            v-if="item.showCopy && item.value"
            class="flex-shrink-0"
            @click="copy(item.value)"
            >复制</a-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { IconQuestionCircle } from '@arco-design/web-vue/es/icon'
import { useClipboard } from 'vc-material/hooks/index'

import type { ApplyListItem } from '@/types/applyList'
interface IProps {
  record: ApplyListItem
}
const props = withDefaults(defineProps<IProps>(), {
  record: undefined
})
const { copy } = useClipboard()
const tutorialData = reactive([
  {
    key: 'config',
    label: '配置项目',
    value: '配置项值',
    showTip: false,
    tips: '',
    showCopy: false
  },
  {
    key: 'dns',
    label: '域名授权验证类型',
    value: 'DNS',
    showTip: false,
    tips: '',
    showCopy: false
  },
  {
    key: 'type',
    label: '记录类型',
    value: 'TXT',
    showTip: true,
    tips: '如果该主机记录存在其他的TXT记录，请暂时去掉其他TXT记录。',
    showCopy: false
  },
  {
    key: 'log',
    label: '主机记录',
    value: computed(() => props?.record?.txt_name ?? ''),
    showTip: true,
    tips: '在申请域名管理控制台下配置上述TXT主机记录。',
    showCopy: true
  },
  {
    key: 'domain',
    label: '记录值',
    value: computed(() => props?.record?.txt_value ?? ''),
    showTip: true,
    tips: `在申请域名管理控制台下配置上述TXT记录值`,
    showCopy: true
  },
  {
    key: 'primary_domain',
    label: '记录值',
    value: computed(() => props?.record?.txt_primary_value ?? ''),
    showTip: true,
    tips: `在申请域名管理控制台下配置上述TXT记录值`,
    showCopy: true
  }
])

const dealRecordValue = computed(() => (value: string) => {
  if (value.length >= 16) {
    const start = value.substring(0, 7)
    const end = value.substring(value.length - 8)
    return `${start}...${end}`
  } else {
    return value || '-'
  }
})
</script>
<style lang="less" scoped>
.domain-tutorial {
  @apply ~"flex flex-col flex-1 w-full mr-0  mt-[14px]  text-sm text-[#454954]";

  .tutorial-box {
    border-bottom: 1px solid #f1f2f3;
    &:last-child {
      border-bottom: none;
    }

    .domain-tutorial__item {
      @apply ~" grid  grid-cols-2 h-12 ";
      &-label {
        @apply w-full text-start;
      }
    }
    &.is-title {
      height: 40px;
      color: rgb(var(--color-text-1));
      background: #f7f8fa;
      font-weight: 600;
      .domain-tutorial__item {
        height: 40px;
      }
    }

    .tutorial-label {
      @apply h-full flex items-center  w-[200px] pl-4;
    }
    .tutorial-value {
      display: flex;
      flex-direction: row;
      column-gap: 4px;
      align-items: center;
      padding-right: 16px;
      border-right: 1px solid var(--color-border-1);
    }
  }
}
</style>
