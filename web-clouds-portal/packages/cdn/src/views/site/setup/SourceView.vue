<template>
  <vc-card class="source-conf" title="源站配置">
    <a-spin :loading="loading" class="w-full">
      <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
        <a-form-item
          label="回源协议"
          field="origin_configure.protocol"
          required
          asterisk-position="end"
          class="w-300px!"
        >
          <a-select
            v-model="formState.origin_configure!.protocol"
            placeholder="请选择"
          >
            <a-option :value="1">HTTP</a-option>
            <a-option :value="2">HTTPS</a-option>
          </a-select>
        </a-form-item>
        <a-form-item hide-asterisk>
          <template #label>
            优先类型<vc-required-symbol />
            <a-popover position="right" content-class="py-3!">
              <icon-question-circle-fill class="cursor-pointer text-#86909C!" />
              <template #content>
                <a-descriptions
                  :column="1"
                  :data="[
                    {
                      label: '主备优先',
                      value:
                        '优先级为主源站＞备源站，主源站出现故障\n的情况下，将会回源到备源站。'
                    },
                    {
                      label: '权重优先',
                      value:
                        '权重允许范围为1~100，CDN按照源站的权重\n分配用户回源到不同源站的比例。'
                    }
                  ]"
                  bordered
                />
              </template>
            </a-popover>
          </template>
          <a-radio-group
            v-model="formState.origin_configure!.priority_type"
            :options="[
              { label: '主备优先', value: 1 },
              { label: '权重优先', value: 2 }
            ]"
          ></a-radio-group>
        </a-form-item>

        <a-form-item hide-asterisk class="w-700px!">
          <template #label>
            源站配置<vc-required-symbol />
            <a-popover position="right" content-class="py-3!">
              <icon-question-circle-fill class="cursor-pointer text-#86909C!" />
              <template #content>
                指定回源地址和监听端口，支持回源到IP/域名。
              </template>
            </a-popover>
          </template>
          <a-table
            class="w-[700px]"
            :pagination="false"
            :data="formState.origin_configure?.origin_intel"
            :columns="sourceConfigCols"
          >
            <template #priority="{ record, rowIndex }">
              <a-form-item
                :field="`origin_configure.origin_intel.${rowIndex}.priority`"
                hide-asterisk
                hide-label
                validate-trigger="blur"
                :rules="priorityRule"
                class="table-form-item"
              >
                <a-input-number
                  :min="1"
                  :max="100"
                  hide-button
                  v-model="record.priority"
                ></a-input-number>
              </a-form-item>
            </template>
            <template #origin="{ record, rowIndex }">
              <a-form-item
                :field="`origin_configure.origin_intel.${rowIndex}.origin`"
                hide-asterisk
                hide-label
                validate-trigger="blur"
                :rules="originRule"
                class="table-form-item"
              >
                <a-input
                  v-model="record.origin"
                  placeholder="请输入IP/域名"
                ></a-input>
              </a-form-item>
            </template>
            <template #port="{ record, rowIndex }">
              <a-form-item
                :field="`origin_configure.origin_intel.${rowIndex}.port`"
                hide-asterisk
                hide-label
                validate-trigger="blur"
                :rules="{ required: true, message: '请输入端口号' }"
                class="table-form-item"
              >
                <a-input-number
                  v-model="record.port"
                  :min="1"
                  :max="65535"
                  placeholder="端口"
                ></a-input-number>
              </a-form-item>
            </template>
            <template #actions="{ rowIndex }">
              <a-button
                type="outline"
                status="danger"
                @click="handleRemoveSourceConfig(rowIndex)"
              >
                删除
              </a-button>
            </template>
            <template #footer>
              <div class="w-full flex justify-start items-center">
                <a-link @click="handlePushSourceConfig" :hoverable="false">
                  <icon-plus-circle-fill />
                  添加一行
                </a-link>
              </div>
            </template>
          </a-table>
        </a-form-item>

        <a-form-item hide-asterisk>
          <template #label>
            回源HOST
            <!-- <vc-required-symbol /> -->
            <a-popover position="right" content-class="py-3!">
              <icon-question-circle-fill class="cursor-pointer text-#86909C!" />
              <template #content>
                自定义在节点取源站数据时所需访问的WEB服务器域名
              </template>
            </a-popover>
          </template>
          <a-radio-group
            v-model="formState.backOrigin"
            :default-value="1"
            :options="[
              { label: '默认（域名本身）', value: 1 },
              { label: '自定义', value: 2 }
            ]"
          ></a-radio-group>
        </a-form-item>

        <a-form-item
          v-if="formState.backOrigin === 2"
          label="配置域名"
          field="origin_configure.host"
          :required="formState.backOrigin === 2"
          :rules="originRule"
          asterisk-position="end"
          class="w-700px!"
        >
          <a-input
            v-model="formState.origin_configure!.host"
            placeholder="请输入域名"
          ></a-input>
        </a-form-item>
        <a-form-item
          :wrapper-col-style="{
            display: 'none'
          }"
          label="回源跟随"
          class="w-700px! mb-6!"
        >
          <template #label>
            回源跟随
            <a-popover position="right" content-class="py-3!">
              <icon-question-circle-fill class="cursor-pointer text-#86909C!" />
              <template #content>
                开启回源跟随，通过减少用户URL请求次数来缩短页面加载时间。
              </template>
            </a-popover>
            <a-switch
              v-model="formState.follow_origin"
              class="ml-8"
              :checked-value="1"
              :unchecked-value="2"
            ></a-switch>
          </template>
        </a-form-item>

        <div class="flex items-center">
          <a-button type="primary" class="mr-2" @click="saveConfig">
            保存配置
          </a-button>
        </div>
      </a-form>
    </a-spin>
  </vc-card>
</template>

<script setup lang="ts">
import {
  type FieldRule,
  type FormInstance,
  Message,
  type TableColumnData
} from '@arco-design/web-vue'
import {
  IconPlusCircleFill,
  IconQuestionCircleFill
} from '@arco-design/web-vue/es/icon'
import {
  getCdnSiteOriginConfigByIdApi,
  updateCdnSiteOriginConfigByIdApi
} from '@vcp/apis/cdn'
import type { SourceConfig } from '@vcp/apis/src/cdn/model/'
import { omit } from 'lodash-es'
import { domainReg, ipv4Reg } from 'vc-material'
const route = useRoute()
const loading = ref(false)
const formRef = ref<FormInstance>()
const formState = reactive<SourceConfig>({
  site_id: '',
  origin_configure: {
    site_id: '',
    // @ts-ignore
    protocol: 1,
    priority_type: 1,
    origin_intel: [
      {
        priority: 1,
        origin: '',
        port: 1
      }
    ],
    host: ''
  },
  // @ts-ignore
  follow_origin: 1,
  backOrigin: 1
})
const sourceConfigCols = computed<TableColumnData[]>(() => [
  {
    title: formState.origin_configure?.priority_type === 1 ? '优先级' : '权重',
    dataIndex: 'priority',
    slotName: 'priority',
    width: 114
  },
  { title: 'IP/域名', dataIndex: 'origin', slotName: 'origin' },
  { title: '端口', dataIndex: 'port', slotName: 'port', width: 114 },
  {
    title: '操作',
    dataIndex: 'actions',
    cellClass: 'table-actions',
    slotName: 'actions',
    width: 72
  }
])
// 优先级规则
const priorityRule: FieldRule = {
  required: true,
  validator(value: number, callback: (error: string | undefined) => void) {
    const list =
      formState.origin_configure?.origin_intel
        ?.map(item => {
          if (item.priority === value) {
            return item
          }
        })
        .filter(Boolean) ?? []

    if (list?.length > 1) {
      callback('优先级重复')
    }
  }
}
// 域名ip校验
const originRule: FieldRule = {
  required: true,
  validator(value: string, callback: (error: string | undefined) => void) {
    const siteDomain = route.params.domain as string
    if (!domainReg.test(value) && !ipv4Reg.test(value)) {
      callback('IP或域名格式不正确')
    } else if (value === siteDomain) {
      callback('源站域名不能与站点域名相同')
    } else {
      callback(undefined)
    }
  }
}

const rules = computed<Record<string, FieldRule[]>>(() => {
  return {
    protocol: [{ required: true }],
    host:
      formState.backOrigin == 1
        ? []
        : [
            {
              required: true,
              validator: (
                value: string,
                callback: (error: string | undefined) => void
              ) => {
                if (!domainReg.test(value)) {
                  callback('域名格式不正确')
                } else {
                  callback(undefined)
                }
              }
            }
          ]
  }
})

const handlePushSourceConfig = () => {
  formState.origin_configure?.origin_intel?.push({
    priority: formState.origin_configure?.origin_intel?.length + 1
  })
}
const handleRemoveSourceConfig = (index: number) => {
  formState.origin_configure?.origin_intel?.splice(index, 1)
  if (formState.origin_configure?.origin_intel?.length! < 1) {
    handlePushSourceConfig()
  }
}

const getSourceConfig = () => {
  loading.value = true
  const siteId = route.params.id as string
  getCdnSiteOriginConfigByIdApi({ site_id: siteId })
    .then(res => {
      const { origin_configure, site_id, follow_origin } = res
      formState.follow_origin = follow_origin
      formState.site_id = site_id ?? ''
      // @ts-ignore
      origin_configure!.protocol = origin_configure!.protocol ?? 1
      formState.origin_configure = origin_configure
      formState.follow_origin = follow_origin
      formState.origin_configure?.protocol?.toString()
      if (origin_configure!.host!.length > 0) {
        formState.backOrigin = 2
      }
    })
    .finally(() => {
      loading.value = false
    })
}

// 保存配置
const saveConfig = async () => {
  const valid = await formRef.value?.validate()
  if (valid) return
  loading.value = true

  const data = {
    ...omit(formState, 'backOrigin')
  }

  data.origin_configure!.host =
    formState.backOrigin === 1 ? '' : formState.origin_configure!.host

  updateCdnSiteOriginConfigByIdApi(data)
    .then(() => {
      Message.success('保存成功')
      getSourceConfig()
    })
    .finally(() => {
      loading.value = false
    })
}
onMounted(() => {
  getSourceConfig()
})
</script>

<style scoped lang="less">
.source-conf {
  :deep(.arco-card-header) {
    // :deep(.arco-card-body) {
    padding-top: 0;
    padding-right: 0;
    padding-left: 0;
  }
  :deep(.arco-card-header) {
  }
}
.table-form-item {
  margin-bottom: 0 !important;
}
:deep(tbody) {
  .arco-table-td {
    vertical-align: baseline;
  }
}
// :deep(.arco-form-item-status-error) {
//   position: relative;
//   top: 10px;
// }
</style>
