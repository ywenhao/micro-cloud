<template>
  <div class="talk-box">
    <div class="content-box">
      <div class="content" ref="contentRef">
        <a-spin
          v-show="!!loadMoreSpin"
          class="load-more-spin"
          :class="loadMoreSpin"
        />
        <vc-scrollbar
          ref="scrollbarRef"
          class="flex flex-col flex-1 basis-0"
          view-class="px-24px"
        >
          <div class="talk-list" ref="talkListRef">
            <talk-msg-item
              ref="talkMsgItemRef"
              v-for="item in messageList"
              :key="item.id"
              :id="item.id"
              :type="item.messageType"
              :message="item.message"
              :time="formatUnix(item.time)"
              :position="item.position"
              :status="item.status"
            />
          </div>
        </vc-scrollbar>
      </div>
      <div class="talk-input" :class="isEnd && 'disabled'">
        <a-textarea
          :disabled="isEnd"
          v-model="inputValue"
          placeholder="回复..."
          @keydown.enter="onInputKeyDown"
        />
        <div class="btn-box">
          <input
            :disabled="isEnd"
            type="file"
            :accept="imageAccept"
            v-show="false"
            ref="uploadImageRef"
          />
          <a-spin class="w-32px h-32px" :loading="imageUploadIng">
            <vc-svg-icon
              :size="32"
              name="talk_img"
              class="send-btn"
              @click="handleUploadImage"
            />
          </a-spin>
          <vc-svg-icon
            :size="32"
            name="talk_send"
            class="send-btn"
            @click="handleSend('text', inputValue)"
          />
        </div>
      </div>
    </div>
    <div class="detail-box" v-if="$slots.default">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { debounce, unionBy } from 'lodash-es'
import { formatUnix, imageAccept } from 'vc-material'
import {
  onBeforeUnmount,
  onMounted,
  ref,
  watchEffect,
  watchPostEffect
} from 'vue'

import TalkMsgItem from './TalkMsgItem.vue'
import type {
  TalkLoadMoreHandler,
  TalkLoadMoreParams,
  TalkMessageItem,
  TalkMessageType,
  TalkSendParams
} from './types'

const props = withDefaults(
  defineProps<{
    isEnd?: boolean
    loopDelay?: number
    loadMore: TalkLoadMoreHandler
    uploadImageRequest: (params: FormData) => Promise<string>
    sendRequest: (params: TalkSendParams) => Promise<void>
    readRequest: (params: TalkMessageItem[]) => Promise<void>
  }>(),
  {
    loopDelay: 3000
  }
)

const scrollbarRef = ref()
const uploadImageRef = ref<HTMLInputElement>()
const inputValue = ref('')
const imageUploadIng = ref(false)
const sendTextIng = ref(false)
const messageList = ref<TalkMessageItem[]>([])

async function onLoadMore(params: TalkLoadMoreParams) {
  const result = await props.loadMore(params)
  const list = unionBy([...result, ...messageList.value], 'id').sort(
    (a, b) => a.time - b.time
  )

  messageList.value = list.slice()
}

let timer: number | null

// loadMore loading
const loadMoreSpin = ref<'next' | 'prev' | null>(null)
// 是否要滚动到底部/顶部
const scrollToWhere = ref<'top' | 'bottom' | null>('bottom')

const handleWheel = debounce((e: WheelEvent) => {
  if (loadMoreSpin.value) return

  const target = scrollbarRef.value?.wrapRef! as HTMLDivElement
  const scrollTop = target.scrollTop
  const clientHeight = target.clientHeight
  const scrollHeight = target.scrollHeight
  const isScrollPrev = e.deltaY < 0
  const isScrollNext = e.deltaY > 0
  const isTop = scrollTop <= 0
  const isBottom = clientHeight + scrollTop === scrollHeight
  // 上滑清除滚动操作
  if (scrollHeight - (clientHeight + scrollTop) >= 60) {
    scrollToWhere.value = null
  }

  if (isTop && isScrollPrev) {
    loadMorePrev()
    return
  }
  if (isBottom && isScrollNext) {
    if (props.isEnd) return
    loadMoreNext()
  }
}, 200)

function clearLoadMoreTimer() {
  timer && clearTimeout(timer)
  timer = null
}

const MAX_LOAD_MORE_NEW_ERROR_COUNT = 3
let loadMoreNewErrorCount = 0
async function loadMoreNew() {
  try {
    await onLoadMore({ id: '0', type: 'new' })
    loadMoreNewErrorCount = 0
    if (scrollToWhere.value === 'bottom') scrollToBottom()
  } catch (e) {
    loadMoreNewErrorCount++
  } finally {
    if (!props.isEnd && loadMoreNewErrorCount < MAX_LOAD_MORE_NEW_ERROR_COUNT) {
      timer = window.setTimeout(() => {
        loadMoreNew()
      }, props.loopDelay)
    } else {
      clearLoadMoreTimer()
    }
  }
}

async function loadMoreNext() {
  loadMoreSpin.value = 'next'
  scrollToWhere.value = 'bottom'
  await onLoadMore({ id: '0', type: 'next' })
  loadMoreSpin.value = null
  scrollToBottom()
}

// 加载上面
async function loadMorePrev() {
  loadMoreSpin.value = 'prev'
  scrollToWhere.value = 'top'
  if (messageList.value.length) {
    await onLoadMore({ id: messageList.value[0].id, type: 'prev' })
  } else {
    await onLoadMore({ id: '0', type: 'prev' })
  }
  loadMoreSpin.value = null
  scrollbarRef.value?.setScrollTop(0)
  scrollToWhere.value = null
}

function scrollToBottom() {
  const containerRef = scrollbarRef.value?.wrapRef!
  const scrollTopValue = containerRef.scrollHeight - containerRef.offsetHeight
  scrollbarRef.value?.setScrollTop(scrollTopValue)
}

function uploadImageInputOnChange(e: Event) {
  if (props.isEnd) return
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 10 * 1024 * 1024) {
    Message.error(`请选择10M以内文件`)
    return
  }

  const data = new FormData()
  data.append('file', file)
  imageUploadIng.value = true

  props
    .uploadImageRequest(data)
    .then(filepath => {
      handleSend('image', filepath!)
    })
    .finally(() => {
      imageUploadIng.value = false
      if (e.target) (e.target as HTMLInputElement).value = ''
    })
}

function handleUploadImage() {
  uploadImageRef.value?.click()
}

async function handleSend(type: TalkMessageType, message: string) {
  if (props.isEnd) return
  const msg = message.trim()
  if (type === 'text') {
    if (!msg || sendTextIng.value) return
    sendTextIng.value = true
  }
  try {
    await props.sendRequest({ message: msg, type })
    inputValue.value = ''
    scrollToWhere.value = 'bottom'
    clearLoadMoreTimer()
    loadMoreNew()
  } finally {
    if (type === 'text') sendTextIng.value = false
  }
}

watchEffect(async () => {
  if (props.isEnd) {
    clearLoadMoreTimer()
    await loadMoreNew()
    clearLoadMoreTimer()
  } else {
    loadMoreNew()
  }
})

// 判断可视区域
const contentRef = ref<HTMLDivElement>()
const talkMsgItemRef = ref<InstanceType<typeof TalkMsgItem>[]>([])
let observer: IntersectionObserver | null

function clearObserver() {
  observer && observer.disconnect()
  observer = null
}

function observerTalkItem() {
  clearObserver()
  const items = talkMsgItemRef.value
  if (!items.length) return

  observer = new IntersectionObserver(
    entity => {
      const entityList = entity
        .map(v => {
          const dataset = (v.target as HTMLDivElement).dataset
          return {
            id: dataset.id!,
            position: dataset.position!,
            isVisible: v.isIntersecting
          }
        })
        .filter(v => v.isVisible && v.position === 'left')

      const result = messageList.value.filter(
        v => v.status === 'unread' && entityList.some(item => item.id === v.id)
      )
      // 设置已读
      result.length && props.readRequest(result)
    },
    { root: contentRef.value, threshold: 0.75 }
  )

  const child = items.map(v => v.elRef!)
  child.forEach(el => observer!.observe(el))
}

function onWheel() {
  const containerRef = scrollbarRef.value?.wrapRef!
  containerRef.addEventListener('wheel', handleWheel)
}

function onInputKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    if (e.ctrlKey) {
      e.preventDefault()
      handleSend('text', inputValue.value)
    }
  }
}

watchPostEffect(() => {
  observerTalkItem()
})

onMounted(() => {
  onWheel()
  // 绑定上传图片的change事件
  if (uploadImageRef.value)
    uploadImageRef.value.onchange = uploadImageInputOnChange
})

onBeforeUnmount(() => {
  clearLoadMoreTimer()
  clearObserver()
})
</script>

<style lang="less" scoped>
.talk-list {
  display: flex;
  flex-direction: column;
  row-gap: 12px;
}
.talk-box {
  display: flex;
  width: 100%;
  height: 100%;
}

.btn-box {
  display: flex;
  column-gap: 8px;
  align-items: center;
}

.send-btn {
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}

.content-box {
  display: flex;
  flex-direction: column;
  flex: 1;
  .content {
    position: relative;
    display: flex;
    padding: 24px 0;
    flex-direction: column;
    flex: 1;
    flex-basis: 0;
    .load-more-spin {
      position: absolute;
      left: 0;
      width: 100%;
      text-align: center;
      &.next {
        top: auto;
        bottom: 0;
      }
      &.prev {
        top: 0;
        bottom: auto;
      }
    }
  }
}

.talk-input {
  display: flex;
  column-gap: 24px;
  align-items: center;
  padding: 16px 24px;
  height: 80px;
  box-shadow: 0px -4px 20px var(--color-fill-1);
  &.disabled {
    .send-btn {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  .arco-textarea-wrapper {
    flex: 1;
    height: 100%;
    border: none;
  }
  :deep(.arco-textarea) {
    resize: none;
    &::placeholder {
      color: var(--color-text-4);
    }
  }
}

.detail-box {
  border-left: 1px solid var(--color-border-1);
  padding: 16px 24px;
  width: 360px;
  height: 100%;
}

.arco-scrollbar {
  :deep(.arco-scrollbar-track-direction-vertical) {
    right: -28px;
    .arco-scrollbar-thumb-direction-vertical {
      .arco-scrollbar-thumb-bar {
        width: 6px;
      }
    }
  }
}
</style>
