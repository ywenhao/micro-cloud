<template>
  <div class="safe-root">
    <a-spin :loading="loading" class="h-full w-full">
      <div class="safe-box">
        <div class="safe-item">
          <vc-svg-icon color="#2253E6" :size="48" name="safe-lock" />
          <div class="safe-border">
            <div class="title">
              <div class="text-[var(--color-text-1)]">登录密码</div>
              <div class="help">为了您的账号安全，建议定期修改密码</div>
            </div>
            <i class="flex-1"></i>
            <a-button type="primary" @click="passwordVisible = true"
              >修改</a-button
            >
          </div>
        </div>
        <div class="safe-item">
          <vc-svg-icon :size="48" name="safe-email" />
          <div class="safe-border">
            <div class="title">
              <div class="text-[var(--color-text-1)]">绑定邮箱</div>
              <div v-if="userInfo.email" class="help max-w-[550px]">
                <vc-text-ell :content="usernameMailEll(userInfo.email)" />
              </div>
              <div v-else class="help">暂未绑定邮箱</div>
            </div>
            <i class="flex-1"></i>
            <a-button type="primary" @click="handleOpenEmail">
              {{ userInfo.email ? '修改' : '绑定' }}
            </a-button>
          </div>
        </div>
      </div>
    </a-spin>
    <change-password-dialog v-model="passwordVisible" />
    <change-email-dialog v-model="emailVisible" />
  </div>
</template>

<script setup lang="ts">
import { type ConfModel, queryConfApi } from '@vcp/apis/pedestal'
import { usernameMailEll, VcModal } from 'vc-material'

import ChangeEmailDialog from './components/ChangeEmailDialog.vue'
import ChangePasswordDialog from './components/ChangePasswordDialog.vue'

const appStore = useAppStore()
const userInfo = computed(() => appStore.userInfo!)

const passwordVisible = ref(false)
const emailVisible = ref(false)

const loading = ref(false)

const conf = ref<ConfModel['user_register_conf']>()

async function getConf() {
  try {
    loading.value = true
    const res = await queryConfApi({ type: 1 })
    conf.value = res.user_register_conf
  } finally {
    loading.value = false
  }
}

getConf()

async function handleOpenEmail() {
  if (conf.value?.register_type_list?.includes(2)) {
    emailVisible.value = true
  } else {
    VcModal.confirm({
      title: userInfo.value.email ? '修改邮箱' : '绑定邮箱',
      content: '邮箱功能已关闭，请提交工单或联系客服。',
      okText: '知道了',
      hideCancel: true
    })
  }
}
</script>

<style lang="less" scoped>
.safe-root {
  width: 100%;
  height: 100%;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}
.safe-box {
  border: 1px solid var(--color-border-1);
  border-radius: 6px;
  padding: 24px 32px;
}
.safe-item {
  display: flex;
  gap: 24px;
  padding-bottom: 0;
  .safe-border {
    display: flex;
    width: 100%;
    align-items: center;
  }
  & + .safe-item {
    margin-top: 24px;

    .svg-icon {
      margin-top: 24px;
    }
    .safe-border {
      padding-top: 24px;
      border-top: 1px solid var(--color-border-1);
    }
  }
}

.help {
  margin-top: 4px;
  color: var(--color-text-2);
}
</style>
