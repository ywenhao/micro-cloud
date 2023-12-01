<template>
  <a-drawer
    title="消息详情"
    width="600px"
    class="message-detail-drawer"
    v-model:visible="visible"
    :footer="false"
  >
    <a-empty v-if="isEmpty" />
    <a-spin v-else :loading="loading" class="h-full w-full">
      <div class="title">{{ emptyText(detail.title) }}</div>
      <div class="time">{{ formatUnix(+detail.release_time!) }} 发布</div>
      <div class="content" v-if="detail.content">
        <editor
          :model-value="detail.content"
          :default-config="{ readOnly: true }"
        />
      </div>
    </a-spin>
  </a-drawer>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'
import 'vc-material/theme-chalk/src/rich-text-editor.less'

import {
  type MessageSysModel,
  queryMessageSysInfoApi,
  updateMessageSysApi
} from '@vcp/apis/pedestal'
import { Editor } from '@wangeditor/editor-for-vue'
import { emptyText, formatUnix } from 'vc-material'

const props = defineProps<{
  id: string
  typeId: string | undefined
  modelValue: boolean
}>()

const emit = defineEmits<{
  refresh: []
}>()

const visible = useVModel(props, 'modelValue')

const loading = ref(false)
const isEmpty = ref(false)

const initialState: MessageSysModel = {
  title: '',
  release_time: '',
  content: ''
}
const detail = ref<MessageSysModel>({ ...initialState })

const getDetail = async () => {
  loading.value = true
  isEmpty.value = false
  try {
    detail.value = await queryMessageSysInfoApi({ message_id: props.id })
    setTimeout(() => {
      updateMessageSysApi({
        // @ts-ignore
        type_id: props.typeId || void 0,
        status: 1,
        message_id_list: [props.id]
      }).then(() => {
        emit('refresh')
      })
    }, 0)
  } catch (e) {
    isEmpty.value = true
  } finally {
    loading.value = false
  }
}

watch(visible, val => {
  val && props.id && getDetail()
  if (!val) detail.value = { ...initialState }
})
</script>

<style lang="less" scoped>
.message-detail-drawer {
  .title {
    font-weight: 500;
    font-size: 28px;
    color: var(--color-text-1);
    line-height: 38px;
    word-break: break-all;
  }
  .time {
    margin-top: 16px;
    font-weight: 400;
    font-size: 14px;
    color: var(--color-text-3);
  }
  .content {
    margin-top: 32px;
    // font-weight: 400;
    // line-height: 22px;
    // font-size: 14px;
    // color: var(--color-text-1);
    :deep([role='textarea']) {
      padding: 0;
    }
  }
}
</style>
