<template>
  <vc-container
    page-title="批量操作"
    header-bordered
    class="has-tabs-table"
    :back="() => $router.push({ name: 'DomainResolve' })"
  >
    <a-tabs v-model:active-key="active">
      <a-tab-pane :title="item.title" :key="item.title" v-for="item in list">
        <component v-if="active === item.title" :is="item.component" />
      </a-tab-pane>
    </a-tabs>
  </vc-container>
</template>

<script setup lang="ts">
import AddDomain from '@/components/batch/AddDomain.vue'
import AddLog from '@/components/batch/AddLog.vue'
import BackDomain from '@/components/batch/BackDomain.vue'
import DeleteLog from '@/components/batch/DeleteLog.vue'
import EditLog from '@/components/batch/EditLog.vue'

const list = [
  { title: '添加域名', component: AddDomain },
  { title: '添加记录', component: AddLog },
  { title: '修改记录', component: EditLog },
  { title: '删除记录', component: DeleteLog },
  { title: '取回域名', component: BackDomain }
] as const

export type IActive = (typeof list)[number]['title']

const active = ref<IActive>('添加域名')
</script>

<style lang="less" scoped>
.has-tabs-table {
  :deep(.vc-container__header) {
    margin-bottom: 0 !important;
  }
}
</style>
