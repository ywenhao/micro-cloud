<template>
  <vca-card class="source-conf" title="源站配置">
    <a-spin :loading="loading" class="w-full">
      <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
        <a-form-item
          label="源站类型"
          field="origin_configure.protocol"
          required
          asterisk-position="end"
          class="w-300px!"
        >
          <a-radio-group
            v-model="formState.origin_configure!.origin_type"
            :options="[
              { label: '自有源', value: 1 },
              { label: 'OSS源', value: 2 }
            ]"
          ></a-radio-group>
        </a-form-item>
        <!-- <a-form-item
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
        </a-form-item> -->
        <template v-if="Number(formState.origin_configure!.origin_type) == 1">
          <a-form-item
            label="回源协议"
            field="origin_configure.protocol"
            required
            hide-asterisk
            asterisk-position="end"
            class="w-300px!"
          >
            <template #label>
              回源协议<vc-required-symbol />
              <a-popover position="right" content-class="py-3!">
                <icon-question-circle-fill
                  class="cursor-pointer text-#86909C!"
                />
                <template #content>
                  若您的源站支持 HTTPS 访问，建议选择 HTTPS 作为<br />您的回源协议，避免您的回源数据被窃取或者篡改。
                </template>
              </a-popover>
            </template>
            <a-radio-group
              v-model="formState.origin_configure!.protocol"
              :options="[
                { label: 'HTTP', value: 1 },
                { label: 'HTTPS', value: 2 }
              ]"
            ></a-radio-group>
          </a-form-item>
          <a-form-item hide-asterisk>
            <template #label>
              优先类型<vc-required-symbol />
              <a-popover position="right" content-class="py-3!">
                <icon-question-circle-fill
                  class="cursor-pointer text-#86909C!"
                />
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
                <icon-question-circle-fill
                  class="cursor-pointer text-#86909C!"
                />
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
                <icon-question-circle-fill
                  class="cursor-pointer text-#86909C!"
                />
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
                <icon-question-circle-fill
                  class="cursor-pointer text-#86909C!"
                />
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
        </template>
        <template v-if="Number(formState.origin_configure!.origin_type) === 2">
          <a-form-item
            :rules="[
              {
                required: true,
                message: '请选择OSS空间',
                validator(value, callback) {
                  console.log(value)
                  if (!value) {
                    callback('请选择OSS空间')
                  } else {
                    callback(undefined)
                  }
                }
              }
            ]"
            hide-asterisk
            field="origin_configure.oss_bucket_id"
          >
            <template #label>
              源站地址<vc-required-symbol />
              <a-popover
                position="right"
                content-class="py-3!"
                content="可选择当前账号下云存储OSS，公开的空间作为源站。"
              >
                <icon-question-circle-fill
                  class="cursor-pointer text-#86909C!"
                />
              </a-popover>
            </template>
            <a-select
              @change="getSpaceDomain"
              :options="spaces"
              v-model="formState.origin_configure!.oss_bucket_id"
              :loading="spaceLoading"
              :fallback-option="false"
              class="max-w-[700px]"
              placeholder="请选择OSS空间"
            ></a-select>
          </a-form-item>

          <a-form-item hide-asterisk>
            <template #label>
              回源HOST<vc-required-symbol />
              <a-popover
                position="right"
                content-class="py-3!"
                content="OSS源的回源HOST不支持修改"
              >
                <icon-question-circle-fill
                  class="cursor-pointer text-#86909C!"
                />
              </a-popover>
            </template>
            <a-spin :loading="spaceHostLoading" class="w-full max-w-[700px]">
              <a-input
                class="max-w-[700px]"
                disabled
                :model-value="spaceHost"
                placeholder="——"
              ></a-input>
            </a-spin>
          </a-form-item>
        </template>
        <div class="flex items-center">
          <a-button type="primary" class="mr-2" @click="saveConfig">
            保存配置
          </a-button>
        </div>
      </a-form>
    </a-spin>
  </vca-card>
</template>

<script setup lang="ts">
import {
  type FieldRule,
  type FormInstance,
  Message,
  type SelectOptionData,
  type TableColumnData
} from '@arco-design/web-vue'
import {
  IconPlusCircleFill,
  IconQuestionCircleFill
} from '@arco-design/web-vue/es/icon'
import {
  getCdnSiteOriginConfigByIdApi,
  updateCdnSiteOriginConfigByIdApi
} from '@vca/apis/cdn'
import { spaceDomainApi, spaceListApi } from '@vca/apis/oss'
import type { SourceConfig } from '@vca/apis/src/cdn/model/'
import { omit } from 'lodash-es'
import { domainReg, ipv4Reg } from 'vc-material'
const route = useRoute()
const loading = ref(false)
const formRef = ref<FormInstance>()
const formState = reactive<SourceConfig>({
  site_id: '',
  origin_configure: {
    site_id: '',
    origin_type: 1,
    protocol: 1,
    priority_type: 1,
    oss_bucket_id: '',
    origin_intel: [
      {
        priority: 1,
        origin: '',
        port: 1
      }
    ],
    host: ''
  },
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
  return Number(formState.origin_configure?.origin_type) === 1
    ? {
        protocol: [{ required: true }],
        host:
          formState.backOrigin === 1
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
    : {}
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
      origin_configure!.protocol = origin_configure!.protocol ?? 1
      formState.origin_configure = origin_configure
      formState.follow_origin = follow_origin
      formState.origin_configure?.protocol?.toString()
      formState.origin_configure.oss_bucket_id =
        origin_configure?.oss_bucket_id == 0
          ? undefined
          : origin_configure!.oss_bucket_id

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
    ...omit(formState, ['backOrigin'])
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
const spaces = ref<SelectOptionData[]>([])
const spaceLoading = ref(false)
const spaceHost = ref('')
const getSpaceList = () => {
  spaceLoading.value = true
  spaceListApi({
    limit: 500,
    offset: 0,
    acl: 'public-read',
    user_id: String(route.params?.userId)
  })
    .then(res => {
      spaces.value = (res?.list ?? []).map(item => ({
        label: item.name,
        value: item.id
      }))
    })
    .finally(() => {
      spaceLoading.value = false
    })
}

const spaceHostLoading = ref(false)
const getSpaceDomain = () => {
  if (formState.origin_configure?.oss_bucket_id) {
    spaceHostLoading.value = true
    spaceDomainApi({
      bucket_id: formState.origin_configure?.oss_bucket_id ?? '',
      limit: 20,
      offset: 0
    })
      .then(res => {
        spaceHost.value = res?.list?.[0]?.name ?? ''
      })
      .finally(() => {
        spaceHostLoading.value = false
      })
  } else {
    spaceHost.value = ''
  }
}

onMounted(() => {
  getSpaceList()
  getSourceConfig()
})
</script>

<style scoped lang="less">
.source-conf {
  :deep(.arco-card-header),
  :deep(.arco-card-body) {
    padding-right: 0;
    padding-left: 0;
  }
  :deep(.arco-card-header) {
    padding-top: 0;
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
