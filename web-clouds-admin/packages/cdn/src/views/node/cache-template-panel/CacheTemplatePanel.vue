<template>
  <a-spin :loading="loading">
    <a-alert class="mb-4">
      <a-space direction="vertical">
        <div>
          1、仅在节点部署初始化时，系统将按照默认的缓存路径
          <span class="text-success">/home/cache</span>
          ，在节点缓存服务器上创建目录文件夹 ，用于缓存源文件。
        </div>
        <div>
          2、调整缓存路径，请自行在节点缓存服务器上
          <span class="text-success"> 手动创建调整后的目录文件夹 </span>
          ，建议将该路径挂载到数据盘，并定期检查缓存空间大小。
        </div>
      </a-space>
    </a-alert>
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
      @submit-success="handleSubmit"
    >
      <vca-card title="内存配置" bordered class="mb-4">
        <template v-if="!!node_id" #extra>
          <a-link
            class="select-none"
            :hoverable="false"
            @click="resetConfig(node_id, '1')"
          >
            重置配置
          </a-link>
        </template>
        <a-form-item
          field="memory.memory_usage"
          validate-trigger="blur"
          class="max-w-440px mb-6!"
          label="内存空间占比"
          help="输入范围10-95%"
        >
          <a-input-number
            v-model="formState.memory.memory_usage"
            :min="10"
            :max="195"
            hide-button
            placeholder="请输入内存占比"
          >
            <template #suffix>%</template>
          </a-input-number>
        </a-form-item>

        <a-form-item
          field="memory.memory_max_file_size"
          validate-trigger="blur"
          class="max-w-440px"
          label="最大可缓存文件大小"
          help="输入范围1-100MB"
        >
          <a-input-number
            v-model="formState.memory.memory_max_file_size"
            hide-button
            :min="1"
            :max="100"
            placeholder="请输入文件大小"
          >
            <template #suffix>MB</template>
          </a-input-number>
        </a-form-item>
      </vca-card>

      <vca-card title="磁盘配置" bordered>
        <template v-if="!!node_id" #extra>
          <a-link
            class="select-none"
            :hoverable="false"
            @click="resetConfig(node_id, '2')"
          >
            重置配置
          </a-link>
        </template>
        <a-form-item
          field="disk.disk_path"
          validate-trigger="blur"
          class="max-w-440px mb-6!"
          label="路径配置"
          help="请输入格式以/开头"
        >
          <a-input
            v-model="formState.disk.disk_path"
            hide-button
            placeholder="请输入路径"
          >
          </a-input>
        </a-form-item>

        <a-form-item
          field="disk.disk_usage"
          validate-trigger="blur"
          class="max-w-440px mb-6!"
          label="磁盘空间占比"
          help="输入范围5-95%"
        >
          <a-input-number
            v-model="formState.disk.disk_usage"
            hide-button
            :min="5"
            :max="95"
            placeholder="请输入比例"
          >
            <template #suffix>%</template>
          </a-input-number>
        </a-form-item>

        <a-form-item
          field="disk.disk_max_file_size"
          validate-trigger="blur"
          class="max-w-440px"
          label="最大可缓存文件大小"
          help="输入范围1M-5GB"
        >
          <a-input-group class="w-full">
            <a-input-number
              hide-button
              v-model="formState.disk.disk_max_file_size"
              :min="1"
              :max="diskMaxFileSizeMax"
              placeholder="请输入缓存文件大小"
            >
            </a-input-number>
            <a-select
              class="w-72px!"
              v-model="formState.disk.disk_max_file_size_unit"
              :options="[
                { label: 'MB', value: 0 },
                { label: 'GB', value: 1 }
              ]"
            >
            </a-select>
          </a-input-group>
        </a-form-item>
      </vca-card>
      <a-form-item hide-label class="mt-4">
        <a-button html-type="submit" type="primary">保存配置</a-button>
      </a-form-item>
    </a-form>
  </a-spin>
</template>

<script setup lang="ts">
import { type FormState, useFormState } from './hooks/useFormState'
import { useHandle } from './hooks/useHandle'

const props = withDefaults(
  defineProps<{
    node_id?: string
  }>(),
  {}
)

const loading = ref(false)

const formState = reactive<FormState>({
  memory: {
    memory_usage: undefined,
    memory_max_file_size: undefined,
    memory_max_file_size_unit: 0
  },
  disk: {
    disk_max_file_size_unit: 0,
    disk_max_file_size: undefined,
    disk_path: '',
    disk_usage: undefined
  }
})
const { getCacheTemplate, resetConfig, handleSubmit } = useHandle(
  loading,
  formState,
  props.node_id
)
const { rules, diskMaxFileSizeMax, formRef } = useFormState(formState)

onMounted(getCacheTemplate)
</script>

<style scoped lang="less">
:deep(.vca-card) {
  border-radius: 6px;
  .arco-card-header {
    padding-top: 16px !important;
    max-width: 488px;
  }
}
</style>
