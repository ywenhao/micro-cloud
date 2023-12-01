# web-clouds-admin

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

```vue
<script setup lang="ts">
import { usersListApi } from '@vca/apis/pedestal'
import { cloneDeep } from 'lodash-es'
import { useListRequest, useTable } from 'vc-material'

import columns from './columns'
import filterBarScheme from './filterBarScheme'
const state = ref({})
const {
  pagination,
  loading,
  run: getTableList,
  data: dataSource
} = useListRequest(usersListApi, state)

const { tableRef, selectedKeys, createSortChange, checkAll, indeterminate } =
  useTable(dataSource)

const handleSortChange = createSortChange(getTableList, state)

const editorState = reactive<CommonState>({
  visible: false,
  record: undefined
})

type ICommand = 'CREATE' | 'EDITOR' | 'DELETE'

/** 事件处理集合 */
const handleCommand = (command: ICommand, record?: any) => {
  const actions: Record<ICommand, () => void> = {
    CREATE() {
      editorState.record = undefined
      editorState.visible = true
    },
    EDITOR() {
      editorState.record = cloneDeep(record)
      editorState.visible = true
    },
    DELETE() {
      //   const request = () =>
      //     deleteCdnPortsByIdApi({ id: record!.id! }).then(() => {
      //       Message.success('删除成功')
      //       decPageByData(pagination, dataSource)
      //       getTableList()
      //     })
      //   VcModal.error(
      //     {
      //       title: '删除端口配置',
      //       content: '确认删除所选端口配置？'
      //     },
      //     request
      //   )
    }
  }
  actions[command]()
}
onMounted(getTableList)
</script>

<template>
  <vc-container admin page-title="用户列表" header-bordered>
    <vc-filter-bar
      class="mb-4"
      :loading="loading"
      v-model:page="pagination.page"
      v-model="state"
      :schemas="filterBarScheme"
      @search="getTableList"
    >
      <template #prefix>
        <a-button @click="handleCommand('CREATE')" type="primary">
          添加用户
        </a-button>
      </template>
    </vc-filter-bar>

    <vc-table
      row-key="id"
      ref="tableRef"
      class="mt-4"
      :bordered="false"
      :data="dataSource"
      :columns="columns"
      column-resizable
      @sorter-change="handleSortChange"
      @get-list="getTableList"
      :page-data="pagination"
      :loading="loading"
      is-selection
      v-model:selectedKeys="selectedKeys"
    >
      <template #pagination-left>
        <a-checkbox v-model="checkAll" :indeterminate="indeterminate" />

        <a-button :disabled="!selectedKeys.length" type="outline" class="ml-3">
          加入分组
        </a-button>
      </template>
      <template #actions="{ record }">
        <a-link @click="handleCommand('EDITOR', record)" :hoverable="false">
          编辑
        </a-link>
        <a-link
          @click="handleCommand('DELETE', record)"
          :hoverable="false"
          status="danger"
        >
          删除
        </a-link>
      </template>
    </vc-table>
  </vc-container>
</template>
```

```ts
tooltip: {
  trigger: 'axis',
  formatter(params: any[]) {
    let spans = `<p class="mb-1 mt-0 px-[6px] text-ct-2 text-xs">
      ${formatUnix(params[0].name, 'YYYY-MM-DD')}
    </p>`
    params.forEach((_element, i) => {
      spans += `
      <p class="flex items-center mb-0 px-[6px] mt-1">
        <span class="w-[6px] h-[6px] rounded-md inline-block" style="background-color: ${params[i].color}"></span>
        <span class="ml-2 flex items-center  text-ct-2 text-xs font-medium">
          <span>${params[i].seriesName}：</span><span>${params[i].value} </span>
        </span>
      </p>`
    })
    return spans
  }
}
```
