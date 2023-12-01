<template>
  <div
    class="talk-msg-item"
    :data-id="id"
    :class="position"
    :data-position="position"
    ref="elRef"
  >
    <div class="msg-box">
      <vc-svg-icon name="cloud" class="left-icon" v-if="isLeft" />
      <div class="msg-main">
        <div class="msg-content">
          <template v-if="type === 'text'">{{ message }}</template>
          <vc-image v-else :src="message" class="msg-image" />
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
      flex: 1;
      overflow: hidden;
      align-items: flex-end;
    }
    .msg-content {
      background: #2253e6;
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
  width: 100px;
  height: 100px;
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
    overflow: hidden;
    .msg-bottom {
      display: flex;
      column-gap: 4px;
      align-items: center;
      font-size: 12px;
      line-height: 18px;
      margin-top: 4px;
      color: #86909c;
      .msg-status {
        &.unread {
          color: #2253e6;
        }
      }
    }
  }
}
.msg-content {
  white-space: pre-wrap;
  word-break: break-all;
  max-width: 100%;
  padding: 14px 16px;
  background: #f2f3f5;
  color: #1d2129;
  width: max-content;
  border-radius: 0px 8px 8px 8px;
}
</style>
