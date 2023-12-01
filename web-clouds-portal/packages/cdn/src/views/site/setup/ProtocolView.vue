<template>
  <a-spin :loading="loading" class="w-full">
    <vc-card>
      <template #title>
        协议选择
        <a-popover position="right" content-class="py-3!">
          <icon-question-circle-fill class="cursor-pointer text-#86909C!" />
          <template #content>
            <a-descriptions
              :column="1"
              :data="[
                { label: '使用 HTTPS 协议', value: '请先配置HTTPS证书' },
                {
                  label: '端口监听',
                  value: 'HTTP协议监听80端口，HTTPS协议监听443端口。'
                }
              ]"
              bordered
            />
          </template>
        </a-popover>
      </template>
      <a-radio-group
        :model-value="formState!.ssl_config!.ssl_mode"
        class="w-full grid! grid-cols-3"
        @change="v => handleProtocolChange(v as number)"
      >
        <a-radio :value="1">
          <template #radio="{ checked }">
            <div
              class="custom-radio-card"
              :class="{ 'custom-radio-card-checked': checked }"
            >
              <div class="flex items-center mb-2">
                <div className="custom-radio-card-mask">
                  <div className="custom-radio-card-mask-dot"></div>
                </div>
                <div className="custom-radio-card-title">仅HTTP</div>
              </div>
              <a-typography-text
                type="secondary"
                class="text-xs! w-full flex items-center"
              >
                客户端和节点仅通过HTTP协议建立连接
              </a-typography-text>
            </div>
          </template>
        </a-radio>
        <a-radio :value="2">
          <template #radio="{ checked }">
            <div
              class="custom-radio-card"
              :class="{ 'custom-radio-card-checked': checked }"
            >
              <div class="flex items-center mb-2">
                <div className="custom-radio-card-mask">
                  <div className="custom-radio-card-mask-dot"></div>
                </div>
                <div className="custom-radio-card-title">强制HTTPS</div>
              </div>
              <a-typography-text
                type="secondary"
                class="text-xs! w-full flex items-center"
              >
                强制HTTP跳转HTTPS，目的端口为<span class="text-success">{{
                  formState.ssl_config?.addition_port
                }}</span>
                <i class="flex-1"></i>
                <a-link
                  :hoverable="false"
                  class="text-ct-3! text-xs! hover:text-primary!"
                  @click="portConfig"
                >
                  配置
                  <icon-right class="vc-button-icon" />
                </a-link>
              </a-typography-text>
            </div>
          </template>
        </a-radio>

        <a-radio :value="3">
          <template #radio="{ checked }">
            <div
              class="custom-radio-card"
              :class="{ 'custom-radio-card-checked': checked }"
            >
              <div class="flex items-center mb-2">
                <div className="custom-radio-card-mask">
                  <div className="custom-radio-card-mask-dot"></div>
                </div>
                <div className="custom-radio-card-title">HTTP+HTTPS</div>
              </div>
              <a-typography-text
                type="secondary"
                class="text-xs! w-full flex items-center"
              >
                客户端和节点支持HTTP和HTTPS协议建立连接
              </a-typography-text>
            </div>
          </template>
        </a-radio>
      </a-radio-group>
    </vc-card>

    <vc-card class="mt-4" is-small bordered title="TLS版本">
      <a-alert type="success">
        <span class="text-success font-medium">支持支持TLSv1.3</span>
        <span class="text-ct-2 ml-6">提供安全保密和数据完整性保障</span>
      </a-alert>
    </vc-card>

    <div class="flex items-center mt-6">
      <a-button type="primary" class="mr-2" @click="saveConfig"
        >保存配置</a-button
      >
    </div>
  </a-spin>
</template>

<script setup lang="ts">
import { Message, Select } from '@arco-design/web-vue'
import { IconQuestionCircleFill, IconRight } from '@arco-design/web-vue/es/icon'
import {
  getCdnSiteSslConfigByIdApi,
  getSitesCertificatesEdgesByIdApi,
  ResultEnum,
  updateCdnSiteSslConfigByIdApi
} from '@vcp/apis/cdn'
import type { protocolConfig } from '@vcp/apis/src/cdn/model/'
import { VcModal } from 'vc-material'

interface IEmits {
  (event: 'tab-change', value: string | number): void
}
const emits = defineEmits<IEmits>()
const route = useRoute()
const loading = ref(false)
const formState = reactive<protocolConfig>({
  ssl_config: {
    site_id: route.params.id as string,
    ssl_mode: 1,
    enable_tls_1_3: 0,
    addition_port: 0
  },
  site_id: ''
})

const portConfig = () => {
  const port = ref(1)
  VcModal.confirm({
    title: '端口调整',
    content: () =>
      h('div', { class: 'flex flex-col gap-y-2' }, [
        h('span', '端口选择'),
        h(Select, {
          modelValue: port.value,
          options: [{ value: 1, label: '443' }]
        })
      ])
  })
}

const handleProtocolChange = (v: number) => {
  if (v !== 2) {
    // @ts-ignore
    formState.ssl_config!.ssl_mode = v
    return
  }
  loading.value = true
  const site_id = route.params.id as string
  getSitesCertificatesEdgesByIdApi({ site_id })
    .then(res => {
      if (res.code === ResultEnum.SUCCESS && res.data?.cert_type) {
        // @ts-ignore
        formState.ssl_config!.ssl_mode = v
        return
      } else if (
        res.code !== ResultEnum.CERTNOEXIST &&
        res.code !== ResultEnum.SUCCESS
      ) {
        Message.error(res.message)
      } else {
        VcModal.confirm(
          {
            title: '提示',
            content: '暂未配置SSL/TLS证书，请先配置证书',
            okText: '去配置'
          },
          () => {
            return new Promise<void>(resolve => {
              emits('tab-change', 'certificate')
              resolve()
            })
          }
        )
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const getConfig = () => {
  loading.value = true
  const site_id = route.params.id as string
  getCdnSiteSslConfigByIdApi({ site_id })
    .then(res => {
      formState.ssl_config = res.ssl_config
      formState.site_id = res.site_id
    })
    .finally(() => {
      loading.value = false
    })
}
const saveConfig = () => {
  loading.value = true
  updateCdnSiteSslConfigByIdApi(formState)
    .then(() => {
      Message.success('保存成功')
      getConfig()
    })
    .finally(() => {
      loading.value = false
    })
}
onMounted(() => {
  getConfig()
})
</script>

<style scoped lang="less">
.custom-radio-card {
  @apply flex flex-col;
  padding: 24px 16px;
  width: 100% !important;
  width: 250px;
  border: 1px solid var(--color-border-2);
  border-radius: 4px;
  box-sizing: border-box;
}

.custom-radio-card-mask {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 14px;
  height: 14px;
  border: 1px solid var(--color-border-2);
  border-radius: 100%;
  box-sizing: border-box;
}

.custom-radio-card-mask-dot {
  width: 8px;
  height: 8px;
  border-radius: 100%;
}

.custom-radio-card-title {
  margin-left: 8px;
  font-size: 14px;
  color: var(--color-text-1);
  font-weight: normal !important;
  font-weight: bold;
}

.custom-radio-card:hover,
.custom-radio-card-checked,
.custom-radio-card:hover .custom-radio-card-mask,
.custom-radio-card-checked .custom-radio-card-mask {
  border-color: rgb(var(--primary-6));
}

.custom-radio-card-checked {
  background-color: var(--color-primary-light-1);
}

.custom-radio-card:hover .custom-radio-card-title,
.custom-radio-card-checked .custom-radio-card-title {
  color: rgb(var(--primary-6));
}

.custom-radio-card-checked .custom-radio-card-mask-dot {
  background-color: rgb(var(--primary-6));
}
</style>
