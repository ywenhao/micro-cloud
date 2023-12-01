<template>
  <div class="vc-space-setting">
    <life-table />
    <coss-table />
    <event-table />
    <div class="space-setting-table flex flex-col mt-4">
      <div class="flex flex-row justify-between items-center">
        <div class="flex flex-col">
          <span class="space-table-title">访问权限</span>
          <span class="space-table-sub-title">
            公开空间的文件可通过外链地址直接访问，私有空间需要拥有者的授权链接才可访问。
            <br />
            改变访问权限可能使当前正在运行的程序和该空间的域名无法正常使用，切换空间属性后需
            10 分钟生效
          </span>
          <p
            class="text-sm text-ct-1 m-0 mt-4"
            :class="{ 'text-danger': roleValue === 'public-read' }"
          >
            {{ roleValue === 'private' ? '私有空间' : '公开空间' }}
          </p>
        </div>
        <a-button
          type="primary"
          :status="roleValue === 'private' ? 'danger' : 'normal'"
          class="edit-btn"
          @click="
            handleChangeStatus(
              roleValue === 'private' ? 'public-read' : 'private'
            )
          "
          >{{
            roleValue === 'private' ? '修改为公开空间' : '修改为私有空间'
          }}</a-button
        >
      </div>
    </div>
    <div class="space-setting-table flex flex-col mt-4">
      <div class="flex flex-row justify-between items-center">
        <div>
          <span class="space-table-title">文件客户端缓存MaxAge</span>
          <br />
          <span class="space-table-sub-title"
            >通过配置 MaxAge 实现在规定的时效内使客户端缓存更新的效果。
          </span>
          <p class="text-sm text-ct-1 m-0 mt-4">{{ max_age }} 秒</p>
        </div>
        <a-button
          type="primary"
          @click="cacheMaxState.visible = true"
          class="edit-btn"
          >编辑</a-button
        >
      </div>
      <cache-max
        v-model="cacheMaxState.visible"
        :max-age="max_age"
        :id="cacheMaxState.id"
        @update="updateDetail"
      ></cache-max>
    </div>
    <referer-view class="mt-4" />
    <label-manage class="mt-4" />
    <div
      class="space-setting-table flex flex-row items-center justify-between mt-4"
    >
      <div class="flex flex-col">
        <span class="space-table-title">空间备注</span>
        <span class="space-table-sub-title"
          >可以为空间添加描述说明，便于区分每个空间的用途。为空则不启用空间备注功能。
        </span>
        <p v-if="remarkData" class="text-sm text-ct-1 m-0 mt-4">
          {{ remarkData }}
        </p>
      </div>
      <a-button
        type="primary"
        @click="remarkState.visible = true"
        class="edit-btn"
        >编辑</a-button
      >
    </div>
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
    <space-remark
      v-model="remarkState.visible"
      :remark-data="remarkData"
      @update="updateDetail"
    ></space-remark>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import {
  delSpaceApi,
  spaceBasicApi,
  type SpaceBasicModel,
  updateAcl
} from '@vcp/apis/oss'
import { VcModal } from 'vc-material'
import { useRoute, useRouter } from 'vue-router'

import {
  CossTable,
  EventTable,
  LabelManage,
  LifeTable,
  RefererView
} from './space-setting'
import CacheMax from './space-setting/drawer/CacheMax.vue'
import SpaceRemark from './space-setting/drawer/SpaceRemark.vue'
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

const cacheMaxState = reactive({
  visible: false,
  id: route.params.id as string
})
const remarkState = reactive({
  visible: false
})
// 更新上层数据
const updateDetail = () => {
  emit('update-detail')
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
      router.push({ name: 'SpaceManage' })
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
    .edit-btn {
      display: none;
    }
    &:hover {
      .edit-btn {
        display: block;
      }
    }
    .space-table-title {
      color: var(--color-text-1);
      @apply text-base font-medium pb-1;
      line-height: 22px;
    }
    .space-table-sub-title {
      @apply text-xs text-[#86909C];
      line-height: 18px;
    }
    .arco-radio-group {
      .arco-radio {
        @apply pl-0 mr-6;
      }
    }
  }
}
</style>
