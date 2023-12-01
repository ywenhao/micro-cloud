<template>
  <a-dropdown
    trigger="hover"
    class="header-dropdown"
    @select="value => handleSelect(value as string)"
    position="br"
  >
    <vc-svg-icon :size="24" class="cursor-pointer" name="default-avatar" />
    <template #content>
      <div class="user-item">
        <vc-svg-icon class="avatar-icon" :size="32" name="default-avatar" />
        <div class="username flex-1 truncate">
          {{ username }}
        </div>
      </div>
      <div class="border-item"></div>
      <a-doption value="center">
        <vc-svg-icon name="user-user" :size="16" />
        <div class="label">个人中心</div>
      </a-doption>
      <!-- <a-doption value="log">登录记录</a-doption> -->
      <a-doption value="safe">
        <vc-svg-icon name="user-safe" :size="16" />
        <div class="label">安全设置</div>
      </a-doption>
      <a-doption value="logout">
        <vc-svg-icon name="user-off" :size="16" />
        <div class="label">退出登录</div>
      </a-doption>
    </template>
  </a-dropdown>
  <!-- <login-log v-model="logVisible" /> -->
</template>

<script setup lang="ts">
import { ssoLogoutApi } from '@vcp/apis/pedestal'
import { usernameMailEll, VcModal } from 'vc-material'

const router = useRouter()
const appStore = useAppStore()

const username = computed(() =>
  usernameMailEll(appStore.userInfo.username || appStore.userInfo.email || '-')
)

// const logVisible = ref(false)

function handleSelect(value: string) {
  if (value === 'center') return router.push('/center')
  // if (value === 'log') return (logVisible.value = true)
  if (value === 'safe') return router.push('/center/safe')
  if (value === 'logout') {
    const request = () => ssoLogoutApi({}).finally(() => appStore.signOut())
    VcModal.confirm(
      { title: '确认退出登录', content: '确定要退出登录吗？' },
      request
    )
  }
}
</script>

<style lang="less">
.header-dropdown {
  .arco-dropdown {
    padding: 0;
    border-radius: 6px;
    box-shadow: 0px 4px 10px rgba(29, 33, 41, 0.1);
    border-color: var(--color-border-1);
  }
  .user-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    .avatar-icon {
      filter: drop-shadow(0px 2px 10px #dadde6);
    }
    .username {
      margin-left: 10px;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: var(--color-text-1);
    }
  }
  .border-item {
    width: ;
    height: 1px;
    margin: 8px 12px;
    background-color: var(--color-border-1);
  }
  .arco-trigger-content {
    width: 200px;
    // margin-top: 20px;
  }
  .arco-dropdown-list {
    padding: 8px;
    padding-bottom: 12px;
    .arco-dropdown-option {
      padding: 10px 12px;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      @apply rounded-4px py8px cursor-pointer;

      &:hover {
        background: var(--color-fill-2);
      }
      .arco-dropdown-option-content {
        display: flex;
        align-items: center;
        .label {
          margin-left: 8px;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          color: var(--color-text-1);
        }
      }
    }
  }
}
</style>
