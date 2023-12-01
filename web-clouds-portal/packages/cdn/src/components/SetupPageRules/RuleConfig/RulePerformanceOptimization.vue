<template>
  <a-checkbox @change="handleChange" v-model="state.js" label="js">
    JavaScript
  </a-checkbox>
  <a-checkbox @change="handleChange" v-model="state.css" label="css">
    CSS
  </a-checkbox>
  <a-checkbox @change="handleChange" v-model="state.html" label="html">
    HTML
  </a-checkbox>
</template>

<script setup lang="ts">
const modelValue = defineModel<any>()
const state = reactive({
  js: false,
  css: false,
  html: false
})

const handleChange = () => {
  const res = Object.entries(state).reduce((acc, [key, value]) => {
    // @ts-ignore
    acc[key] = value ? 1 : 2
    return acc
  }, {})
  modelValue.value = res
}

watchPostEffect(() => {
  const res = Object.entries(modelValue.value).reduce((acc, [key, value]) => {
    // @ts-ignore
    acc[key] = value == 2
    return acc
  }, {})
  Object.assign(state, res)
})
</script>
