<template>
  <div class="flex items-center">
    {{ modelValue ?? 0 }}
    <a-popover
      position="bottom"
      trigger="click"
      v-model:popup-visible="popupVisible"
      @popup-visible-change="handleVisibilityChange"
    >
      <vc-svg-icon
        :size="16"
        name="detail"
        prefix="cdn"
        class="ml-1 cursor-pointer cell-hide"
        :class="{ 'visible!': popupVisible }"
        v-if="modelValue > 0"
      />
      <template #content>
        <vc-scrollbar class="max-h-200px! overflow-y-auto! -mx-4!">
          <p class="px-4 py-1 m-0" v-for="item in user_id_list" :key="item">
            {{ item }}
          </p>
        </vc-scrollbar>
      </template>
    </a-popover>
  </div>
</template>

<script setup lang="ts">
import { getCdnPortsUsersByIdApi } from '@vca/apis/cdn'

const modelValue = defineModel<number>({ required: true })
const props = defineProps({
  recordId: String
})
const popupVisible = ref(false)
const loading = ref(false)
const user_id_list = ref<string[]>([])

const handleVisibilityChange = (v: boolean) => {
  if (!v) return
  loading.value = true
  getCdnPortsUsersByIdApi({ id: props.recordId! })
    .then(res => {
      user_id_list.value = res.user_id_list ?? []
    })
    .finally(() => {
      loading.value = false
    })
}
</script>
