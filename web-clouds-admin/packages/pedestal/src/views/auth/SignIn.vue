<template>
  <div class="auth-wrapper">
    <div class="sign-in__wrap" @keyup.enter="handleSubmit">
      <a-form
        size="large"
        ref="formRef"
        :model="formState"
        class="sign-in__form"
      >
        <div class="logo">
          <img
            :src="logoUrl"
            :alt="clientName"
            width="26"
            height="26"
            class="mr-1"
          />
          {{ clientName }}
        </div>
        <h1 class="sign-in__title">欢迎登录{{ clientName }}管理系统</h1>
        <a-form-item hide-label field="username" class="mb-5">
          <a-input
            autofocus
            :max-length="18"
            v-model.trim="formState.username"
            placeholder="请输入账号"
          ></a-input>
        </a-form-item>
        <a-form-item hide-label field="password" class="mb-6" inline-message>
          <a-input-password
            v-model.trim="formState.password"
            :max-length="64"
            placeholder="请输入密码"
          ></a-input-password>
        </a-form-item>
        <a-button
          :loading="loading"
          @click="handleSubmit"
          :disabled="isDisabled"
          type="primary"
          class="h-12! w-full rounded-md"
        >
          登录
        </a-button>
      </a-form>
    </div>
    <!-- <footer class="auto-copyright">
      Copyright &copy; 2022-{{ new Date().getFullYear() }}
      成都蛛思码技科技有限公司
    </footer> -->

    <visual-shield
      ref="visualShieldRef"
      :request="behavioralCaptcha"
      :verify="handleVerify"
    ></visual-shield>
  </div>
</template>

<script setup lang="ts">
import { type FormInstance, Message } from '@arco-design/web-vue'
import {
  type RequestFnOptions,
  type VerifyOptions,
  VisualShield,
  type VisualShieldInstance
} from 'visual-shield'
import { useBehavioralCaptcha } from 'visual-shield'
const visualShieldRef = ref<VisualShieldInstance>()
import {
  getBehavioralCaptchaApi,
  postBehavioralCaptchaVerifyApi
} from '@vca/apis/pedestal'

import Logo from '@/assets/svgs/logo.svg'
const appStore = useAppStore()
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const formRef = ref<FormInstance>()
const { VITE_ACCOUNT, VITE_PASSWORD } = import.meta.env
const formState = reactive({
  username: VITE_ACCOUNT || '',
  password: VITE_PASSWORD || ''
})

const clientName = computed(() => appStore.baseConf?.client_name || APP_TITLE)
const logoUrl = computed(() => appStore.baseConf?.client_logo! || Logo)

const isDisabled = computed<boolean>(
  () =>
    !formState.password ||
    !formState.username ||
    loading.value ||
    appStore.behavioralCaptchaLoading
)

const handleSignIn = () => {
  loading.value = true
  appStore
    .signInAction(formState)
    .then(() => {
      const redirect = route?.query?.redirect as string
      router.replace(redirect ?? { name: 'VcaLayout' })
    })
    .catch(res => {
      loading.value = false
      if (res.code === 12156604) {
        formRef.value?.setFields({
          username: {
            message: res.message,
            status: 'error'
          }
        })
      } else {
        Message.error(res.message)
      }
    })
}

/**
 * useBehavioralCaptcha 辅助验证函数 当验证通过且自动关闭后 触发传入的方法
 *
 * export declare function useBehavioralCaptcha(
 *            instance: Ref<VisualShieldInstance | undefined>,
 *            fn: Function): {
 *     withInterceptor: () => Promise<void>;
 * };
 */
const { withInterceptor } = useBehavioralCaptcha(visualShieldRef, handleSignIn)

const behavioralCaptchaKey = ref('')

// 生成行为验证码
const behavioralCaptcha = ({
  loading,
  onSuccess,
  onError
}: RequestFnOptions) => {
  loading.value = true
  getBehavioralCaptchaApi({
    account: formState.username,
    scene: 4
  })
    .then(res => {
      if (String(res.code).endsWith('6200')) {
        const { image, thumbnail, key } = Object.assign(
          { image: '', thumbnail: '', key: '' },
          res.data
        )
        onSuccess(image, thumbnail)
        behavioralCaptchaKey.value = key
      } else {
        onError(res.message)
      }
    })
    .finally(() => {
      loading.value = false
    })
}

// 验证验证码
const handleVerify = ({ onError, onSuccess, points }: VerifyOptions) => {
  postBehavioralCaptchaVerifyApi({
    account: formState.username,
    key: behavioralCaptchaKey.value,
    scene: 4,
    dots: String(points)
  }).then(res => {
    if (String(res.code).endsWith('6200')) {
      onSuccess()
    } else {
      onError(res.message)
    }
  })
}
const handleSubmit = () => {
  if (isDisabled.value) return
  if (Number(appStore.behavioralCaptchaConf?.manage) === 2) {
    handleSignIn()
  } else {
    withInterceptor()
  }
}

onMounted(() => {
  appStore.getBehavioralCaptchaConf()
})
</script>

<style scoped lang="less">
.auth-wrapper {
  @apply w-full h-full flex justify-end items-stretch;
  background: url('@/assets/bg.jpg') no-repeat center;
  background-size: cover;
  .sign-in__wrap {
    width: 472px;
    background: linear-gradient(
      180deg,
      #ffffff 0%,
      rgba(255, 255, 255, 0.5) 100%
    );
    border: 2px solid #ffffff;
    backdrop-filter: blur(15px);
  }
  .logo {
    @apply flex items-center font-semibold text-lg text-primary;
    line-height: 25px;
  }
  .sign-in__form {
    position: relative;
    top: calc((100% * 0.4) - 320px / 2);
    left: calc((100% - 408px) / 2);
    width: 408px;
    .sign-in__title {
      @apply font-medium text-2xl m-0 mb-16 p-0;
      line-height: 34px;
      color: #1d2129;
    }
    :deep(.arco-input-wrapper) {
      background: transparent !important;
      .arco-input {
        @apply h-12 bg-transparent;
      }
    }
  }
  .auto-copyright {
    @apply font-normal text-xs fixed bottom-6 left-1/2 -translate-x-1/2;
    font-size: 12px;
    line-height: 18px;
    color: #4e5969;
  }
}
</style>
