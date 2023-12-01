<template>
  <div class="tips text-primary">
    <div class="title flex">
      <vc-svg-icon :size="20" name="tip" />
      <div class="ml-8px">
        通过本功能可为域名批量添加解析记录，解析记录格式规范如下：
      </div>
    </div>
    <div class="tips-content">
      <div>
        一行一条解析记录，格式为：域名、记录类型、主机记录、记录值，中间以空格分隔；例如：abc.com
        A @ 190.0.0.1；您可借助 excel 生成解析记录，并复制到下文输入框；
      </div>

      <div>本功能增加的解析记录TTL时间都为10 分钟；</div>
    </div>
  </div>

  <domain-input
    class="w-497px!"
    v-model="state.rrs"
    :placeholder="placeholder"
  />
</template>

<script setup lang="ts">
import DomainInput from './DomainInput.vue'

interface IProps {
  formState: {
    rrs: string
  }
}

const props = defineProps<IProps>()
const state = computed(() => props.formState)

const placeholder = `一行一条解析记录，最多支持1000条；
格式：域名 记录类型 主机记录 记录值
例如：abc.com A @ 190.0.0.1
支持复制粘贴到输入框，但请核对数据是否正确。`
</script>

<style lang="less" scoped>
.domain-input {
  :deep(.a-textarea__inner) {
    height: 240px;
  }
}

.tips {
  padding: 8px;
  margin-bottom: 16px;
  width: 100%;
  font-size: 14px;
  background: rgb(var(--primary-1));
  border-radius: 6px;
  line-height: 20px;
  .title {
    font-weight: 500;
  }
  .tips-content {
    font-weight: 400;
    margin-top: 8px;
  }
}
</style>
