<template>
  <vc-image
    :preview="preview"
    :width="32"
    :hight="32"
    :class="{ 'cursor-pointer': preview }"
    :src="record?.icon || icons[String(record.symbol)]"
  />
</template>

<script setup lang="ts">
import type { ProductModel } from '@vca/apis/pedestal'

import cdn from '@/assets/cdn.png'
import dns from '@/assets/dns.png'
import mts from '@/assets/mts.png'
import oss from '@/assets/oss.png'
import ssl from '@/assets/ssl.png'
const icons: Record<string, string> = {
  cdn,
  dns,
  mts,
  oss,
  ssl
}
withDefaults(
  defineProps<{
    record: ProductModel
    preview?: boolean
  }>(),
  { preview: true }
)
</script>
