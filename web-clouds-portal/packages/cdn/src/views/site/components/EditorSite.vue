<template>
  <a-drawer
    :width="620"
    title="添加站点"
    :mask-closable="false"
    :visible="visible"
    unmountOnClose
    destroy-on-close
    class="vc-drawer"
    @beforeOpen="handleOpen"
    @before-ok="handleSubmit"
    @beforeCancel="handleCancel"
  >
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item
        ref="domainRef"
        validate-trigger="input"
        label="添加站点"
        field="domain"
        required
        asterisk-position="end"
        class="w-full!"
        :class="{ 'mb-0!': siteStatus.ns_status === 2 }"
        :help="
          domainRef?.isError
            ? undefined
            : '不支持添加泛域名，域名添加后系统将分配CNAME域名，您需完成域名到CNAME域名的解析记录添加。'
        "
      >
        <div class="flex flex-col w-full">
          <a-input
            class="w-full"
            @input="getSiteStatus"
            v-model="formState.domain"
            placeholder="请输入域名"
          >
            <template v-if="statusLoading" #suffix>
              <a-spin />
            </template>
          </a-input>
        </div>
      </a-form-item>
      <div
        v-if="siteStatus.ns_status === 2 && formState.domain"
        :class="{ 'mb-8!': siteStatus.ns_status === 2 }"
        class="text-waring"
      >
        当前域名解析控制权未接入到平台，仅支持手动解析
      </div>
      <a-form-item validate-trigger="input" hide-asterisk>
        <template #label>
          解析模式<vc-required-symbol />
          <a-popover position="right" content-class="py-3!">
            <icon-question-circle-fill class="cursor-pointer text-#86909C!" />
            <template #content>
              <a-descriptions :column="1" bordered>
                <a-descriptions-item label="自动解析"
                  >请先去到<a-link :hoverable="false">"云解析DNS"</a-link
                  >产品处，完成域名的解析控<br />制权更改，平台将自动完成CNAME解析记录添加。
                </a-descriptions-item>
                <a-descriptions-item label="手动解析"
                  >请自行去到DNS产品商处，手动完成CNAME解析记<br />录添加。
                </a-descriptions-item>
              </a-descriptions>
            </template>
          </a-popover>
        </template>
        <a-radio-group
          :disabled="statusLoading"
          v-model="formState.resolve_mode"
          :options="[
            {
              label: '自动解析',
              value: 1,
              disabled: siteStatus.ns_status === 2
            },
            { label: '手动解析', value: 2 }
          ]"
        ></a-radio-group>
      </a-form-item>
      <a-form-item
        validate-trigger="input"
        label="回源协议"
        field="origin_configure.protocol"
        required
        asterisk-position="end"
        class="w-300px!"
      >
        <a-select
          v-model="formState.origin_configure.protocol"
          placeholder="请选择"
        >
          <a-option :value="1">HTTP</a-option>
          <a-option :value="2">HTTPS</a-option>
        </a-select>
      </a-form-item>
      <a-form-item validate-trigger="input" hide-asterisk>
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
          v-model="formState.origin_configure.priority_type"
          :options="[
            { label: '主备优先', value: 1 },
            { label: '权重优先', value: 2 }
          ]"
        ></a-radio-group>
      </a-form-item>

      <a-form-item validate-trigger="input" hide-asterisk class="w-full!">
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
          class="w-full!"
          :pagination="false"
          :data="formState.origin_configure.origin_intel"
          :columns="sourceConfigCols"
        >
          <template #priority="{ record, rowIndex }">
            <a-form-item
              validate-trigger="input"
              :field="`origin_configure.origin_intel.${rowIndex}.priority`"
              hide-asterisk
              hide-label
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
              validate-trigger="input"
              :field="`origin_configure.origin_intel.${rowIndex}.origin`"
              hide-asterisk
              hide-label
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
              validate-trigger="input"
              :field="`origin_configure.origin_intel.${rowIndex}.port`"
              hide-asterisk
              hide-label
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

      <a-form-item validate-trigger="input" hide-asterisk>
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
        validate-trigger="input"
        v-if="formState.backOrigin === 2"
        label="配置域名"
        field="origin_configure.host"
        :required="formState.backOrigin === 2"
        :rules="originRule"
        asterisk-position="end"
      >
        <a-input
          v-model="formState.origin_configure.host"
          placeholder="请输入域名"
        ></a-input>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
import {
  type FieldRule,
  type FormInstance,
  type FormItemInstance,
  Message,
  type TableColumnData
} from '@arco-design/web-vue'
import {
  IconPlusCircleFill,
  IconQuestionCircleFill
} from '@arco-design/web-vue/es/icon'
import { addCdnSiteApi, getDnsDomainNsStatusApi } from '@vcp/apis/cdn'
import { debounce } from 'lodash-es'
import { omit } from 'lodash-es'
import { domainReg, ipv4Reg } from 'vc-material'
const visible = defineModel<boolean>()
const loading = ref(false)
const statusLoading = ref(false)
const emit = defineEmits(['reload'])
const formRef = ref<FormInstance>()
const domainRef = ref<FormItemInstance>()
// 协议
enum E_PROTOCOL {
  HTTP = 1,
  HTTPS
}

const siteStatus = reactive({
  domain_existed: false,
  // ns服务器状态 1-正常 2-异常 [1:已转入 2:没转入]
  ns_status: 1
})
const getSiteStatus = debounce(async () => {
  const valide = await formRef.value?.validateField('domain')
  if (valide) {
    return
  }
  statusLoading.value = true
  getDnsDomainNsStatusApi({ name: formState.domain })
    .then(res => {
      siteStatus.domain_existed = res.domain_existed!
      siteStatus.ns_status = res.ns_status!
      if (siteStatus.ns_status === 2) {
        formState.resolve_mode = 2
      }
    })
    .finally(() => {
      statusLoading.value = false
    })
}, 300)

// 优先类型
enum E_PRIORITY_TYPE {
  PRIMARY_AND_SECONDARY = 1,
  WEIGHT
}

const formState = reactive({
  domain: '',
  backOrigin: 1,
  resolve_mode: 2,
  origin_configure: {
    origin_intel: [
      {
        uuid: '84368b19-72e9-4f57-95ca-4ab6f8edc271',
        index: 1,
        port: undefined,
        priority: 1,
        origin: ''
      }
    ],
    protocol: E_PROTOCOL.HTTP,
    priority_type: E_PRIORITY_TYPE.PRIMARY_AND_SECONDARY,
    host: ''
  }
})

const sourceConfigCols = computed<TableColumnData[]>(() => [
  {
    title:
      formState.origin_configure.priority_type ===
      E_PRIORITY_TYPE.PRIMARY_AND_SECONDARY
        ? '优先级'
        : '权重',
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
      formState.origin_configure.origin_intel
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
  validator(value: string, callback: (error?: string) => void) {
    if (!domainReg.test(value) && !ipv4Reg.test(value)) {
      callback('IP或域名格式不正确')
    } else if (value === formState?.domain) {
      callback('源站域名不能与站点域名相同')
    } else {
      callback()
    }
  }
}

const rules = computed<Record<string, FieldRule[]>>(() => {
  return {
    domain: [
      { required: true, message: '请输入域名' },
      { validator: validateDomain }
    ],
    host: [
      { required: true, message: '请输入回源HOST' },
      { validator: validateDomain }
    ]
  }
})

const handlePushSourceConfig = () => {
  // @ts-ignore
  formState.origin_intel?.push({
    priority: formState.origin_configure.origin_intel?.length + 1
  })
}
const handleRemoveSourceConfig = (index: number) => {
  formState.origin_configure.origin_intel?.splice(index, 1)
  if (formState.origin_configure.origin_intel?.length! < 1) {
    handlePushSourceConfig()
  }
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (valid) return
  return new Promise<boolean>((resolve, reject) => {
    loading.value = true
    const data: any = omit(formState, 'backOrigin')
    data.origin_configure.origin_intel = data.origin_configure.origin_intel.map(
      (item: any) => {
        return omit(item, 'uuid', 'index')
      }
    )
    if (data.origin_configure.protocol === 1) {
      data.origin_configure.host = ''
    }
    addCdnSiteApi(data as any)
      .then(() => {
        Message.success('添加成功')
        formRef.value?.resetFields()
        visible.value = false
        emit('reload')
        return resolve(true)
      })
      .catch(() => {
        reject(false)
      })
      .finally(() => {
        loading.value = false
      })
  })
}

const handleOpen = () => {
  siteStatus.ns_status = 1
}
const handleCancel = () => {
  formRef.value?.resetFields()
  visible.value = false
  return true
}
</script>

<style scoped lang="less">
.source-conf {
  :deep(.arco-card-header) {
    // :deep(.arco-card-body) {
    padding-top: 0;
    padding-left: 0;
    padding-right: 0;
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
