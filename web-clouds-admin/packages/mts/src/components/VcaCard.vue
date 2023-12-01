<template>
  <a-card
    class="vca-card"
    :class="cardClass"
    :bordered="bordered"
    v-bind="$attrs"
  >
    <template v-for="(_, name) in $slots" #[name]>
      <slot :name="name"></slot>
    </template>
  </a-card>
</template>

<script setup lang="ts">
interface IProps {
  bordered?: boolean
  headerBordered?: boolean
  background?: boolean
  hideBody?: boolean
  isSmall?: boolean
  bodyFull?: boolean
  secondary?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
  bordered: false,
  headerBordered: false,
  hideBody: false,
  secondary: false,
  isSmall: false,
  bodyFull: false,
  background: false
})

const cardClass = computed(() => {
  return {
    'hide-header-border': !props.headerBordered,
    'is-background': props.background,
    'is-small': props.isSmall,
    'hide-body': props.hideBody,
    'is-secondary': props.secondary,
    'body-full': props.bodyFull
  }
})
</script>

<style scoped lang="less">
.vca-card {
  border-radius: 2px;
  &.hide-header-border {
    :deep(.arco-card-header) {
      border-bottom: none;
      border-color: var(--color-border-1);
    }
  }
  &.arco-card-bordered {
    border-color: var(--color-border-1);
  }
  &.is-background {
    background: linear-gradient(
      180deg,
      rgba(232, 243, 255, 0.3) 0%,
      rgba(232, 243, 255, 0.1) 100%
    );

    :deep(.arco-card-header) {
      padding-top: 16px;
    }
  }
  &.is-secondary {
    background: var(--color-border-1);

    :deep(.arco-card-header) {
      padding-top: 18px;
    }
  }

  &.hide-body {
    :deep(.arco-card-body) {
      display: none;
    }
  }
  &.is-small {
    :deep(.arco-card-header) {
      padding: 16px;
    }
  }
  &.body-full {
    :deep(.arco-card-body) {
      padding: 0 24px;
      height: 100%;
    }
  }

  :deep(.arco-card-header) {
    padding: 24px 24px 16px;
    height: auto;
  }
  :deep(.arco-card-body) {
    padding: 0 24px 24px;
  }
}
</style>
