<template>
  <a-drawer
    :width="600"
    title="节点详情"
    :ok-loading="loading"
    v-model:visible="visible"
    unmount-on-close
    destroy-on-close
    :footer="false"
    class="vc-drawer node-details-drawer is-admin"
    @beforeOpen="handleOpen"
  >
    <div class="detail-header">
      <div class="w-[3px] h-[14px] bg-primary"></div>
      基本信息
    </div>
    <a-descriptions bordered :column="1">
      <a-descriptions-item label="名称">
        <span v-table-cell="data.name"></span>
        <a-tag
          v-if="Number(data.status ?? '2') === 1"
          color="green"
          class="up-tag"
          >在线</a-tag
        >
        <a-tag v-else color="gray" class="up-tag">离线</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="程序版本">
        <div class="flex flex-row justify-between">
          <span
            >{{ data.version ?? '-' }}
            <a-tag v-if="data.is_update" color="orange" class="up-tag"
              >有更新</a-tag
            ></span
          >

          <a-button
            v-if="data.is_update"
            type="primary"
            class="update-btn"
            @click="handleUpdate"
            >升级</a-button
          >
        </div>
      </a-descriptions-item>
      <a-descriptions-item label="区域">
        <span v-table-cell="data.region_name"></span>
      </a-descriptions-item>
      <a-descriptions-item label="IP">
        <span v-table-cell="data.address"></span>
      </a-descriptions-item>
      <a-descriptions-item label="CPU">
        <span v-table-cell="data.cpu"></span>
      </a-descriptions-item>
      <a-descriptions-item label="内存">
        <span v-table-cell="data.mem"></span>
      </a-descriptions-item>
      <a-descriptions-item label="磁盘">
        <span v-table-cell="data.disk"></span>
      </a-descriptions-item>
      <a-descriptions-item label="最大并发任务数">
        <span v-table-cell="data.run_number"></span>
      </a-descriptions-item>
      <a-descriptions-item label="更新时间">
        <span v-uts="data.updated_at"></span>
      </a-descriptions-item>
      <a-descriptions-item label="备注">
        <span v-table-cell="data.remark"></span>
      </a-descriptions-item>
    </a-descriptions>

    <div class="detail-header mt-6">
      <div class="w-[3px] h-[14px] bg-primary"></div>
      配置信息
    </div>
    <a-descriptions bordered :column="1">
      <a-descriptions-item label="系统信息">
        <span v-table-cell="data.system_info"></span>
      </a-descriptions-item>
      <a-descriptions-item label="内核信息">
        <span v-table-cell="data.kernel_info"></span>
      </a-descriptions-item>
      <a-descriptions-item label="主板型号">
        <span v-table-cell="data.motherboard_info"></span>
      </a-descriptions-item>
      <a-descriptions-item label="CPU型号">
        <div v-if="parseData(data.cpu_info).length > 0">
          <div
            v-for="item in parseData(data.cpu_info)"
            :key="item.model_name"
            class="detail-content"
          >
            {{ item.model_name + '/' + item.cores + '核' }}
          </div>
        </div>
        <span v-else>-</span>
      </a-descriptions-item>
      <a-descriptions-item label="硬盘大小">
        <div v-if="parseData(data.disk_info).length > 0">
          <div
            v-for="item in parseData(data.disk_info)"
            :key="item.model_name"
            class="detail-content"
          >
            {{ `${item.model} / ${item.size}` }}
          </div>
        </div>
        <span v-else>-</span>
      </a-descriptions-item>
      <a-descriptions-item label="内存大小">
        <div v-if="parseData(data.mem_info).length > 0">
          <div
            v-for="item in parseData(data.mem_info)"
            :key="item.model_name"
            class="detail-content"
          >
            {{ `${item.manufacturer} / ${item.type} / ${item.size}` }}
          </div>
        </div>
        <span v-else>-</span>
      </a-descriptions-item>
      <a-descriptions-item label="网卡型号">
        <div v-if="parseData(data.network_info).length > 0">
          <div
            v-for="item in parseData(data.network_info)"
            :key="item.model_name"
            class="detail-content"
          >
            {{ item.product }}
          </div>
        </div>
        <span v-else>-</span>
      </a-descriptions-item>
    </a-descriptions>
    <upgrade-dialog
      @submit="onReload"
      v-model="updateState.visible"
      :record="updateState.record"
    ></upgrade-dialog>
  </a-drawer>
</template>
<script lang="ts" setup>
import type { NodeItemModel } from '@vca/apis/mts'
import { getMtsNodeInfoDetailApi } from '@vca/apis/mts'

import UpgradeDialog from './UpgradeDialog.vue'

interface IProps {
  modelValue: boolean
  id: string | undefined
}
interface IEmits {
  (event: 'update:modelValue', value: boolean): void
  (event: 'reload'): void
}
const props = withDefaults(defineProps<IProps>(), {})
const emit = defineEmits<IEmits>()

const visible = useVModel(props, 'modelValue', emit)

const loading = ref(false)
const data = ref<NodeItemModel>({})

const updateState = reactive({
  visible: false,
  record: undefined as undefined | NodeItemModel
})
const getDetails = () => {
  getMtsNodeInfoDetailApi({ id: props.id! }).then(res => {
    data.value = res
  })
}

const parseData = computed(() => (value?: string) => {
  if (!value) return []
  const data = JSON.parse(value)
  if (Array.isArray(data)) {
    return data
  }
  return []
})
const handleUpdate = () => {
  updateState.record = data.value
  updateState.visible = true
}
const handleOpen = () => {
  if (props.id) {
    getDetails()
  }
}

const onReload = () => {
  getDetails()
  emit('reload')
}
</script>
<style lang="less" scoped>
.detail-header {
  @apply flex flex-row gap-x-1 items-center bg-fill-2;
  padding: 10px;
  border: 1px solid var(--color-border-1);
}
.arco-descriptions {
  :deep(.arco-descriptions-body) {
    border-radius: 0 0 6px 6px !important;
  }
  :deep(.arco-descriptions-item-label) {
    padding: 14px 16px !important;
    width: 92px;
    max-width: 92px;
    white-space: break-spaces;
    background-color: white !important;
    word-break: break-all;
    word-wrap: break-word;
  }
  :deep(.arco-descriptions-item-value) {
    padding: 14px 16px !important;
  }
}
.update-btn.arco-btn {
  @apply rounded-6px h-24px py-2px px-2 'w-[fit-content]' leading-24px;
}

.up-tag {
  @apply ml-2 py-0! px-1! h-20px! rounded-4px!;
}
</style>
