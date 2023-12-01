<template>
  <a-modal
    :width="600"
    :title="mode === 'private' ? '服务器内网IP' : '服务器公网IP'"
    v-model:visible="visible"
    ok-text="关闭"
    :ok-button-props="{
      type: 'secondary'
    }"
    hide-cancel
    title-align="start"
    modal-class="vc-dialog form-dialog"
  >
    <a-table
      :hoverable="false"
      :bordered="false"
      class="vc-table w-full mb-6"
      :data="mode === 'private' ? privateIps : publicIps"
      :pagination="false"
      :columns="columns('private')"
    >
      <template #actions="{ record }">
        <a-link
          :disabled="isDisabled(record)"
          :hoverable="false"
          @click="handleAdd(record)"
        >
          <span :class="{ 'text-primary-4!': isDisabled(record) }">
            {{ isDisabled(record) ? '已添加' : '添加' }}
          </span>
        </a-link>
      </template>
    </a-table>
  </a-modal>
</template>

<script setup lang="ts">
import type { NodeEditIPModal } from '@vca/apis/cdn'

import { useComputed } from './hooks/useComputed'

const visible = defineModel<boolean>({ required: true })
const mode = defineModel<string>('mode', { required: true })
const publicIps = defineModel<NodeEditIPModal>('publicIps')
const privateIps = defineModel<NodeEditIPModal>('privateIps')
const usedPublicIps = defineModel<NodeEditIPModal>('usedPublicIps')
const usedPrivateIps = defineModel<NodeEditIPModal>('usedPrivateIps')

const { columns } = useComputed()
const isDisabled = computed(() => (record: any) => {
  const publicIndex = usedPublicIps.value?.findIndex(
    item => item!.ip === record!.ip
  )
  const prviateIndex = usedPrivateIps.value?.findIndex(
    item => item.ip === record.ip
  )
  return publicIndex !== -1 || prviateIndex !== -1
})
const handleAdd = ({ name, ip }: { name: string; ip: string }) => {
  const item = { name, ip }
  console.log(item)
  if (mode.value === 'private') {
    usedPrivateIps.value!.push(item)
    return
  }
  usedPublicIps.value!.push(item)
}
</script>
