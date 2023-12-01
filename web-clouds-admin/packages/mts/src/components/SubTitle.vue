<template>
  <div class="sub-title">
    <div><slot /></div>
  </div>
</template>

<style lang="less" scoped>
.sub-title {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  width: 100%;
  &::after {
    display: block;
    flex: 1;
    @size: 3px;
    content: '';
    margin-left: 8px;
    height: 10px;
    background-image: repeating-linear-gradient(
      135deg,
      var(--color-fill-2) 0px,
      var(--color-fill-2) @size,
      transparent @size,
      transparent @size * 2
    );
  }
}
</style>
