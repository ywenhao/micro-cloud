<template>
  <div class="region-box">
    <div class="prefix">区域：</div>
    <a-spin :loading="loading" class="inline!">
      <div v-if="noList || isOnlyOne" class="region-text">{{ label }}</div>
      <a-popover
        position="bottom"
        v-else
        :arrow-style="{ display: 'none' }"
        :content-style="{ padding: 0 }"
      >
        <div class="flex items-center cursor-pointer">
          <div class="region-active">
            {{ label }}
          </div>
          <vc-svg-icon class="ml-1" name="arrow_down" prefix="mts" :size="12" />
        </div>
        <template #content>
          <div class="region-list">
            <div
              class="region-option"
              v-for="item in options"
              :key="item.value"
            >
              {{ item.label }}
            </div>
          </div>
        </template>
      </a-popover>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  options: { label: string; value: string }[]
  loading: boolean
}>()

const active = defineModel<string>('active', { required: true })

const label = computed(() => {
  const option = props.options.find(item => item.value === active.value)
  return option?.label || '-'
})

const noList = computed(() => props.options.length === 0)
const isOnlyOne = computed(() => props.options.length === 1)
</script>

<style lang="less" scoped>
.region-box {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  &::before {
    margin-right: 16px;
    width: 1px;
    height: 14px;
    background: var(--color-border-3, #c9cdd4);
    content: '';
  }
}

.prefix {
  color: var(--color-text-3, #86909c);
}
.region-text {
  color: var(--color-text-1, #1d2129);
}
.region-active {
  color: rgb(var(--primary-6));
}

.region-list {
  padding: 8px;
  background-color: #fff;
  border-radius: 6px;
  .region-option {
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: var(--color-text-1, #1d2129);
    cursor: pointer;
    &:hover {
      background: var(--color-fill-2, #f2f3f5);
      border-radius: 4px;
    }
  }
}
</style>
