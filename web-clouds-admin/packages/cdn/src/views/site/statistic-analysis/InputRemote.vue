<script setup lang="ts">
import type { SelectFieldNames } from '@arco-design/web-vue'

export type InputRemoteProps = {
  remoteMethod: (value: string) => Promise<any>
  listField?: string | boolean
  placeholder?: string
  fieldNames?: SelectFieldNames
  immediate?: boolean
}

const props = withDefaults(defineProps<InputRemoteProps>(), {
  listField: 'list',
  placeholder: '',
  immediate: true
})

const modalValue = defineModel<string | number | undefined>()

const options = ref([])
const loading = ref(false)

const handleRemote = async (value: string = '') => {
  loading.value = true
  props
    .remoteMethod(value.trim())
    .then(async res => {
      const data =
        props?.listField && props.listField !== true
          ? res[props.listField] || []
          : res || []
      options.value = data
    })
    .finally(() => {
      loading.value = false
    })
}

const handleSearch = async (value: string) => {
  console.log(value)
  if (value) {
    handleRemote(value)
  } else {
    options.value = []
  }
}

const handleChange = (value: any) => {
  modalValue.value = value
}
onMounted(async () => {
  if (props.immediate) {
    await nextTick()
    handleRemote()
  }
})
</script>
<template>
  <a-select
    :model-value="modalValue"
    :placeholder="placeholder"
    :options="options"
    :field-names="props.fieldNames"
    :loading="loading"
    @change="handleChange"
    allow-search
    @search="handleSearch"
  >
  </a-select>
</template>
