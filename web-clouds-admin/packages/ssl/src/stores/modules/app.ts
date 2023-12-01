import { getAppName } from '@vca/shared'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const appName = getAppName(true)

export const useAppStore = defineStore(
  `__VCLOUD_ADMIN_${appName}_STORE_APP__`,
  () => {
    const token = ref<string | undefined>()
    const isLogined = computed(() => !!token.value)
    return {
      token,
      isLogined
    }
  },
  { persist: true }
)
