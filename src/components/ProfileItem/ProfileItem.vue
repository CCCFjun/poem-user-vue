<template>
  <div class="profile-item">
    <div class="profile-item-left ellipsis">
      <i :class="['iconfont', icon]"></i>
      {{title}}
    </div>
    <div class="profile-item-right" >
      <i class="iconfont iconjiantou"></i>
    </div>
  </div>
</template>

<script>
  export default {
    name: "",
    data() {
      return {

      }
    },
    // 外部组件传递给此组件的属性
    props: {
      title: String,
      icon:String
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  .profile-item
    display flex
    justify-content space-between
    align-items center
    background-color #fff
    margin-top 6px
    height 40px
    border-bottom 1px solid #EEE9E9
    &:active
      opacity 0.4
      background #e5e5e5
    //box-shadow 0px 0px 1px rgba(0,0,0,.5)
    &.opacity
       opacity 0.4
       background #e5e5e5
    .profile-item-left
      display flex
      align-items center
      font-size 14px
      i
        font-size 14px
        padding-left 10px
        padding-right 10px
        color #FFC125
    .profile-item-right
      .iconjiantou
        font-size 22px
</style>
