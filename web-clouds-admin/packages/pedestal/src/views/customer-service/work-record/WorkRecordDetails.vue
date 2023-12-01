<template>
  <vc-container
    admin
    class="order-talk-container"
    header-bordered
    page-title="工单详情"
    :back="() => router.push({ name: 'WorkRecord' })"
  >
    <a-spin :loading="loading" class="w-full h-full overflow-hidden">
      <talk-view
        :is-end="talkDetailState.submitBtnDisabled"
        :loadMore="loadMore"
        :send-request="sendRequest"
        :read-request="readRequest"
      >
        <talk-detail v-bind="talkDetailState" @submit="handleEnd" />
      </talk-view>
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
  updateWorkerOrderEndApi
} from '@vca/apis/pedestal'
import { VcModal } from 'vc-material'

import TalkDetail from './talk/TalkDetail.vue'
import type {
  TalkLoadMoreParams,
  TalkMessageItem,
  TalkSendParams
} from './talk/TalkView.vue'
import TalkView from './talk/TalkView.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const talkDetailState = reactive({
  title: '',
  content: '',
  user_id: '',
  time: 0,
  productName: '',
  images: [] as string[],
  submitBtnDisabled: true
})

onMounted(() => {
  if (!id) {
    Message.error('缺少工单id')
    return
  }
  getDetail()
})

const loading = ref(false)

async function getDetail() {
  try {
    loading.value = true
    const res = await queryWorkerOrderDetailApi({ id })
    const {
      title,
      picture_path,
      create_time,
      describe,
      product_name,
      user_id
    } = res
    talkDetailState.title = title!
    talkDetailState.user_id = user_id!
    talkDetailState.content = describe!
    talkDetailState.productName = product_name!
    talkDetailState.time = +create_time!
    const images = picture_path?.split(',') || []
    talkDetailState.images = images.filter(item => item)
    talkDetailState.submitBtnDisabled = res.state === 2
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
          position: item.user_role === 2 ? 'right' : 'left',
          messageType: item.message_type === 1 ? 'text' : 'image'
        } as TalkMessageItem)
    ) || []
  return list
}

// 设置已读
async function readRequest(params: TalkMessageItem[]) {
  if (!params.length) return
  readWorkerOrderMessageApi({
    worker_order_id: id,
    message_id: params.map(v => v.id)
  })
}

function handleEnd() {
  const request = () =>
    updateWorkerOrderEndApi({ id: [id] }).then(() => {
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
</script>

<style lang="less" scoped>
.vc-container.order-talk-container {
  overflow: hidden;
  padding: 0;
  height: 100%;
  :deep(.vc-container__header) {
    position: relative;
    padding-right: 24px;
    padding-left: 24px;
    margin-bottom: 0;
    border: none;
    &::after {
      position: absolute;
      bottom: 0;
      left: 24px;
      display: block;
      width: calc(100% - 48px);
      height: 1px;
      background-color: #f2f3f5;
      content: '';
    }
  }
  :deep(.vc-container__content) {
    @apply pt-0 flex flex-1 overflow-hidden;
    padding-top: 0;
    margin-bottom: 0 !important;
  }
}
</style>
