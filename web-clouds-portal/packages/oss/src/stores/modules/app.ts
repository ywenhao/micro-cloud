import { getAppName } from '@vcp/shared'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { GET_REGION_DATA_LIST } from '@/components/SelectData'

const appName = getAppName(true)

export const useAppStore = defineStore(
  `__VCLOUD__${appName}__STORE_APP__`,
  () => {
    const token = ref<string | undefined>()
    const isLogined = computed(() => !!token.value)

    return {
      token,
      isLogined,
      GET_REGION_DATA_LIST
    }
  },
  { persist: true }
)
