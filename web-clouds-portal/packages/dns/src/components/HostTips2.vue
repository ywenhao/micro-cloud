<template>
  <div class="flex">
    <a-popover
      trigger="hover"
      background-color="#fff"
      position="right"
      icon="help"
    >
      <div class="flex items-center">
        <div><slot /></div>
        <vc-svg-icon
          class="h-tips-help-icon"
          :size="16"
          prefix="dns"
          name="help-outline"
        />
      </div>
      <template #content>
        <div class="color-ct-1 text-14px font-400 leading-22px">
          <div>只能使用英文字母(a~z，不区分大小写)、数字(0~9)、</div>
          <div>连接符(-)、连接符(_)、 "@"、"*"。</div>
          <div class="color-ct-3">
            连接符(-)不能连续出现、单独注册，也不能放在开头和结尾。
          </div>
        </div>
      </template>
    </a-popover>
  </div>
</template>

<style lang="less" scoped>
.h-tips-help-icon {
  margin-left: 4px;
}
</style>
