import { getAppName } from '@vcp/shared'
import { defineStore } from 'pinia'

const appName = getAppName(true)

export const useAppStore = defineStore(
  `__VCLOUD_ADMIN_${appName}_STORE_APP__`,
  () => {
    return {}
  },
  {
    persist: true
  }
)
