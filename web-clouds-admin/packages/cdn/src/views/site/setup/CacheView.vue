<template>
  <a-spin :loading="loading" class="w-full">
    <vc-card :bordered="false" title="节点默认缓存规则">
      <template #description>
        <div class="text-xs text-ct-3">
          可在
          <a-link
            @click="
              $router.push({
                ...$route,
                params: { ...$route.params, module: 'page_rules' }
              })
            "
            class="font-normal text-xs!"
            :hoverable="false"
            >“页面规则”</a-link
          >
          处自定义节点缓存TTL规则
        </div>
      </template>
      <div class="w-full grid! grid-cols-2 gap-4">
        <div class="p-4 bg-fill-1 rounded">
          <strong class="text-sm text-ct-1">字体（缓存10天）</strong>
          <div class="text-xs text-ct-3">
            WOFF、WOFF2、EOT、FONT、FON、TTF、OTF、TTC
          </div>
        </div>
        <div class="p-4 bg-fill-1 rounded">
          <strong class="text-sm text-ct-1">图片（缓存10天）</strong>
          <div class="text-xs text-ct-3">
            JPG、JPEG、PNG、GIF、WEBP、SVG、ICO、BMP、TIF
          </div>
        </div>
        <div class="p-4 bg-fill-1 rounded">
          <strong class="text-sm text-ct-1">视频（缓存10天）</strong>
          <div class="text-xs text-ct-3">
            M3U8、MP4、AVI、WMV、MOV、MPG、MKV、FLV、3GP、ASF、WEBM、OGV、TS、RMVB
          </div>
        </div>
        <div class="p-4 bg-fill-1 rounded">
          <strong class="text-sm text-ct-1">文本（缓存5天）</strong>
          <div class="text-xs text-ct-3">JS、CSS、HTML、HTM、TXT、XML</div>
        </div>
      </div>
    </vc-card>
    <a-divider />
    <vc-card :bordered="false" title="清除方式">
      <a-radio-group
        class="mt-2 mb-4 block!"
        v-model="clearType"
        :options="clearOptions"
      ></a-radio-group>
      <template v-if="clearType === 1">
        <a-form ref="formRef" :model="cacheState">
          <a-form-item :rules="rules" field="url" hide-label>
            <a-textarea
              v-model="cacheState.url"
              class="max-w-440px block!"
              :auto-size="{ maxRows: 6, minRows: 6 }"
              placeholder="一行一个URL支持多个URL"
            />
            <template #extra>
              <small class="text-ct-3"
                >示例：https://www.example.com/cat.jpg</small
              >
            </template>
          </a-form-item>
        </a-form>
      </template>
      <div>
        <a-button type="primary" @click="clearCache">保存</a-button>
      </div>
    </vc-card>
    <a-divider />
    <vc-card :bordered="false" title="缓存级别">
      <a-radio-group
        v-model="formState.cache_config.cache_level"
        class="w-full grid! grid-cols-3"
      >
        <a-radio v-for="item in options" :key="item.value" :value="item.value">
          <template #radio="{ checked }">
            <div
              class="custom-radio-card"
              :class="{ 'custom-radio-card-checked': checked }"
            >
              <div class="flex items-center mb-2">
                <div className="custom-radio-card-mask">
                  <div className="custom-radio-card-mask-dot" />
                </div>
                <div className="custom-radio-card-title">{{ item.label }}</div>
              </div>
              <a-typography-text
                type="secondary"
                class="text-xs! w-full flex items-center"
              >
                {{ item.description }}
              </a-typography-text>
            </div>
          </template>
        </a-radio>
      </a-radio-group>
    </vc-card>
    <a-divider />
    <vc-card
      :bordered="false"
      class="optimization-card mb-4"
      title="浏览器缓存TTL"
      description="“浏览器缓存TTL”指在访问者的浏览器缓存文件的时长，在此期间，浏览器会从其本地缓存中加载文件，从而提高页面加载速度。"
    >
      <div>浏览器缓存TTL</div>
      <a-select
        v-model="formState.cache_config.cache_in_minutes"
        class="max-w-440px mt-2"
        :default-value="0"
        :options="cacheTTL"
      ></a-select>
    </vc-card>
    <a-divider />
    <a-button type="primary" @click="saveConfig">保存配置</a-button>
  </a-spin>
</template>

<script setup lang="ts">
import {
  type FieldRule,
  type FormInstance,
  Message
} from '@arco-design/web-vue'
import {
  getCdnSiteCacheConfigByIdApi,
  postCdnSiteClearCacheByIdApi,
  updateCdnSiteCacheConfigByIdApi
} from '@vca/apis/cdn'

const route = useRoute()
const siteId = route.params.id as string
const domain = route.params.domain as string
const loading = ref(false)
const clearType = ref(1)
const cacheState = reactive({
  url: ''
})
const formRef = ref<FormInstance>()
const clearOptions = [
  { value: 1, label: '自定义清除' },
  { value: 2, label: '全部清除' }
]

const cacheTTL = [
  { label: '遵循标头', value: 0 },
  { label: '2分钟', value: 120 },
  { label: '5分钟', value: 300 },
  { label: '20分钟', value: 1200 },
  { label: '30分钟', value: 1800 },
  { label: '1小时', value: 3600 },
  { label: '2小时', value: 7200 },
  { label: '3小时', value: 10800 },
  { label: '4小时', value: 14400 },
  { label: '8小时', value: 28800 },
  { label: '16小时', value: 57600 },
  { label: '20小时', value: 72000 },
  { label: '1天', value: 86400 },
  { label: '2天', value: 172800 },
  { label: '3天', value: 259200 },
  { label: '4天', value: 345600 },
  { label: '5天', value: 432000 },
  { label: '16天', value: 1382400 },
  { label: '24天', value: 2073600 },
  { label: '2个月', value: 5184000 },
  { label: '6个月', value: 15552000 },
  { label: '1年', value: 31536000 }
]

const options = [
  {
    label: '没有查询字符串',
    value: 1,
    description: '在没有查询字符串时仅从缓存中交付文件'
  },
  {
    label: '忽略查询字符串',
    value: 2,
    description: '无论查询字符串为何，均向所有人交付相同资源。'
  },
  {
    label: '标准',
    value: 3,
    description: '根据字符串，交付不同资源。'
  }
]
const urls = computed(() => {
  return cacheState.url!.split('\n').filter(item => item.length)
})
const urlValidator = (value: any, callback: (error?: string) => void) => {
  const errs = urls.value.filter(url => {
    const errMsg = regExpValidateHandler(url, regexpMap.noPortUrl, 'url错误')
    if (errMsg) {
      return true
    }
    const obj = new URL(url)
    if (obj.hostname !== domain) {
      return true
    }
    return false
  })
  if (errs.length) {
    callback('域名格式错误，请输入该站点域名相关的URL地址')
  }
}
const rules: FieldRule = { required: false, validator: urlValidator }

const formState = reactive({
  cache_config: {
    site_id: siteId,
    cache_in_minutes: 0,
    cache_level: 1
  }
})

const clearCache = async () => {
  const valid = await formRef.value?.validate()
  if (valid) return
  loading.value = true
  const data = {
    site_id: siteId,
    url: clearType.value === 1 ? urls.value : []
  }
  postCdnSiteClearCacheByIdApi(data)
    .then(() => {
      Message.success('清除成功')
      formRef.value?.resetFields()
    })
    .finally(() => {
      loading.value = false
    })
}
const getConfig = () => {
  getCdnSiteCacheConfigByIdApi({ site_id: siteId }).then(res => {
    const { cache_in_minutes, cache_level } = res.cache_config ?? {}
    formState.cache_config.cache_in_minutes = cache_in_minutes ?? 0
    formState.cache_config.cache_level = Number(cache_level) ?? 1
  })
}
const saveConfig = () => {
  const data = { site_id: siteId, cache_config: formState.cache_config }
  loading.value = true
  // @ts-ignore
  updateCdnSiteCacheConfigByIdApi(data)
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

<style lang="less" scoped>
.optimization-card {
  overflow: hidden;
  border-radius: 6px;
  :deep(.arco-card-header) {
    padding-top: 16px !important;
    height: auto !important;
    border: none;
  }
  :deep(.arco-card-body) {
    padding-top: 6px !important;
  }
}

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
  border: 1px solid var(--color-border-1);
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
