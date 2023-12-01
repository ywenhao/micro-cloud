<template>
  <vc-container
    class="order-talk-container"
    page-title="工单详情"
    :back="() => router.push({ name: 'WorkOrderMy' })"
  >
    <a-spin :loading="loading" class="w-full h-full">
      <vc-talk
        :is-end="talkDetailState.submitBtnDisabled"
        :loadMore="loadMore"
        :upload-image-request="uploadImageRequest"
        :send-request="sendRequest"
        :read-request="readRequest"
        :loop-delay="LOOP_DELAY"
      >
        <talk-detail v-bind="talkDetailState" @submit="handleEnd" />
      </vc-talk>
    </a-spin>
  </vc-container>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  queryWorkerOrderDetailApi,
  queryWorkerOrderMessageListApi,
  readWorkerOrderMessageApi,
  sendWorkerOrderMessageApi,
  updateWorkerOrderEndApi,
  uploadApi
} from '@vcp/apis/pedestal'
import type {
  TalkLoadMoreParams,
  TalkMessageItem,
  TalkSendParams
} from '@vcp/shared'
import { VcModal } from 'vc-material'

import { SET_HEADER_RIGHT_COUNT } from '@/constants'

import TalkDetail from './talk/TalkDetail.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

// 3s轮询一次
const LOOP_DELAY = 3000

const setHeaderRightCount = inject(SET_HEADER_RIGHT_COUNT)

const talkDetailState = reactive({
  title: '',
  content: '',
  time: 0,
  productName: '',
  images: [] as string[],
  submitBtnDisabled: true
})

let timer: number | null = null
async function getDetailLoop() {
  if (talkDetailState.submitBtnDisabled) {
    timer && clearTimeout(timer)
    return
  }
  await fetchDetail()
  timer = window.setTimeout(getDetailLoop, LOOP_DELAY)
}

const loading = ref(false)

async function fetchDetail() {
  const res = await queryWorkerOrderDetailApi({ id })
  const { title, picture_path, create_time, describe, product_name } = res
  talkDetailState.title = title!
  talkDetailState.content = describe!
  talkDetailState.productName = product_name!
  talkDetailState.time = +create_time!
  const images = picture_path?.split(',') || []
  talkDetailState.images = images.filter(Boolean).map(v => mergeBaseURL(v))
  talkDetailState.submitBtnDisabled = res.state === 2
}
async function uploadImageRequest(data: FormData) {
  const { filepath } = await uploadApi(data)
  return filepath!
}

async function getDetail() {
  try {
    loading.value = true
    await fetchDetail()
  } finally {
    loading.value = false
  }
}

async function sendRequest({ message, type }: TalkSendParams) {
  await sendWorkerOrderMessageApi({
    message,
    worker_order_id: id,
    message_type: type === 'text' ? 1 : 2
  })
}

async function loadMore({ id: uid, type }: TalkLoadMoreParams) {
  const compare_mode = type === 'prev' ? 2 : 1
  const res = await queryWorkerOrderMessageListApi({
    worker_order_id: id,
    id: uid,
    limit: 10,
    compare_mode
  })

  const list =
    (res.list || []).map(
      item =>
        ({
          id: item.id,
          time: item.create_time,
          message: item.message,
          status: item.read_status === 1 ? 'read' : 'unread',
          position: item.user_role === 1 ? 'right' : 'left',
          messageType: item.message_type === 1 ? 'text' : 'image'
        } as TalkMessageItem)
    ) || []
  return list
}

// 设置已读
async function readRequest(params: TalkMessageItem[]) {
  if (!params.length) return
  await readWorkerOrderMessageApi({
    worker_order_id: id,
    message_id: params.map(v => v.id)
  })

  setHeaderRightCount?.()
}

function handleEnd() {
  const request = () =>
    updateWorkerOrderEndApi({ id: [id] }).then(() => {
      Message.success('操作成功')
      getDetail()
    })

  VcModal.confirm(
    {
      title: '结单',
      content:
        '结单即表示工单反馈的问题已解决，工单将变为只读状态，确定要结单吗？'
    },
    request
  )
}

onMounted(async () => {
  if (!id) {
    Message.error('缺少工单id')
    return
  }
  await getDetail()
  getDetailLoop()
})

onBeforeUnmount(() => {
  timer && clearTimeout(timer)
  timer = null
})
</script>

<style lang="less" scoped>
.vc-container.order-talk-container {
  padding: 0;
  flex: 1;
  :deep(.vc-container__header) {
    position: relative;
    padding: 16px 24px;
    margin-bottom: 0;
    border: none;
    &::after {
      position: absolute;
      bottom: 0;
      left: 24px;
      display: block;
      width: calc(100% - 48px);
      height: 1px;
      background-color: var(--color-fill-2);
      content: '';
    }
  }
  :deep(.vc-container__content) {
    padding-top: 0;
    padding-bottom: 0;
    flex: 1;
    flex-basis: 0;
  }
}
</style>
