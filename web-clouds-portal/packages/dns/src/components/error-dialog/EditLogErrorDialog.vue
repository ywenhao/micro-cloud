<template>
  <vc-dialog
    title="温馨提示"
    v-model="visible"
    width="596px"
    :onBeforeOk="onBeforeOk"
    popup-container="body"
    hideCancel
    okText="知道了"
  >
    <div class="w-full">
      <a-alert class="mb-4" closable
        >因域名错误、规则限制、条件不匹配、修改内容格式错误、域名不存在等原因，有记录未成功删除</a-alert
      >
      <div class="custom-table">
        <div class="t-head">
          <div class="t-item">输入内容</div>
          <div class="t-item">成功删除记录</div>
        </div>
        <div class="t-body">
          <div class="t-item">{{ state.domain_count }}行</div>
          <div class="t-item">{{ state.success_count }}条</div>
        </div>
      </div>
      <div class="mt-6 mb-8px text-$color-text-1">
        存在域名错误、规则限制、不存在等情况的输入内容：
      </div>
      <div
        class="flex flex-col h-[227px] p-12px bg-[#F7F8FA] border border-solid border-[var(--color-border-2)] rounded-[6px] color-ct-3"
      >
        <vc-scrollbar>
          <div v-for="(item, index) in state.fail_domains" :key="index">
            {{ item }}
          </div>
        </vc-scrollbar>
      </div>
    </div>
  </vc-dialog>
</template>

<script setup lang="ts">
interface IProps {
  modelValue: boolean
  state: {
    success_count: string
    fail_domains: string[]
    domain_count: string
  }
}
interface IEmits {
  (event: 'update:modelValue', value: boolean): any
}

const props = defineProps<IProps>()
defineEmits<IEmits>()

const visible = useVModel(props, 'modelValue')

async function onBeforeOk() {
  return true
}
</script>

<style lang="less" scoped>
.custom-table {
  display: flex;
  font-size: 14px;
  border: 1px solid var(--color-border-1);
  border-radius: 6px;
  font-weight: 400;
  line-height: 20px;
  .t-head {
    width: 144px;
    border-right: 1px solid var(--color-border-1);
    color: var(--color-text-2);
  }
  .t-body {
    flex: 1;
    color: var(--color-text-1);
  }
  .t-item {
    padding: 14px 16px;
    padding-right: 0;
  }
  .t-item + .t-item {
    border-top: 1px solid var(--color-border-1);
  }
}
</style>
