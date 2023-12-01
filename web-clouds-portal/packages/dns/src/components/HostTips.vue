<template>
  <a-popover
    trigger="hover"
    background-color="#fff"
    class="host-tips-popover"
    position="right"
  >
    <div class="host-tips">
      <div><slot /></div>
      <vc-svg-icon
        :size="16"
        class="help-icon"
        :name="light ? 'help-outline' : 'help'"
      />
    </div>
    <template #content>
      <div class="w-full host-tips-content">
        <div class="tips-title">主机记录就是域名前缀，常见用法有：</div>
        <div class="tips-table">
          <div class="left-box">
            <div class="left-item" v-for="item in data" :key="item.label">
              {{ item.label }}
            </div>
          </div>
          <div class="right-box">
            <div class="right-item" v-for="item in data" :key="item.value">
              {{ item.value }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </a-popover>
</template>

<script setup lang="ts">
defineProps<{
  light?: boolean
}>()

const data = [
  { label: 'www', value: '解析后的域名为www.example.com。' },
  { label: '@', value: '直接解析主域名 example.com。' },
  { label: '*', value: '泛解析，匹配其他所有域名 *.example.com。' },
  {
    label: 'mail',
    value: '将域名解析为mail.example.com，通常用于解析邮箱服务器。'
  },
  { label: '二级域名', value: '如：abc.example.com，填写abc。' },
  { label: '手机网站', value: '如：m.example.com，填写m。' }
]
</script>

<style lang="less">
.host-tips {
  display: inline-flex;
  align-items: center;
}
.host-tips-popover {
  .arco-popover-popup-content {
    padding-bottom: 16px;
    width: 460px;
    border: none;
  }
  .host-tips-content {
    font-size: 12px;
    color: #454954;
    letter-spacing: 0;
    line-height: 18px;
    font-weight: 400;
    .tips-title {
      font-size: 14px;
      color: var(--color-text-1);
      font-weight: 400;
      line-height: 20px;
    }
    .tips-table {
      display: flex;
      margin-top: 8px;
      border: 1px solid var(--color-border-2);
      .left-item,
      .right-item {
        padding: 4px 8px;
        padding-right: 0;
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
      }
      .left-box {
        width: 80px;
        background-color: var(--color-fill-2);
        border-right: 1px solid var(--color-border-2);
        .left-item {
          color: var(--color-text-1);
          & + .left-item {
            border-top: 1px solid var(--color-border-2);
          }
        }
      }
      .right-box {
        flex: 1;
        .right-item {
          color: var(--color-text-2);
          & + .right-item {
            border-top: 1px solid var(--color-border-2);
          }
        }
      }
    }
  }
}
.help-icon {
  cursor: pointer;
  margin-left: 4px;
}
</style>
