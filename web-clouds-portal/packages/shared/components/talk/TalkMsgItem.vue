<template>
  <div
    class="talk-msg-item"
    :data-id="id"
    :class="position"
    :data-position="position"
    ref="elRef"
  >
    <div class="msg-box">
      <vc-svg-icon name="kf" class="left-icon" v-if="isLeft" />
      <div class="msg-main">
        <div class="msg-content" :class="type === 'image' && 'is-image'">
          <template v-if="type === 'text'">{{ message }}</template>
          <a-image v-else :src="mergeBaseURL(message)" class="msg-image">
            <template #error>
              <vc-svg-icon class="w-full h-full" name="image_error" />
            </template>
          </a-image>
        </div>
        <div class="msg-bottom">
          <div class="msg-time">{{ time }}</div>
          <div class="msg-status" :class="status" v-if="!isLeft">
            {{ statusText }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mergeBaseURL } from '@vcp/shared'
import { computed, ref } from 'vue'

const props = defineProps<{
  id: string
  time: string
  message: string
  type: 'text' | 'image'
  status?: 'read' | 'unread'
  position: 'left' | 'right'
}>()

const isLeft = computed(() => props.position === 'left')
const statusText = computed(() => (props.status === 'read' ? '已读' : '未读'))

const elRef = ref<HTMLDivElement>()

defineExpose({ elRef })
</script>

<style lang="less" scoped>
.talk-msg-item {
  width: 100%;
  display: flex;
  &.right {
    justify-content: flex-end;
    .msg-main {
      align-items: flex-end;
    }
    .msg-content {
      background: rgb(var(--primary-6));
      color: #fff;
      border-radius: 8px 0px 8px 8px;
    }
  }
  .left-icon {
    width: 40px;
    height: 40px;
  }
}

.msg-image {
  cursor: pointer;
}
.msg-image,
:deep(.arco-image-img) {
  border-radius: 8px;
  width: 136px;
  height: 136px;
}
:deep(.arco-image-img) {
  object-fit: cover;
}

.msg-box {
  display: flex;
  column-gap: 8px;
  max-width: 830px;
  .msg-main {
    display: flex;
    flex-direction: column;
    flex: 1;
    .msg-bottom {
      display: flex;
      column-gap: 4px;
      align-items: center;
      font-size: 12px;
      line-height: 18px;
      margin-top: 4px;
      color: var(--color-text-4);
      .msg-status {
        &.unread {
          color: rgb(var(--primary-6));
        }
      }
    }
  }
}
.msg-content {
  white-space: pre-wrap;
  word-break: break-all;
  padding: 14px 16px;
  width: fit-content;
  background: var(--color-fill-2);
  color: var(--color-text-1);
  border-radius: 0px 8px 8px 8px;
  &.is-image {
    border-radius: 8px !important;
    padding: 0;
  }
}
</style>
