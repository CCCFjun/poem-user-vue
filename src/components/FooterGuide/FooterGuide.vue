<template>
  <footer class="footer_guide border-1px">
    <div class="guide_item" @click="goto('/today')" :class="{on: isCurrent('/today')}">
      <span class="item_icon">
        <i class="icon iconfont icon-shijian-"></i>
      </span>
      <span>今日</span>
    </div>

    <div class="guide_item" @click="goto('/sea')" :class="{on: isCurrent('/sea')}">
      <span class="item_icon">
        <i class="iconfont icon-shu2-copy"></i>
      </span>
      <span>学海</span>
    </div>

    <div class="guide_item" @click="goto('/exam')" :class="{on: isCurrent('/exam')}">
      <span class="item_icon">
        <i class="iconfont icon-keju"></i>
      </span>
      <span>科举</span>
    </div>

    <div class="guide_item" @click="goto('/forum')" :class="{on: isCurrent('/forum')}">
      <span class="item_icon">
        <i class="iconfont icon-luntan"></i>
      </span>
      <span>百家</span>
    </div>

    <div class="guide_item" @click="goto('/profile')" :class="{on: isCurrent('/profile')}">
      <span class="item_icon">
        <i class="iconfont icon-wo"></i>
      </span>
      <span>我的</span>
    </div>
  </footer>
</template>

<script>
  export default {
    name: "",
    data() {
      return {}
    },
    methods: {
      goto (path) {
        this.$router.replace(path)
      },
      isCurrent (path) {
        // console.log(this.$route.path)
        return this.$route.path === path
      }
    },
/*    watch: {
      '$route' (to, from) {
        console.log(to.path.length);
        console.log(from.path.length);
        if(to.path.length > from.path.length) {
          this.$router.isBack = false
        } else {
          this.$router.isBack = true
        }
      }
    }*/
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .footer_guide
    //顶部有白色的边框
    top-border-1px(#e4e4e4)
    position fixed
    z-index 100
    left 0
    right 0
    bottom 0
    background-color #fff
    width 100%
    height 45px
    display flex
    box-shadow 0px 0px 1px rgba(0,0,0,.5)
    .guide_item
      display flex
      flex 1
      text-align center
      flex-direction column
      align-items center
      margin 5px
      color #999999
      &.on
        color #0000FF
      span
        font-size 12px
        margin-top 2px
        margin-bottom 2px
        .iconfont
          font-size 18px
</style>
