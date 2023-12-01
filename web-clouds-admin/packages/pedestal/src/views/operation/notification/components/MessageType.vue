<script setup lang="tsx">
import {
  Message,
  type TableChangeExtra,
  type TableColumnData,
  type TableData
} from '@arco-design/web-vue'
import {
  IconClose,
  IconDragDotVertical,
  IconPlus
} from '@arco-design/web-vue/es/icon'
import { messageTypeBachApi, type MessageTypeModel } from '@vca/apis/pedestal'
import { cloneDeep } from 'lodash-es'
const props = defineProps<{
  types: MessageTypeModel[]
}>()
const emit = defineEmits(['cancel', 'reload'])
import { generateUUID } from 'vc-material'
const loading = ref(false)
const columns: TableColumnData[] = [
  {
    dataIndex: 'content',
    title: '消息类型',
    slotName: 'content',
    titleSlotName: 'content-title'
  }
]

const dataSource = ref<MessageTypeModel[]>([])
const dataSourceBackUp = ref<MessageTypeModel[]>([])

watch(
  () => props.types,
  v => {
    dataSource.value = (v ?? []).map(
      item =>
        ({
          ...item,
          key: item.id
        } as MessageTypeModel)
    )
    dataSourceBackUp.value = cloneDeep(dataSource.value)
  },
  {
    deep: true,
    immediate: true
  }
)

/** 事件处理 */
type ICommand = 'ok' | 'cancel' | 'add' | 'remove'
const handleCommand = (command: ICommand, index?: number) => {
  const actions: Record<ICommand, () => void> = {
    cancel() {
      emit('cancel')
      dataSource.value = cloneDeep(dataSourceBackUp.value)
    },
    add() {
      if (dataSource.value.length < 10) {
        dataSource.value.push({
          key: generateUUID(),
          type_name: ''
        })
      } else {
        Message.clear()
        Message.error('最多只能添加10个消息类型')
      }
    },
    remove() {
      dataSource.value.splice(index as number, 1)
    },
    ok() {
      const predicate = (item: MessageTypeModel) => {
        return item.type_name?.trim() && String(item?.default) !== String(1)
      }
      const beans = dataSource.value
        .filter(predicate)
        .map(({ id, type_name }, i) => ({ id, type_name, index: i + 2 }))
      loading.value = true
      messageTypeBachApi({
        beans: beans as {
          id: string
          type_name: string
          index: number
        }[]
      })
        .then(() => {
          // getMessageTypes()
          emit('reload')
        })
        .finally(() => {
          loading.value = false
        })
    }
  }
  actions[command]()
}

/** 表格切换事件 */
const handleTableChange = (data: TableData[], extra: TableChangeExtra) => {
  if (extra.type === 'drag') {
    const newIndex = data.findIndex(item => String(item?.default) === String(1))
    // 第一项为 系统默认类型
    if (newIndex === 0) {
      dataSource.value = cloneDeep(data) as MessageTypeModel[]
    }
  }
}
// onMounted(() => {
//   getMessageTypes()
// })
</script>

<template>
  <a-table
    class="message-type__table"
    :loading="loading"
    :columns="columns"
    column-resizable
    size="small"
    @change="handleTableChange"
    :data="dataSource"
    :draggable="{}"
    :bordered="false"
    :pagination="false"
  >
    <template #content="{ record, rowIndex }">
      <div class="flex items-center gap-x-2">
        <icon-drag-dot-vertical
          :size="18"
          :class="{ 'opacity-25 cursor-not-allowed': record.default == 1 }"
        />
        <a-form-item field="table" class="m-0!" hide-label>
          <a-input
            :disabled="record.default == 1"
            placeholder="请输入类型"
            :max-length="20"
            v-model="record.type_name"
          ></a-input>
        </a-form-item>
        <icon-close
          :class="{ 'opacity-25 cursor-not-allowed': record.default == 1 }"
          class="cursor-pointer"
          @click="
            record.default == 1 ? () => {} : handleCommand('remove', rowIndex)
          "
        />
      </div>
    </template>
    <template #content-title>
      <a-link
        class="font-normal"
        :hoverable="false"
        @click="handleCommand('add')"
      >
        <icon-plus />
        添加新类型
      </a-link>
    </template>
    <template #footer>
      <div class="flex items-center justify-end gap-x-2">
        <a-button @click="handleCommand('cancel')">取消</a-button>
        <a-button @click="handleCommand('ok')" type="primary">确定</a-button>
      </div>
    </template>
  </a-table>
</template>

<style lang="less" scoped>
.message-type__table {
  width: 224px;
  :deep(.arco-table-container) {
    .arco-table-th {
      background-color: #fff !important;
    }
    .arco-table-td {
      border-bottom: 0;
    }
    .arco-table-cell {
      padding: 4px 8px !important;
    }
  }
  :deep(.arco-table-footer) {
    padding-right: 0;
    padding-left: 0;
  }
}
</style>
