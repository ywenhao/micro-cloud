<template>
  <div class="detail-container">
    <div class="detail-title">{{ title }}</div>
    <div class="detail-time">
      <span>{{ user_id }}</span>
      <a-divider :margin="8" direction="vertical" />

      <span v-uts="time"></span>
      反馈
    </div>
    <div class="detail-content">
      <vc-scrollbar viewClass="break-all pr-3">
        {{ content }}
      </vc-scrollbar>
    </div>
    <div class="detail-images">
      <div class="images-title">附件</div>
      <div class="images-box">
        <template v-if="images.length === 0">-</template>
        <div class="image-item" v-else v-for="item in images" :key="item">
          <vc-image :src="item" />
          <div class="mask">
            <vc-svg-icon name="preview" class="w-20px h-20px" />
          </div>
        </div>
      </div>
    </div>
    <div class="submit-box">
      <div class="product-box">
        <div class="product-title">所属产品</div>
        <div class="product-name">{{ productName }}</div>
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
const props = defineProps<{
  title: string
  time: number
  content: string
  user_id: string
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
  flex-direction: column;
  height: 100%;
  width: 100%;
  .detail {
    &-title {
      font-size: 24px;
      // line-height: 34px;
      // height: 34px;
      white-space: pre-wrap;
      word-break: break-all;
      color: var(--color-text-1);
      font-weight: 500;
    }
    &-time {
      margin-top: 16px;
      color: var(--color-text-2);
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
    }
    &-content {
      flex: 1;
      margin-top: 32px;
      line-height: 20px;
      text-align: justify;
      overflow: hidden;
      color: var(--color-text-1);
    }
    &-images {
      margin-top: 32px;
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
  margin-top: 8px;
  display: flex;
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
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      pointer-events: none;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 2px;
      opacity: 0;
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
  margin-top: 42px;
  width: 100%;
  display: flex;
  background: var(--color-fill-1);
  border-radius: 6px;
  height: 60px;
  justify-content: space-between;
  .submit-btn {
    color: #fff;
    width: 80px;
    font-weight: 400;
    font-size: 14px;
    line-height: 60px;
    border-radius: 0px 6px 6px 0px;
    background: rgb(var(--primary-6));
    text-align: center;
    &:hover {
      background: rgb(var(--primary-5));
    }
    &:active {
      background: rgb(var(--primary-7));
    }
    &[disabled='true'] {
      background: var(--color-fill-2);
      color: var(--color-text-4);
      cursor: not-allowed;
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
    color: var(--color-text-2);
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  }
}
</style>
