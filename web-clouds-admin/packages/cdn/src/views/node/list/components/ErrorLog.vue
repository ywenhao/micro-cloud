<template>
  <vc-dialog
    title="错误日志"
    :loading="loading"
    :footer="false"
    v-model="visible"
    :on-before-ok="handleSubmit"
    :confirm-button-disabled="!modelValue"
    modal-class="error-log__modal"
    :renderToBody="false"
  >
    <a-list
      class="bg-fill-1 border-solid border-1 rounded-md! border-color-2 py-1.5! pl-3! mb-6"
      :max-height="227"
      :split="false"
      :bordered="false"
      @reach-bottom="getListRequest"
    >
      <template #scroll-loading>
        <a-spin />
      </template>
      <a-list-item
        class="p-0! text-ct-3 pr-3 w-full overflow-hidden ssss"
        v-for="(item, i) in dataSource || []"
        :key="i"
      >
        <a-tooltip :content="item">
          <div class="w-full truncate">
            {{ item }}
          </div>
        </a-tooltip>
      </a-list-item>
    </a-list>
  </vc-dialog>
</template>

<script setup lang="ts">
import { getCdnnodeNodesErrorLogsByIdApi } from '@vca/apis/cdn'

interface IEmits {
  (event: 'submit'): void
}

defineEmits<IEmits>()
const visible = defineModel<boolean>({ required: true })

const loading = ref(false)
const dataSource = ref<string[]>([])
const getListRequest = () => {
  const params = { node_id: '1671412772316909568', limit: 20, offsize: 0 }
  getCdnnodeNodesErrorLogsByIdApi(params).then(res => {
    dataSource.value = res.logs || []
  })
}

// const data = [
//   '2023-03-07T10:16:51+08:00 连接rabbit失败',
//   '2023-03-07T10:17:03+08:00 连接rabbit失败',
//   '2023-03-07T10:17:16+08:00 连接rabbit失败',
//   '2023-03-07T10:17:28+08:00 连接rabbit失败',
//   '2023-03-07T10:17:56+08:00 连接rabbit失败',
//   '2023-03-07T10:18:09+08:00 连接rabbit失败',
//   '2023-03-07T10:18:22+08:00 连接rabbit失败',
//   '2023-03-07T10:18:35+08:00 连接rabbit失败',
//   '2023-03-07T10:18:49+08:00 连接rabbit失败',
//   '2023-03-07T10:18:59+08:00 连接rabbit失败',
//   '2023-03-07T10:17:03+08:00 连接rabbit失败',
//   '2023-03-07T10:17:16+08:00 连接rabbit失败',
//   '2023-03-07T10:17:28+08:00 连接rabbit失败',
//   '2023-03-07T10:17:56+08:00 连接rabbit失败',
//   '2023-03-07T10:18:09+08:00 连接rabbit失败',
//   '2023-03-07T10:18:22+08:00 连接rabbit失败',
//   '2023-03-07T10:18:35+08:00 连接rabbit失败',
//   '2023-03-07T10:18:49+08:00 连接rabbit失败',
//   '2023-03-07T10:18:59+08:00 连接rabbit失败'
// ]
// const {
//   loading: groupLoading,
//   remoteMethod,
//   opts
// } = useSelectRemote(domainGroupListApi, {
//   labelKey: 'name',
//   valueKey: 'id',
//   queryKey: 'name_keyword'
// })

async function handleSubmit() {
  // try {
  //   loading.value = true
  //   await domainGroupAddBatchApi({
  //     id: groupId.value,
  //     domain_ids: props.rows.map(item => item.id!),
  //     ids: void 0
  //   })
  //   Message.success('加入成功')
  //   emit('submit')
  // } finally {
  //   loading.value = false
  // }
}

watchEffect(() => {
  if (!visible.value) {
    // content.value = ''
  } else {
    // remoteMethod()
  }
})
</script>

<style lang="less"></style>
