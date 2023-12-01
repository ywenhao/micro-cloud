<template>
  <vc-dialog
    title="私钥信息"
    v-model="visible"
    @close="handleClose"
    :on-before-ok="async () => {}"
  >
    <el-form
      v-if="record"
      label-width="92"
      label-position="left"
      label-suffix="："
    >
      <el-form-item label="APP ID" prop="appid">
        <div class="text-[#454954] mb-2">
          <span class="truncate">{{ record.appid }}</span>
          <span v-copy:icon="record.appid"></span>
        </div>
        <span class="text-[#868d9d] text-xs block w-full">
          App ID是开发识别码，可用于调用证书开放服务接口。
        </span>
      </el-form-item>
      <el-form-item prop="secret" label="私钥">
        <div class="text-[#454954] mb-2">
          <span class="truncate">{{ emptyText(record.secret) }}</span>
          <span v-if="record.secret" v-copy:icon="record.secret"></span>
        </div>
        <span class="text-[#868d9d] text-xs block w-full">
          API私钥属于敏感信息，请妥善保管不要泄露。
        </span>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="visible = false">关闭</el-button>
    </template>
  </vc-dialog>
</template>

<script setup lang="ts">
import type { AppKeyModel } from '@vcp/apis/pedestal'
import { emptyText } from 'vc-material'

interface IProps {
  modelValue: boolean
  record?: AppKeyModel
}

interface IEmits {
  (event: 'close'): void
}

const props = defineProps<IProps>()
const emit = defineEmits<IEmits>()

const visible = useVModel(props, 'modelValue')

function handleClose() {
  emit('close')
}
</script>
