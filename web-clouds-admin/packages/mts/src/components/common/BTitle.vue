<template>
  <div class="b-title">
    <div><slot /></div>
  </div>
</template>

<style lang="less" scoped>
.b-title {
  display: flex;
  align-items: center;
  padding-left: 10px;
  width: 100%;
  height: 40px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  background: var(--color-fill-2, #f2f3f5);
  &::before {
    display: inline-block;
    margin-right: 4px;
    width: 3px;
    height: 14px;
    background: rgb(var(--primary-6));
    content: '';
    line-height: 1;
  }
}
</style>
