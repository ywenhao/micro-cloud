<template>
  <vc-container page-title="消息通知" class="has-tabs-table">
    <a-tabs v-model:active-key="active">
      <a-tab-pane title="全部消息" key="全部消息">
        <message-item v-if="isAll" />
      </a-tab-pane>
      <a-tab-pane
        :title="item.type_name"
        v-for="item in typeList"
        :key="item.id!"
      >
        <message-item v-if="typeId === item.id" />
      </a-tab-pane>
    </a-tabs>
  </vc-container>
</template>

<script setup lang="ts">
import {
  type MessageSysTypeModel,
  queryMessageSysTypeApi
} from '@vcp/apis/pedestal'
import { ref } from 'vue'

import MessageItem from './inform/MessageItem.vue'

type IActive = '全部消息' | string
const active = ref<IActive>('全部消息')

const isAll = computed(() => active.value === '全部消息')

const typeList = ref<MessageSysTypeModel[]>([])

queryMessageSysTypeApi().then(res => {
  typeList.value = res.list || []
})

const typeId = computed(() => {
  if (isAll.value) return undefined
  return typeList.value.find(item => item.id === active.value)?.id!
})

provide('isAll', isAll)
provide('typeId', typeId)
</script>
