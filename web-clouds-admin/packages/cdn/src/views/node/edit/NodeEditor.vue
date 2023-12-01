<template>
  <vc-container
    admin
    header-bordered
    page-title="编辑节点"
    :back="() => $router.push({ name: 'NodeList' })"
  >
    <a-spin :loading="loading">
      <a-form ref="formRef" :model="formState" layout="vertical" :rules="rules">
        <a-form-item class="w-440px!" label="节点名称" field="name">
          <a-input
            show-word-limit
            :max-length="30"
            v-model="formState.name"
            placeholder="请输入节点名称"
          ></a-input>
        </a-form-item>
        <a-form-item class="w-440px!" label="所属区域" field="region_id">
          <a-select
            :loading="regionLoading"
            v-model="formState.region_id"
            :options="regions"
            placeholder="请选择区域"
          ></a-select>
        </a-form-item>
        <!-- 公网IP地址 -->
        <a-form-item class="w-760px!" hide-asterisk>
          <template #label>
            <div class="flex flex-col">
              <div class="flex items-center gap-x-4">
                <label class="font-bold">公网IP地址</label>
                <div
                  class="flex items-center text-primary gap-x-1 cursor-pointer select-none"
                  @click="handleSelectIps('public')"
                >
                  <vc-svg-icon prefix="cdn" name="get-ips"></vc-svg-icon>
                  <span>获取服务器公网IP</span>
                </div>
              </div>
              <div class="arco-form-item-message arco-form-item-message-help">
                填写的网卡名称需与服务器网卡名称一致，否则将影响流量统计。
              </div>
            </div>
          </template>
          <a-table
            :hoverable="false"
            class="vc-table w-full"
            :data="formState.used_public_ips"
            :pagination="false"
            :columns="columns('public')"
          >
            <template #name="{ rowIndex, record }">
              <a-form-item
                hide-asterisk
                validate-trigger="input"
                hide-label
                class="mb-0!"
                :field="`used_public_ips.${rowIndex}.name`"
                :rules="[{ required: true, message: '请输入网卡名称' }]"
              >
                <a-input
                  :max-length="100"
                  show-word-limit
                  v-model="record.name"
                  placeholder="请输入"
                />
              </a-form-item>
            </template>
            <template #ip="{ rowIndex, record }">
              <a-form-item
                hide-asterisk
                hide-label
                validate-trigger="input"
                class="mb-0!"
                :field="`used_public_ips.${rowIndex}.ip`"
                :rules="[{ required: true, validator: validatePublicIpv4 }]"
              >
                <a-input v-model="record.ip" placeholder="请输入" />
              </a-form-item>
            </template>
            <template #actions="{ record, rowIndex }">
              <a-button
                v-if="formState.main_ip_val !== record.ip"
                type="outline"
                @click="setMainIp(record.ip, rowIndex)"
              >
                设为主IP
              </a-button>
              <a-button
                :disabled="
                  !!formState.main_ip_val && formState.main_ip_val !== record.ip
                "
                type="outline"
                @click="removeIp(rowIndex, 'public')"
              >
                <template #icon><icon-close /></template>
              </a-button>
            </template>

            <template #footer>
              <a-button
                type="outline"
                @click="
                  formState.used_public_ips?.push({
                    name: '',
                    ip: '',
                    type: '2'
                  })
                "
              >
                <template #icon><icon-plus /></template>
                添加
              </a-button>
            </template>
          </a-table>
        </a-form-item>

        <!-- 内网IP地址 -->
        <a-form-item class="w-760px!" hide-asterisk>
          <template #label>
            <div class="flex flex-col">
              <div class="flex items-center gap-x-4">
                <label class="font-bold">内网IP地址</label>
                <div
                  class="flex items-center text-primary gap-x-1 cursor-pointer select-none"
                  @click="handleSelectIps('private')"
                >
                  <vc-svg-icon prefix="cdn" name="get-ips"></vc-svg-icon>
                  <span>获取服务器内网IP</span>
                </div>
              </div>
              <div class="arco-form-item-message arco-form-item-message-help">
                填写的网卡名称需与服务器网卡名称一致，否则将影响流量统计。
              </div>
            </div>
          </template>
          <a-table
            :hoverable="false"
            class="vc-table w-full"
            :data="formState.used_private_ips"
            :pagination="false"
            :columns="columns('private')"
          >
            <template #name="{ rowIndex, record }">
              <a-form-item
                hide-asterisk
                hide-label
                class="mb-0!"
                validate-trigger="input"
                :field="`used_private_ips.${rowIndex}.name`"
                :rules="[{ required: true, message: '请输入网卡名称' }]"
              >
                <a-input
                  :max-length="100"
                  show-word-limit
                  v-model="record.name"
                  placeholder="请输入"
                />
              </a-form-item>
            </template>
            <template #ip="{ rowIndex, record }">
              <a-form-item
                hide-asterisk
                hide-label
                class="mb-0!"
                validate-trigger="input"
                :field="`used_private_ips.${rowIndex}.ip`"
                :rules="[{ required: true, validator: validatePrivateIpv4 }]"
              >
                <a-input v-model="record.ip" placeholder="请输入内网IP地址" />
              </a-form-item>
            </template>

            <template #actions="{ record, rowIndex }">
              <a-button
                :disabled="privateRemoveDisabled(record.ip, rowIndex)"
                type="outline"
                @click="removeIp(rowIndex, 'private')"
              >
                <template #icon><icon-close /></template>
              </a-button>
            </template>
            <template #footer>
              <a-button
                type="outline"
                @click="
                  formState.used_private_ips?.push({
                    name: '',
                    ip: '',
                    type: '1'
                  })
                "
              >
                <template #icon><icon-plus /></template>
                添加
              </a-button>
            </template>
          </a-table>
        </a-form-item>
      </a-form>
    </a-spin>
    <select-ip
      v-model="selectState.visible"
      :mode="selectState.mode"
      v-model:public-ips="formState.report_public_ips"
      v-model:private-ips="formState.report_private_ips"
      v-model:used-public-ips="formState.used_public_ips"
      v-model:used-private-ips="formState.used_private_ips"
    ></select-ip>

    <div class="mt-6">
      <a-button type="primary" :loading="loading" @click="saveConfig">
        保存配置
      </a-button>
    </div>
  </vc-container>
</template>

<script setup lang="ts">
import {
  type FieldRule,
  type FormInstance,
  Message
} from '@arco-design/web-vue'
import { IconClose, IconPlus } from '@arco-design/web-vue/es/icon'
import {
  getCdnnodeNodeCheckMainIpApi,
  getCdnnodeNodesBasicConfigByIdApi,
  getCdnResolvRegionsListApi,
  type NodeEditModal,
  updateCdnnodeNodesBasicConfigByIdApi
} from '@vca/apis/cdn'
import { useSelectRemote } from 'vc-material'
import { computed } from 'vue'

import { validatePrivateIpv4 } from '@/utils/formValidators'

import { useComputed } from './hooks/useComputed'
import SelectIp from './SelectIp.vue'

const formState = reactive<NodeEditModal>({
  id: '',
  name: '',
  ips: [],
  main_ip_index: 0,
  storage_config: {
    memory: {
      memory_usage: 0,
      memory_max_file_size: ''
    },
    disk: {
      disk_max_file_size: '',
      disk_path: '',
      disk_usage: 0
    }
  },
  region_name: '',
  // @ts-ignore
  run_status: 0,
  // @ts-ignore
  sync_status: 0,
  sync_last_time: '',
  has_new_version: true,
  created_at: '',
  updated_at: '',
  region_id: '',
  version: '',
  report_public_ips: [],
  report_private_ips: [],
  used_public_ips: [],
  used_private_ips: [],
  main_ip_val: ''
})

const { columns, privateRemoveDisabled } = useComputed(formState)

const selectState = reactive({
  visible: false,
  mode: 'private'
})
const handleSelectIps = (mode: string) => {
  selectState.mode = mode
  selectState.visible = true
}
const route = useRoute()
const {
  loading: regionLoading,
  remoteMethod: getResolves,
  opts: regions
} = useSelectRemote(getCdnResolvRegionsListApi, {})

const formRef = ref<FormInstance>()
const loading = ref(false)

const rules = computed<Record<string, FieldRule[]>>(() => {
  const res: Record<string, FieldRule[]> = {
    name: [{ required: true, message: '请输入节点名称' }],
    region_id: [{ required: true, message: '请选择所属区域' }]
  }
  return res
})

const getNodeInfo = () => {
  loading.value = true
  getCdnnodeNodesBasicConfigByIdApi({ node_id: String(route.params.id) })
    .then(res => {
      Object.assign(formState, res.info)
    })
    .finally(() => {
      loading.value = false
    })
}
/**
 * 设置主要 IP
 * 检测是否能正常通信 如果能设置为主IP
 */
const setMainIp = async (ip: string, index: number) => {
  const fields = [
    `used_public_ips.${index}.name`,
    `used_public_ips.${index}.ip`
  ]
  const valid = await formRef.value?.validateField(fields)
  if (valid) return
  loading.value = true
  getCdnnodeNodeCheckMainIpApi({
    node_id: String(route.params.id),
    main_ip_val: ip
  })
    .then(() => {
      formState.main_ip_val = ip
    })
    .finally(() => {
      loading.value = false
    })
}

const removeIp = (index: number, mode: 'public' | 'private') => {
  if (mode === 'public') {
    formState.used_public_ips?.splice(index, 1)
  } else {
    formState.used_private_ips?.splice(index, 1)
  }
}

//保存配置
const saveConfig = async () => {
  const valid = await formRef.value?.validate()
  if (valid) return

  updateCdnnodeNodesBasicConfigByIdApi({
    ...formState,
    node_id: String(route.params.id)
  }).then(() => {
    Message.success('保存成功')
  })
}
onMounted(() => {
  getResolves()
  getNodeInfo()
})
</script>
