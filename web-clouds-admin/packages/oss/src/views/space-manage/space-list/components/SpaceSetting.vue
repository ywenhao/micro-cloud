<template>
  <div class="vc-space-setting">
    <life-table />
    <coss-table />
    <event-table />
    <div class="grid grid-cols-2 gap-x-4 mt-4">
      <div class="space-setting-table flex flex-col">
        <span class="space-table-title">访问权限</span>
        <span class="space-table-sub-title"
          >公开空间的文件可通过外链地址直接访问，私有空间需要拥有者的授权链接才可访问，改变访问权限可能使当前正在运行的程序和该空间的域名无法正常使用，切换空间属性后需
          10 分钟生效</span
        >
        <a-radio-group
          v-model="roleValue"
          class="mt-2"
          @change="handleChangeStatus"
        >
          <a-radio value="private">私有</a-radio>
          <a-radio value="public-read">公开</a-radio>
        </a-radio-group>
      </div>
      <div class="space-setting-table flex flex-col">
        <span class="space-table-title">文件客户端缓存MaxAge</span>
        <span class="space-table-sub-title"
          >通过配置 MaxAge 实现在规定的时效内使客户端缓存更新的效果。
        </span>
        <div class="mt-[14px] flex gap-x-3 items-center">
          <template v-if="!maxAgeDisable">
            <a-input-number
              v-model="max_age"
              class="input-demo w-160px!"
              :min="1"
              :precision="0"
              :max="31536000"
            />
            <span>秒</span>
            <a-button type="primary" @click="handleEditMaxAge">保存</a-button>
          </template>
          <template v-else>
            <span>{{ max_age }} 秒</span>
            <a-button type="primary" @click="maxAgeDisable = false"
              >编辑</a-button
            >
          </template>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-x-4 mt-4">
      <div>
        <referer-view />
        <div class="space-setting-table flex flex-col mt-4">
          <span class="space-table-title">空间备注</span>
          <span class="space-table-sub-title"
            >可以为空间添加描述说明，便于区分每个空间的用途。为空则不启用空间备注功能。
          </span>
          <a-textarea
            placeholder="支持中文、大小写英文字母、数字等，不超过100个字符
"
            v-model="remarkData"
            class="mt-2"
            :max-length="100"
            show-word-limit
          />
          <span class="mt-2">
            <a-button type="primary" @click="handleRemark">保存</a-button>
          </span>
        </div>
      </div>
      <div>
        <label-manage />

        <div class="space-setting-table flex flex-col mt-4">
          <span class="space-table-title">删除空间</span>
          <span class="space-table-sub-title"
            >空间删除后将不可恢复，请谨慎操作！非空空间不允许删除。
          </span>
          <span class="mt-2">
            <a-button type="primary" status="danger" @click="handleDelSpace"
              >删除</a-button
            >
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  delSpaceApi,
  spaceBasicApi,
  type SpaceBasicModel,
  updateAcl,
  updateSpaceMaxAgeApi,
  updateSpaceRemarkApi
} from '@vca/apis/oss'
import { VcModal } from 'vc-material'
import { useRoute, useRouter } from 'vue-router'

import {
  CossTable,
  EventTable,
  LabelManage,
  LifeTable,
  RefererView
} from './space-setting'

const roleValue = ref('private')
const remarkData = ref<string>('')
const max_age = ref<number>(0)
const route = useRoute()
const router = useRouter()

const listData = ref()

const spaceDetail = defineModel<SpaceBasicModel>('spaceDetail', {
  required: true
})

const emit = defineEmits<{
  (event: 'update-detail'): void
}>()

/** 状态切换事件 */
const handleChangeStatus = (v: string | number | boolean) => {
  const request = () =>
    updateAcl({
      acl: v as string,
      bucket_id: route.params?.id as string
    }).then(() => {
      Message.success('操作成功')
      emit('update-detail')
    })
  roleValue.value = v === 'private' ? 'public-read' : 'private'

  VcModal.confirm(
    {
      title: '修改访问权限',
      content: `确定切换成${v === 'private' ? '私有' : '公开'}空间？`
    },

    request
  )
}

const maxAgeDisable = ref(true)

/**保存MaxAge */
const handleEditMaxAge = () => {
  updateSpaceMaxAgeApi({
    bucket_id: route.params?.id as string,
    max_age: max_age.value
  }).then(() => {
    Message.success('操作成功')
    emit('update-detail')
    maxAgeDisable.value = true
  })
}

/**保存空间备注 */
const handleRemark = () => {
  updateSpaceRemarkApi({
    bucket_id: route.params?.id as string,
    remark: remarkData.value
  }).then(() => {
    Message.success('操作成功')
    emit('update-detail')
  })
}

const handleDelSpace = async () => {
  const detail = await spaceBasicApi({ id: route.params.id as string })
  if (detail?.storage_num) {
    VcModal.confirm({
      title: '无法删除空间',
      content: '空间内仍有文件，无法删除',
      hideCancel: true,
      okText: '知道了'
    })
    return
  }
  const request = () =>
    delSpaceApi({
      id: route.params?.id as string
    }).then(() => {
      Message.success('删除成功')
      router.push({ name: 'Space' })
    })
  VcModal.error(
    {
      title: '删除空间',
      content: '确定删除空间吗'
    },
    request
  )
}

onMounted(() => {
  roleValue.value = spaceDetail.value?.acl!
  listData.value = []
  for (let index = 0; index < 5; index++) {
    listData.value.push({
      name: `规则名称${index + 1}`
    })
  }
})

watch(
  () => spaceDetail.value,
  v => {
    roleValue.value = v?.acl!
    remarkData.value = v?.remark!
    max_age.value = v?.max_age!
  },
  { deep: true, immediate: true }
)
</script>

<style scoped lang="less">
.vc-space-setting {
  :deep(.space-setting-table) {
    border: 1px solid #e5e6eb;
    @apply p-4 rounded;
    .space-table-title {
      color: var(--color-text-1);
      @apply text-base font-medium pb-1;
      line-height: 22px;
    }
    .space-table-sub-title {
      @apply text-xs text-[#86909C];
    }
    .arco-radio-group {
      .arco-radio {
        @apply pl-0 mr-6;
      }
    }
  }
}
</style>
