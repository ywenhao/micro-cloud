<template>
  <a-dropdown
    position="br"
    class="vc-dropdown"
    trigger="hover"
    @select="handleCommand"
  >
    <vc-svg-icon
      class="cursor-pointer"
      :size="24"
      name="default-avatar"
    ></vc-svg-icon>

    <template #content>
      <div class="flex items-center w-[184px] h-12 px-3 gap-x-2.5">
        <vc-svg-icon :size="32" name="default-avatar"></vc-svg-icon>
        <span class="flex-1 truncate">{{ userName }}</span>
      </div>
      <a-divider :margin="8" />
      <a-doption value="record">
        <template #icon>
          <icon-schedule :size="16" class="text-[#869090]!" />
        </template>
        登录记录
      </a-doption>
      <a-doption value="updatePassword">
        <template #icon>
          <icon-lock :size="16" class="text-[#869090]!" />
        </template>
        修改密码
      </a-doption>
      <a-doption value="signOut">
        <template #icon>
          <icon-poweroff :size="16" class="text-[#869090]!" />
        </template>
        退出登录
      </a-doption>
    </template>
  </a-dropdown>
  <admin-login-record v-model="recordVisible" />
  <update-password v-model="updatePasswordVisible" />
</template>

<script setup lang="ts">
import {
  IconLock,
  IconPoweroff,
  IconSchedule
} from '@arco-design/web-vue/es/icon'
import { has } from 'lodash-es'
import { VcModal } from 'vc-material'

import AdminLoginRecord from '../AdminLoginRecord.vue'
import UpdatePassword from '../UpdatePassword.vue'
const appStore = useAppStore()
const recordVisible = ref(false)
const updatePasswordVisible = ref(false)

const userName = computed(() => appStore.userInfo?.username || '')
const handleCommand = (
  command: string | number | Record<string, any> | undefined
) => {
  const actions: Record<string, () => void> = {
    record() {
      recordVisible.value = true
    },
    updatePassword() {
      updatePasswordVisible.value = true
    },
    signOut() {
      VcModal.confirm({
        title: '确认退出登录',
        content: '确定要退出登录吗?',
        onOk() {
          appStore.clearLoginInfo()
        }
      })
    }
  }
  if (has(actions, String(command))) {
    actions[String(command)]()
  }
}
</script>
