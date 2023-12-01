<template>
  <vc-dialog
    title="用户配置"
    :loading="loading"
    v-model="visible"
    :on-before-ok="handleSubmit"
    :confirm-button-disabled="!modelValue"
    modal-class="form-dialog"
    @before-open="handleBeforeOpen"
  >
    <a-form :model="{}" layout="vertical">
      <a-form-item hide-label>
        <a-select
          ref="selectUserRef"
          v-model="selectedUser"
          v-model:popup-visible="popupVisible"
          :loading="findUserLoading"
          placeholder="请输入用户ID进行搜索并分配"
          @search="handleSearch"
          :options="users"
          allow-clear
          :allow-search="{ retainInputValue: true }"
        >
          <template #empty>
            <div class="py-70px text-center text-ct-3">没有找到相关结果</div>
          </template>
          <template #option="{ data }">
            <div class="flex items-center w-full" @click.stop>
              <span
                class="flex-1"
                :class="{
                  'text-ct-3 cursor-not-allowed': user_id_list.includes(
                    data.value
                  )
                }"
              >
                {{ data.label }}
              </span>
              <a-link
                v-if="!user_id_list.includes(data.value)"
                @click.stop.prevent="handleAddUser(data.value)"
                :hoverable="false"
              >
                添加分配
              </a-link>
              <a-link disabled v-else :hoverable="false">
                <span class="text-primary-4!">已分配</span>
              </a-link>
            </div>
          </template>
        </a-select>
      </a-form-item>
      <a-form-item label="已分配用户">
        <a-spin :loading="loading" class="w-full">
          <a-scrollbar
            v-if="user_id_list?.length"
            outer-style="min-height: 100px; max-height: 254px; overflow-y: auto; width: 100%"
          >
            <div class="grid grid-cols-3 gap-2 w-full">
              <a-tag
                v-for="item in user_id_list"
                :key="item"
                closable
                @close="handleClearSelect(item)"
              >
                <span class="flex-1">{{ item }}</span>
              </a-tag>
            </div>
          </a-scrollbar>
          <a-empty
            v-else
            class="w-full flex flex-col items-center justify-center"
          >
            <template #image>
              <vc-svg-icon prefix="cdn" name="empty" :size="72" />
            </template>
          </a-empty>
        </a-spin>
      </a-form-item>
    </a-form>
  </vc-dialog>
</template>

<script setup lang="ts">
import { Message, type SelectInstance } from '@arco-design/web-vue'
import {
  getCdnPortsUsersByIdApi,
  updateCdnPortsUsersByIdApi
} from '@vca/apis/cdn'
import { getUserDetailApi, type Result } from '@vca/apis/pedestal'

interface IEmits {
  (event: 'reload'): void
}

const emit = defineEmits<IEmits>()
const portId = defineModel<string>('portId', { required: true })
const visible = defineModel<boolean>({ required: true })

const selectUserRef = ref<SelectInstance>()
const selectedUser = ref<string>('')
const popupVisible = ref<boolean>(false)
const user_id_list = ref<string[]>([])

const loading = ref(false)
const users = ref<{ label: string; value: string }[]>([])

const handleBeforeOpen = () => {
  loading.value = true
  getCdnPortsUsersByIdApi({ id: portId.value! })
    .then(res => {
      user_id_list.value = res.user_id_list ?? []
    })
    .finally(() => {
      loading.value = false
    })
}

const findUserLoading = ref(false)
const handleSearch = (v: any) => {
  if (!v) {
    users.value = []
    return
  }
  findUserLoading.value = true
  ;(getUserDetailApi({ id: v }, false) as Promise<Result>)
    .then(res => {
      console.log(res)
      if (String(res.code).endsWith('6200')) {
        findUserLoading.value = false
        users.value = [{ label: res.data.id, value: res.data.id }]
        return
      } else {
        users.value = []
      }
    })
    .finally(() => {
      findUserLoading.value = false
    })
}
const handleAddUser = async (value: string) => {
  user_id_list.value.push(value)
  popupVisible.value = false
  await nextTick()
  selectedUser.value = ''
}

const handleClearSelect = (item: string) => {
  user_id_list.value = user_id_list.value.filter(r => r !== item)
}
const handleSubmit = async (): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    loading.value = true
    updateCdnPortsUsersByIdApi({
      id: portId.value,
      user_id_list: user_id_list.value
    })
      .then(() => {
        Message.success('加入成功')
        emit('reload')
        resolve(true)
      })
      .catch(() => {
        loading.value = false
        reject(true)
      })
      .finally(() => {
        loading.value = false
      })
  })
}
</script>
