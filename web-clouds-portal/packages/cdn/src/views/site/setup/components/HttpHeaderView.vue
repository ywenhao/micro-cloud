<template>
  <div class="http-header-view">
    <div class="top flex items-center px-4 h-10 text-[#868D9D] bg-fill-2">
      <div class="w-[200px]">设置</div>
      <div class="w-[128px] pl-2">标头名称</div>
      <div class="w-[400px] pl-2 flex-1">值</div>
      <div class="w-12 pl-2">操作</div>
    </div>
    <template v-for="(item, index) in list" :key="item.uuid">
      <http-header
        ref="httpHeaderRefs"
        :disable-delete="headers.length === 1"
        :header="item"
        @delete="handleDelete(index)"
      ></http-header>
    </template>
    <a-button class="add" type="outline" @click="addHeaderRule">
      <icon-plus />
      <span>添加</span>
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { IconPlus } from '@arco-design/web-vue/es/icon'
import { omit } from 'lodash-es'
import { v4 as uuidV4 } from 'uuid'

import HttpHeader from './HttpHeader.vue'
interface HeaderRule {
  uuid: string
  action: number | undefined
  name: string
  value: string
}

interface IEmit {
  (event: 'update:headers', value: HeaderRule[]): void
}

interface IProps {
  headers: HeaderRule[]
}

const emit = defineEmits<IEmit>()
const props = defineProps<IProps>()

const httpHeaderRefs = ref()

const list = useVModel(props, 'headers', emit)

// 添加新增规则
function addHeaderRule() {
  list.value.push({ uuid: uuidV4(), action: undefined, name: '', value: '' })
}

// 处理删除
function handleDelete(index: number) {
  list.value.splice(index, 1)
}

// 生成规则
const generate = () => {
  return list.value.map(item => {
    return omit(item, ['uuid'])
  })
}

// 重置
function reset() {
  list.value = [{ uuid: uuidV4(), action: undefined, name: '', value: '' }]
}

async function validate() {
  for (const item of httpHeaderRefs.value) {
    await item.validate()
  }
}

defineExpose({ generate, reset, validate })
</script>

<style scoped lang="less">
.http-header-view {
  padding-bottom: 16px;
  border-radius: 10px;
  @apply border border-solid border-color-2 mb-8;
}
.add {
  @apply border-primary! color-primary! text-[14px] ml-4  rounded-[4px] flex items-center justify-center  cursor-pointer;
  span {
    @apply ml-2;
  }
}
</style>
