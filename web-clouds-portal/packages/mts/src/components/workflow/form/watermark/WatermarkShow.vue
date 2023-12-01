<template>
  <div class="show-box">
    <div class="box" :style="{ width: boxWidth, height: boxHeight }">
      <a-spin :loading="loading" class="w-full h-full">
        <a-image :preview="false" show-loader :src="src">
          <template #loader>
            <a-spin :loading="true" class="w-full h-full">
              <vc-svg-icon prefix="mts" name="watermark-bg" class="bg" />
            </a-spin>
          </template>
          <template #error>
            <vc-svg-icon prefix="mts" name="watermark-bg" class="bg" />
          </template>
        </a-image>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  getMtsPresetPreviewApi,
  type WatermarkPresetModel
} from '@vcp/apis/mts'

import { watermarkSuffixList } from '../../utils/suffix'

const props = withDefaults(
  defineProps<{
    data: WatermarkPresetModel
    width?: number | string
    height?: number | string
  }>(),
  {
    height: 188,
    width: 376
  }
)

const boxWidth = computed(() =>
  typeof props.width === 'string' ? props.width : props.width + 'px'
)
const boxHeight = computed(() =>
  typeof props.height === 'string' ? props.height : props.height + 'px'
)

const src = ref('')

const keys = [
  'type',
  'location',
  'margin_w',
  'margin_h',
  'preview_w',
  'preview_h',
  'image_path',
  'image_adaptive',
  'text_word',
  'text_font',
  'text_font_size',
  'text_font_color',
  'image_bucket_id'
] as const

// 名称 等不监听
const state = ref<WatermarkPresetModel>({})
watchEffect(() => {
  for (const key of keys) {
    if (['margin_w', 'margin_h'].includes(key)) {
      // @ts-ignore
      state.value[key] = props.data[key] || 0
      continue
    }
    if (state.value[key] !== props.data[key]) {
      // @ts-ignore
      state.value[key as keyof typeof props.data] = props.data[key]
    }
  }
})

const loading = ref(false)
watchThrottled(
  state,
  async data => {
    // 重置
    src.value = ''
    const {
      type,
      location,
      margin_w,
      margin_h,
      preview_w,
      preview_h,
      image_path,
      image_bucket_id,
      image_adaptive,
      text_word,
      text_font,
      text_font_size,
      text_font_color
    } = data

    // 图片水印
    const err1 =
      !image_bucket_id ||
      !image_path ||
      (image_path && image_path.split('.').filter(Boolean).length < 2) ||
      (image_path &&
        !watermarkSuffixList.includes(image_path.split('.').pop() || ''))

    // 文字水印
    const err2 = !text_word || !text_font || !text_font_size || !text_font_color

    const err = type === 1 ? err1 : err2
    if (!preview_w || !preview_h || err) return

    const params =
      type === 1
        ? { bucket_id: image_bucket_id, image_path, image_adaptive }
        : { text_word, text_font, text_font_size, text_font_color }
    loading.value = true
    try {
      const { data } = await getMtsPresetPreviewApi({
        // @ts-ignore
        type,
        // @ts-ignore
        location,
        margin_w,
        margin_h,
        preview_w,
        preview_h,
        ...params
      })
      loading.value = false
      getImgWH(data!)
    } finally {
      loading.value = false
    }
  },
  { throttle: 500, deep: true, immediate: true }
)

function getImgWH(path: string) {
  const image = new Image()
  path = `data:png;base64,${path}`
  image.src = path
  loading.value = true
  image.onload = () => {
    src.value = path
    loading.value = false
  }
  image.onerror = () => {
    Message.error('图片加载失败')
    loading.value = false
  }
}
</script>

<style lang="less" scoped>
.show-box {
  width: 100%;
  height: 100%;
  .box {
    position: relative;
    // margin: auto;
    // margin-top: 0;
  }
  .bg {
    width: 100%;
    height: 100%;
  }
}

.arco-image {
  width: inherit;
  height: inherit;
  border-radius: 0;
  :deep(.arco-image-img) {
    width: inherit;
    height: inherit;
  }
}
</style>
