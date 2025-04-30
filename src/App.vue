<template>
   <view class="pb-[constant(safe-area-inset-bottom)]">
    <!-- 你的应用内容 -->
  </view>
</template>
<script setup lang="ts">

</script>
<style lang="scss">
  @use '@zebra-ui/swiper/index.scss';
	@use "/styles/tailwind.css";
  /* App.vue */
  html, body {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
 
}
.pageBg{
  background:
  linear-gradient(to bottom, transparent,white),
  linear-gradient(to right, #8ee6ed, #f0b1b1);
  height: 100%;
}
</style>
