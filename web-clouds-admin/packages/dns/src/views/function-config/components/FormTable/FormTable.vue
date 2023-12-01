<template>
  <div class="form-table">
    <div class="form-table__head">
      <div class="form-table__tr">
        <div
          v-for="(item, index) in columns"
          :key="index"
          class="form-table__td"
          :class="item.class"
          :style="{ width: getWidth(item.width) }"
        >
          <template v-if="item.prop === 'name'">
            <host-tips2>{{ item.label }}</host-tips2>
          </template>
          <template v-else>
            {{ item.label }}
          </template>
        </div>
      </div>
    </div>
    <div class="form-table__body">
      <a-form-item
        v-for="(item, index) in props.data"
        :key="index"
        hide-label
        :field="ruleProp ? `${ruleProp}.${index}` : void 0"
        :rules="rule"
        class="form-table__tr"
      >
        <slot v-bind="{ row: item, $index: index }"></slot>
      </a-form-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FieldRule } from '@arco-design/web-vue'

import HostTips2 from '@/components/HostTips2.vue'

import { getWidth, useFormTable } from './useFormTable'

interface IProps {
  data: any[]
  ruleProp?: string
  rule?: FieldRule
}

const props = defineProps<IProps>()

const { columns } = useFormTable(props)
</script>

<style lang="less">
.form-table {
  width: 100%;
  border: 1px solid var(--color-border-1);
  border-bottom: none;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  .form-table__head {
    color: var(--color-text-1);
    background-color: var(--color-fill-2);
    border-bottom: 1px solid var(--color-border-1);
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    .form-table__tr {
      padding: 0 16px;
    }
    .form-table__td {
      font-weight: 500;
      padding: 10px 0;
      & + .form-table__td {
        padding-left: 8px;
      }
    }
  }

  .form-table__body {
    padding-top: 16px;
    padding-bottom: 8px;
    .arco-form-item-content {
      padding: 0 16px;
    }
    .form-table__tr {
      margin-bottom: 8px;
      .form-table__td {
        & + .form-table__td {
          padding-left: 8px;
        }
      }
      & + .form-table__tr {
        .form-table__td {
          padding-top: 0;
        }
      }
      &.arco-form-item-error {
        // margin-bottom: 2px;
        .arco-form-item-message {
          padding-left: 16px;
        }
      }
    }
  }

  .form-table__tr {
    display: flex;
  }
}
</style>
