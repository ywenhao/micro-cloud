<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import { docInfoApi, type DocModel } from '@vca/apis/pedestal'

const props = defineProps(['id'])
const router = useRouter()
const loading = ref<boolean>(false)
const record = ref<DocModel>()

const getDataInfo = () => {
  loading.value = true
  docInfoApi({ id: props.id! })
    .then(res => {
      record.value = res
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  if (!props.id) {
    Message.error('文档不存在')
    return
  }
  getDataInfo()
})
</script>

<template>
  <vc-container
    admin
    page-title="文档详情"
    header-bordered
    :back="() => router.push({ name: 'OperationForGuide' })"
  >
    <a-spin :loading="loading" class="flex flex-col place-center w-full">
      <h1 class="mt-0 mb-2">{{ record?.title || '-' }}</h1>
      <div class="flex items-center text-[var(--color-text-3)] mb-6">
        <span>{{ record?.create_account || '-' }}</span>
        <a-divider :margin="8" direction="vertical" />
        <span>
          <span v-uts="record?.created_at"></span>
          创建
        </span>
        <a-divider :margin="8" direction="vertical" />
        <span>
          <span v-uts="record?.updated_at || record?.created_at"></span>
          更新
        </span>
      </div>
      <vc-rich-text-editor
        class="w-full"
        mode="simple"
        preview
        :toolbar-visible="false"
        readonly
        :model-value="record?.content"
      ></vc-rich-text-editor>
    </a-spin>
  </vc-container>
</template>
