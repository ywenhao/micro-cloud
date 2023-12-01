<template>
  <div
    class="right-item"
    :class="!!icon && 'mr24px!'"
    @click="emit('click', label)"
  >
    <a-badge
      :count="isRedDot ? 1 : 0"
      :dot="isRedDot"
      :max-count="99"
      :offset="isRedDot && !icon ? [4, -4] : [0, 0]"
      :dotStyle="{
        background: 'rgb(var(--danger-6))',
        width: '8px',
        height: '8px'
      }"
    >
      <a-popover
        position="br"
        trigger="hover"
        content-class="right-item-popover"
        :arrow-style="{ display: 'none' }"
        v-if="!!children?.length"
      >
        <template #content>
          <div p8px pt6px>
            <div
              class="sub-item"
              @click="emit('click', item.label)"
              v-for="item in children"
              :key="item.label"
            >
              <vc-svg-icon
                :size="16"
                class="vcp-icon-button"
                :name="item.icon!"
              />
              <div ml-10px text-14px text-left>{{ item.title }}</div>
              <div
                class="red-value"
                :class="item.value ? 'visible' : 'invisible'"
              >
                {{ item.value }}
              </div>
            </div>
          </div>
        </template>

        <vc-svg-icon
          v-if="icon"
          :size="24"
          class="vc-icon-button"
          :name="icon"
        />

        <template v-else>{{ title }}</template>
      </a-popover>

      <a-tooltip v-else-if="icon" :content="title">
        <vc-svg-icon :size="24" class="vc-icon-button" :name="icon" />
      </a-tooltip>

      <template v-else>{{ title }}</template>
    </a-badge>
  </div>
</template>

<script setup lang="ts">
import type { HeaderRightMenu } from '../LayoutDefault.vue'

const props = defineProps<HeaderRightMenu>()

const emit = defineEmits<{
  click: [label: string]
}>()

const isRedDot = computed(
  () => props.isDot || !!props.children?.some(v => !!v.value)
)
</script>

<style lang="less" scoped>
.right-item {
  @apply mr32px text-14px font-400 cursor-pointer;
  display: flex;
  align-items: center;
  &:hover {
    color: rgb(var(--primary-6));
  }

  .arco-badge {
    display: inline-block;
  }
}

.vc-icon-button {
  color: var(--color-text-2);
  &:hover {
    color: rgb(var(--primary-6));
  }
}

.sub-item {
  display: flex;
  align-items: center;
  word-break: normal;
  white-space: nowrap;
  color: var(--color-text-1);
  @apply pr-12px pl-14px py8px rounded-4px cursor-pointer;
  &:hover {
    background: var(--color-fill-2);
  }

  .red-value {
    padding: 0 5px;
    font-size: 12px;
    color: #fff;
    background: rgb(var(--danger-6));
    border-radius: 10px;
    font-weight: 500;
    @apply ml-auto  text-center;
  }
}
</style>
<style lang="less">
.arco-trigger-popup-wrapper {
  .right-item-popover {
    padding: 0;
    margin-top: 16px;
    width: 158px;
    border-color: var(--color-fill-2);
    border-radius: 6px;
    .arco-popover-content {
      margin-top: 0;
    }
  }
}
</style>
