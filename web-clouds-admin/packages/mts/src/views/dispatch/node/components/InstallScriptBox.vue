<template>
  <div class="script-box">
    <div class="title-box">
      <div class="title">请复制以下内容后在MTS节点服务器中进行安装！</div>
      <a-link
        class="copy-btn"
        v-if="script"
        :hoverable="false"
        @click="handleCopy"
        ><vc-svg-icon name="copy2" class="mr-1" prefix="mts" />复制脚本</a-link
      >
    </div>
    <div class="content" :class="!script && 'center'">
      <vc-scrollbar v-if="script">{{ script }}</vc-scrollbar>
      <a-button
        :disabled="scriptBtnDisabled"
        type="primary"
        class="gen-script-btn"
        @click="emit('on-generate')"
        v-else
        >{{ end ? '生成脚本' : '重新生成脚本' }}</a-button
      >
      <div class="sub-tip" v-if="!script && !end">
        修改版本或区域等，需要重新生成脚本
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { useClipboard } from 'vc-material'

const { copy } = useClipboard()

const props = defineProps<{
  script: string
  end: boolean
  scriptBtnDisabled: boolean
}>()

const emit = defineEmits<{
  'on-generate': []
}>()

function handleCopy() {
  copy(props.script)
  Message.success('复制成功')
}
</script>

<style scoped lang="less">
@border: 1px solid var(--color-border-2);
.script-box {
  width: 100%;
  background-color: #fff;
  border-radius: 6px;
  .title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
    width: 100%;
    height: 40px;
    font-size: 14px;
    background-color: var(--color-fill-2);
    border: @border;
    border-radius: 6px 6px 0 0;
    font-weight: 400;
    line-height: 20px;
    .title {
      color: var(--color-text-1);
    }
    .copy-btn {
      display: inline-flex;
      align-items: center;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .content {
    height: 120px;
    color: var(--color-text-1);
    border: @border;
    border-radius: 0 0 6px 6px;
    border-top: 0;
    word-break: break-all;
    &.center {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
  .sub-tip {
    margin-top: 8px;
    font-size: 12px;
    color: var(--color-text-3);
    line-height: 18px;
  }
  :deep(.vc-scrollbar__wrap) {
    padding: 8px 12px;
  }
}
</style>
