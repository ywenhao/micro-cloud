<template>
  <vc-dialog
    title="加入分组"
    :loading="loading"
    v-model="visible"
    :confirm-button-disabled="!modelValue"
    :on-before-ok="handleSubmit"
    modal-class="form-dialog"
    :ok-btn-disabled="!groupId"
  >
    <a-form :model="{}" layout="vertical">
      <a-form-item label="选择分组" hide-asterisk>
        <a-select
          v-model="groupId"
          placeholder="请选择"
          class="w-full"
          :loading="groupLoading"
          :triggerProps="{ autoFitPopupMinWidth: true }"
        >
          <a-option
            v-for="item in opts"
            :key="item.value"
            :label="item.label"
            :value="item.value!"
          />
        </a-select>
      </a-form-item>
    </a-form>
  </vc-dialog>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  domainGroupAddBatchApi,
  domainGroupListApi,
  type DomainModel
} from '@vcp/apis/dns'
import { useSelectRemote } from 'vc-material'

interface IProps {
  modelValue: boolean
  rows: DomainModel[]
}

interface IEmits {
  (event: 'submit'): void
  (event: 'update:modelValue', value: string): void
}

const props = defineProps<IProps>()
const emit = defineEmits<IEmits>()
const visible = useVModel(props, 'modelValue')

const loading = ref(false)
const groupId = ref('')
const {
  loading: groupLoading,
  remoteMethod,
  opts
} = useSelectRemote(domainGroupListApi, {
  labelKey: 'name',
  valueKey: 'id',
  immediate: false
})

async function handleSubmit() {
  try {
    loading.value = true
    await domainGroupAddBatchApi({
      id: groupId.value,
      domain_ids: props.rows.map(item => item.id!),
      ids: void 0
    })
    Message.success('加入成功')
    emit('submit')
  } finally {
    loading.value = false
  }
}

watchEffect(() => {
  if (!visible.value) {
    opts.value = []
    groupId.value = ''
  } else {
    remoteMethod()
  }
})
</script>
