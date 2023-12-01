<script lang="ts" setup>
import type { FieldRule, FormInstance } from '@arco-design/web-vue'
import {
  addUserGroupApi,
  getUserGroupMaxSortNumberApi,
  updateUserGroupApi,
  type UserGroupModel
} from '@vca/apis/pedestal'
import { get, omit, set } from 'lodash-es'

import {
  cdn_max_site_count,
  cdn_speed_limit,
  dns_max_domain_count,
  dns_max_rr_count_per_domain,
  ssl_max_certificate_count,
  ssl_max_domain_count
} from '../validate'
interface IProps {
  record?: UserGroupModel
  visible: boolean
}

interface IEmits {
  (event: 'update:visible', value: boolean): void
  (event: 'update:record', value: undefined): void
  (event: 'reload'): void
}
const props = withDefaults(defineProps<IProps>(), {
  visible: false
})
const formRef = ref<FormInstance>()
const emit = defineEmits<IEmits>()
const loading = ref<boolean>(false)
const title = computed(() => (props.record?.id ? '编辑分组' : '新建分组'))
const formState = ref<UserGroupModel>({
  id: '',
  name: '',
  remark: '',
  sort_number: 1,
  oss_privilege: {
    max_storage_space: 1,
    storage_space_unit: 1,
    max_bucket_count: 1
  },
  ssl_privilege: {
    max_certificate_count: 1,
    max_domain_count: 1
  },
  cdn_privilege: {
    max_site_count: 1,
    speed_limit: 1
  },
  mts_privilege: {
    interval_unit: 1,
    max_video_duration: 1,
    max_video_duration_unit: 1,
    max_screenshot_times: 1
  },
  dns_privilege: {
    max_domain_count: 1,
    max_rr_count_per_domain: 1
  }
})

const rules: Record<string, FieldRule[]> = {
  name: [{ required: true, message: '请输入分组名称' }],
  sort_number: [{ required: true, message: '请输入排序' }],
  max_certificate_count: [{ required: true, message: '请输入可申请证书数量' }]
}

const handleSubmit = () => {
  return new Promise<boolean>((resolve, reject) => {
    const action = formState.value?.id ? updateUserGroupApi : addUserGroupApi
    action(formState.value as any)
      .then(() => {
        emit('update:visible', false)
        emit('update:record', undefined)
        emit('reload')
        resolve(true)
      })
      .finally(() => reject(false))
  })
}

const handleClose = () => {
  emit('update:visible', false)
  emit('update:record', undefined)
  return false
}
const geGroupMaxSort = () => {
  getUserGroupMaxSortNumberApi().then(res => {
    formState.value.sort_number = (res?.max_sort_number || 1) + 1
  })
}

const handleOpen = () => {
  formState.value.id = ''
  formRef.value?.resetFields()
  if (props.record?.id) {
    const { max_certificate_count, max_domain_count } =
      props.record.ssl_privilege ?? {}
    formState.value = {
      ...omit(props.record, [
        'is_default',
        'user_count',
        'created_at',
        'updated_at',
        'operated_at'
      ])
    }
    formState.value.ssl_privilege.max_certificate_count =
      Number(max_certificate_count ?? '0') ?? 0
    formState.value.ssl_privilege.max_domain_count =
      Number(max_domain_count ?? '0') ?? 0
    Object.keys(formState.value).map(key => {
      if (key === 'sort_number') {
        formState.value.sort_number = Number(formState.value.sort_number ?? '0')
      }
      if (
        [
          'oss_privilege',
          'ssl_privilege',
          'cdn_privilege',
          'mts_privilege',
          'dns_privilege'
        ].includes(key)
      ) {
        // @ts-ignore
        Object.keys(formState.value[key]).map(k => {
          set(formState.value, [key, k], Number(get(formState.value, [key, k])))
        })
      }
    })
  } else {
    geGroupMaxSort()
  }
}
</script>
<template>
  <a-drawer
    :esc-to-close="false"
    :mask-closable="false"
    :title="title"
    :width="600"
    class="is-admin"
    :loading="loading"
    :visible="visible"
    ok-text="确定"
    :cancel-button-props="{ type: 'outline' }"
    @before-cancel="handleClose"
    @before-open="handleOpen"
    @before-ok="handleSubmit"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
      class="create-group-form"
    >
      <a-form-item field="name" label="分组名称" asterisk-position="end">
        <a-input
          v-model="formState.name"
          placeholder="请输入分组名称"
        ></a-input>
      </a-form-item>
      <div class="item-container">
        <a-form-item label="云存储 OSS" class="title-item">
          <a-form-item label="最大存储空间" field="" asterisk-position="end">
            <a-input-number
              v-model="formState.oss_privilege.max_storage_space"
              :min="1"
              :max="1024"
              :precision="0"
            >
              <template #suffix>
                <a-select v-model="formState.oss_privilege.storage_space_unit">
                  <a-option :value="1">GB</a-option>
                  <a-option :value="2">TB</a-option>
                  <a-option :value="3">PB</a-option>
                </a-select>
              </template>
            </a-input-number>
          </a-form-item>
          <a-form-item label="可创建空间数" field="" asterisk-position="end">
            <a-input-number
              v-model="formState.oss_privilege.max_bucket_count"
              :min="1"
              :max="1000"
              :precision="0"
            >
              <template #suffix>
                <a-tag color="gray" class="suffix-tag">个</a-tag>
              </template>
            </a-input-number>
          </a-form-item>
        </a-form-item>

        <a-form-item label="云转码 MTS" class="title-item">
          <a-form-item label="单位时间" field="" asterisk-position="end">
            <a-select
              v-model="formState.mts_privilege.interval_unit"
              default-value="1"
            >
              <a-option :value="1">每天</a-option>
              <a-option :value="2">每月</a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="可转码视频时长" field="" asterisk-position="end">
            <a-input-number
              :min="1"
              :max="1000000"
              v-model="formState.mts_privilege.max_video_duration"
            >
              <template #suffix>
                <a-tag color="gray" class="suffix-tag">小时</a-tag>
              </template>
            </a-input-number>
          </a-form-item>
          <a-form-item label="可截图次数" field="" asterisk-position="end">
            <a-input-number
              v-model="formState.mts_privilege.max_screenshot_times"
              :min="0"
              :max="100000"
            >
              <template #suffix>
                <a-tag color="gray" class="suffix-tag">次</a-tag>
              </template>
            </a-input-number>
          </a-form-item>
        </a-form-item>

        <a-form-item label="云分发 CDN" class="title-item">
          <a-form-item
            label="可创建站点数"
            field="cdn_privilege.max_site_count"
            asterisk-position="end"
            :rules="cdn_max_site_count"
          >
            <a-input-number
              v-model="formState.cdn_privilege.max_site_count"
              :min="1"
              :max="1000"
            >
              <template #suffix>
                <a-tag color="gray" class="suffix-tag">个</a-tag>
              </template>
            </a-input-number>
          </a-form-item>
          <a-form-item
            label="带宽限速"
            field="cdn_privilege.speed_limit"
            asterisk-position="end"
            :rules="cdn_speed_limit"
          >
            <a-input-number
              :min="1"
              :max="1000"
              v-model="formState.cdn_privilege.speed_limit"
            >
              <template #suffix>
                <a-tag color="gray" class="suffix-tag">Mbps</a-tag>
              </template>
            </a-input-number>
          </a-form-item>
        </a-form-item>

        <a-form-item label="云解析 DNS" class="title-item">
          <a-form-item
            label="可添加域名数量"
            field="dns_privilege.max_domain_count"
            asterisk-position="end"
            :rules="dns_max_domain_count"
          >
            <a-input-number
              :min="1"
              :max="1000000"
              v-model="formState.dns_privilege.max_domain_count"
            >
              <template #suffix>
                <a-tag color="gray" class="suffix-tag">个</a-tag>
              </template>
            </a-input-number>
          </a-form-item>
          <a-form-item
            label="单个域名解析记录数量"
            field="dns_privilege.max_rr_count_per_domain"
            asterisk-position="end"
            :rules="dns_max_rr_count_per_domain"
          >
            <a-input-number
              :min="1"
              :max="1000000"
              v-model="formState.dns_privilege.max_rr_count_per_domain"
            >
              <template #suffix>
                <a-tag color="gray" class="suffix-tag">Mbps</a-tag>
              </template>
            </a-input-number>
          </a-form-item>
        </a-form-item>

        <a-form-item label="SSL 证书" class="title-item special-item">
          <a-form-item
            label="可申请证书数量"
            field="ssl_privilege.max_certificate_count"
            asterisk-position="end"
            :rules="ssl_max_certificate_count"
          >
            <a-radio-group
              v-model="formState.ssl_privilege.max_certificate_count"
              default-value="1"
            >
              <a-radio
                :value="
                  formState.ssl_privilege.max_certificate_count == 0
                    ? 1
                    : formState.ssl_privilege.max_certificate_count
                "
                >限制</a-radio
              >
              <a-input-number
                v-if="formState.ssl_privilege?.max_certificate_count"
                :min="1"
                :max="999999"
                v-model="formState.ssl_privilege.max_certificate_count"
              >
                <template #suffix>
                  <a-tag color="gray" class="suffix-tag">个</a-tag>
                </template>
              </a-input-number>
              <a-input-number v-else disabled>
                <template #suffix>
                  <a-tag color="gray" class="suffix-tag">个</a-tag>
                </template>
              </a-input-number>
              <a-radio :value="0">无限制</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            label="可申请域名数量"
            field="ssl_privilege.max_domain_count"
            asterisk-position="end"
            :rules="ssl_max_domain_count"
          >
            <a-radio-group
              v-model="formState.ssl_privilege.max_domain_count"
              default-value="1"
            >
              <a-radio
                :value="
                  formState.ssl_privilege.max_domain_count == 0
                    ? 1
                    : formState.ssl_privilege.max_domain_count
                "
              >
                限制
              </a-radio>
              <a-input-number
                v-if="formState.ssl_privilege?.max_domain_count"
                :min="1"
                :max="999999"
                v-model="formState.ssl_privilege.max_domain_count"
              >
                <template #suffix>
                  <a-tag color="gray" class="suffix-tag">个</a-tag>
                </template>
              </a-input-number>
              <a-input-number v-else disabled>
                <template #suffix>
                  <a-tag color="gray" class="suffix-tag">个</a-tag>
                </template>
              </a-input-number>
              <a-radio :value="0">无限制</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form-item>
      </div>
      <a-form-item label="排序" field="sort_number">
        <a-input-number
          v-model="formState.sort_number"
          :min="0"
          :max="99999"
        ></a-input-number>
      </a-form-item>
      <a-form-item field="remark" label="备注">
        <a-input
          :max-length="20"
          show-word-limit
          v-model="formState.remark"
          placeholder="请输入备注"
        ></a-input>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>
<style lang="less" scoped>
.create-group-form {
  .item-container {
    @apply rounded-md border border-solid border-color-1 mb-8;
    .arco-form-item {
      margin-bottom: 0;
      flex: 0;
    }
    :deep(.arco-select-view-single) {
      width: 160px !important;
    }
    :deep(.arco-input-number) {
      padding-right: 0;
      width: 160px;
      height: 34px;
      .arco-input-suffix {
        .arco-select {
          max-width: 68px;
          background-color: var(--color-fill-1);
          border: none;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          .arco-select-view-suffix {
            padding-left: 0;
          }
        }
        .arco-input-number-step {
          position: inherit;
          height: 100%;
          border-radius: 0;
          .arco-input-number-step-button {
            border-right: 1px solid var(--color-border-2);
          }
        }
        flex-direction: row-reverse;
      }
      .suffix-tag {
        padding: 5px 12px;
        min-width: 38px;
        height: 32px;
        border-radius: 0;
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
      }
    }
    .title-item {
      > :deep(.arco-form-item-label-col) {
        padding: 10px 16px;
        background-color: var(--color-fill-1);
      }
      > :deep(.arco-form-item-wrapper-col) {
        padding: 16px;
        .arco-form-item-content-flex {
          column-gap: 16px;
          align-items: start;
        }
      }
    }
    .special-item {
      > :deep(.arco-form-item-wrapper-col) {
        .arco-form-item-label-col {
          margin-top: 6px;
        }
        .arco-form-item-content-flex {
          flex-direction: column;
          row-gap: 24px;
          align-items: end;
          .arco-form-item {
            display: flex;
            flex-direction: row;
            align-items: start;
            .arco-form-item-message {
              padding-left: 148px;
              width: 100%;
            }
            .arco-radio-group {
              display: flex;

              flex-direction: row;
              align-items: center;
              .arco-input-number {
                margin: 0 24px 0 16px;
              }
              .arco-radio {
                margin-right: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
