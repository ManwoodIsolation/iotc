<template>
  <view class="bg-transparent" :style="`height:${top}px;`">
    <slot></slot>
  </view>
</template>

<script  setup name="topMargin">
  let SYSTOM=uni.getSystemInfoSync();
  let top=SYSTOM.statusBarHeight;
</script>

<style scoped></style>