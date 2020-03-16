<template>
  <div>
    <mt-swipe :auto="4000">
      <!--在组件中使用v-for循环一定要使用key-->
      <!--将来，谁使用此轮播图组件谁为我们传递lunbotuList-->
      <!--lunbotuList是父组件向子组件传值来设置-->
      <mt-swipe-item v-for="item in lunbotuList" :key="item.imgId">
        <viewer>
          <img :src="item.imgSrc" alt="" :class="{'full':isfull}">
        </viewer>
      </mt-swipe-item>
    </mt-swipe>
  </div>

</template>

<script>
  export default {
    props:["lunbotuList","isfull"]
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  img
    height 100%
  .mint-swipe
    height 180px
    .mint-swipe-item
      text-align center
      .full
        width 100%
        height 180px
</style>
