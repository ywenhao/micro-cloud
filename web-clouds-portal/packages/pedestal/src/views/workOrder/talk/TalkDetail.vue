<template>
  <div class="detail-container">
    <div class="detail-title">{{ title }}</div>
    <div class="detail-time">{{ formatUnix(time) }} 反馈</div>
    <div class="detail-content">
      <vc-scrollbar class="flex-1 basis-0">{{ content }}</vc-scrollbar>
    </div>
    <div class="detail-images">
      <div class="images-title">附件</div>
      <div class="images-box">
        <template v-if="!images.length">-</template>
        <div class="image-item" v-for="item in images" :key="item">
          <a-image :src="item">
            <template #error>
              <vc-svg-icon class="w-full h-full" name="image_error" />
            </template>
          </a-image>
          <div class="mask">
            <vc-svg-icon name="preview" class="w-20px h-20px" />
          </div>
        </div>
      </div>
    </div>
    <div class="submit-box">
      <div class="product-box">
        <div class="product-title">所属产品</div>
        <div class="product-name">
          <vc-text-ell>{{ productName }}</vc-text-ell>
        </div>
      </div>
      <div
        class="submit-btn"
        role="button"
        :disabled="submitBtnDisabled"
        @click="handleSubmit"
      >
        {{ submitBtnDisabled ? '已结单' : '结单' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatUnix } from 'vc-material'

const props = defineProps<{
  title: string
  time: number
  content: string
  images: string[]
  productName: string
  submitBtnDisabled?: boolean
}>()

const emit = defineEmits<{
  submit: []
}>()

const handleSubmit = async () => {
  if (props.submitBtnDisabled) return
  emit('submit')
}
</script>

<style lang="less" scoped>
.detail-container {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  .detail {
    &-title {
      font-size: 24px;
      line-height: 34px;
      // height: 34px;
      white-space: pre-wrap;
      word-break: break-all;
      color: var(--color-text-1);
      font-weight: 500;
    }
    &-time {
      margin-top: 8px;
      font-size: 14px;
      color: var(--color-text-3);
      font-weight: 400;
      line-height: 20px;
    }
    &-content {
      display: flex;
      margin-top: 24px;
      margin-right: -10px;
      text-align: justify;
      white-space: pre-wrap;
      color: var(--color-text-1);
      flex: 1;
      flex-direction: column;
      line-height: 20px;
      word-break: break-all;
      :deep(.vc-scrollbar__view) {
        padding-right: 10px;
      }
    }
    &-images {
      margin-top: 24px;
      user-select: none;
      .images-title {
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        color: var(--color-text-2);
      }
    }
  }
}
.images-box {
  display: flex;
  margin-top: 8px;
  flex-wrap: wrap;
  gap: 6px;
  .image-item,
  .arco-image,
  :deep(.arco-image-img) {
    width: 46px;
    height: 46px;
    border-radius: 2px;
  }
  .image-item {
    cursor: pointer;
    position: relative;
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 2px;
      opacity: 0;
      pointer-events: none;
    }
    &:hover {
      .mask {
        opacity: 1;
      }
    }
  }
  :deep(.arco-image-img) {
    object-fit: cover;
  }
}

.submit-box {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  width: 100%;
  height: 60px;
  background: var(--color-fill-1);
  border-radius: 6px;
  .submit-btn {
    width: 80px;
    font-size: 14px;
    color: #fff;
    background: rgb(var(--primary-6));
    border-radius: 0px 6px 6px 0px;
    font-weight: 400;
    line-height: 60px;
    &:hover {
      background: rgb(var(--primary-5));
    }
    &:active {
      background: rgb(var(--primary-7));
    }
    &[disabled='true'] {
      color: var(--color-text-4);
      background: var(--color-fill-2);
    }
  }

  .product-box {
    padding-top: 8px;
    padding-left: 16px;
  }
  .product-title {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: var(--color-text-2);
  }
  .product-name {
    margin-top: 4px;
    font-size: 14px;
    color: var(--color-text-2);
    font-weight: 400;
    line-height: 20px;
  }
}
</style>
