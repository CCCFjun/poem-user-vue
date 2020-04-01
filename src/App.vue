<template>
  <div id="app">
    <!-- 设置路由组件的视图位置 -->
    <transition :name="transitionName">
      <router-view class="Router"></router-view>
    </transition>
    <!-- 并放置非路由组件 -->
    <FooterGuide v-show="$route.meta.showFooter"></FooterGuide>
  </div>
</template>

<script>
  import FooterGuide from './components/FooterGuide/FooterGuide.vue'
  import { mapState } from 'vuex'
  export default {
    data(){
      return {
        transitionName: 'slide-right',  // 默认动态路由变化为slide-right
        socket: ''
      }
    },
    computed: {
      ...mapState([ 'userInfo' ])
    },
    components:{
      FooterGuide
    },
    created(){
      //刷新页面时从sessionStorage中取出userInfo
      //如果sessionStorage中有userInfo则取出
      if (sessionStorage.getItem("userInfo")) {
        var user = JSON.parse(sessionStorage.getItem("userInfo"));
        // 将user保存到vuex的state
        this.$store.dispatch('recordUser', user);
      }
      //刷新页面时从sessionStorage中取出feedbackInfo
      //如果sessionStorage中有feedbackInfo则取出
      if (sessionStorage.getItem("feedbackInfo")) {
        var feedbackInfo = JSON.parse(sessionStorage.getItem("feedbackInfo"));
        // 将反馈信息保存到vuex的state
        // this.$store.dispatch('recordFeedbackInfo', feedbackInfo);
      }

      //考试页面刷新若sessionStorage有对应数据从sessionStorage取出数据放入
      if (sessionStorage.getItem("currentIndex")) {
        this.$store.dispatch('refreshCurrentIndex', (Number)(sessionStorage.getItem("currentIndex")))
      }
      if (sessionStorage.getItem("singleAnswers")) {
        this.$store.dispatch('refreshSingleAnswers', JSON.parse(sessionStorage.getItem("singleAnswers")))
      }
      if (sessionStorage.getItem("multipleAnswers")) {
        this.$store.dispatch('refreshMultipleAnswers', JSON.parse(sessionStorage.getItem("multipleAnswers")))
      }
      if (sessionStorage.getItem("judgeAnswers")) {
        this.$store.dispatch('refreshJudgeAnswers', JSON.parse(sessionStorage.getItem("judgeAnswers")))
      }
      if (sessionStorage.getItem("fillAnswers")) {
        this.$store.dispatch('refreshFillAnswers', JSON.parse(sessionStorage.getItem("fillAnswers")))
      }
      if (sessionStorage.getItem("firstCurrentTime")) {
        this.$store.dispatch('refreshFirstCurrentTime', (Number)(sessionStorage.getItem("firstCurrentTime")))
      }
    },
    watch: {
      '$route' (to, from) {
        let isBack = this.$router.isBack;  //  监听路由变化时的状态为前进还是后退
        if (from.path === '/profile' && to.path === '/sea' || from.path === '/profile' && to.path === '/exam'
          || from.path === '/profile' && to.path === '/today' || from.path === '/profile' && to.path === '/forum'
          || from.path === '/sea' && to.path === '/exam'
          || from.path === '/sea' && to.path === '/today' || from.path === '/sea' && to.path === '/forum'
          || from.path === '/exam' && to.path === '/today' || from.path === '/exam' && to.path === '/forum') {
   /*       console.log(from.path);
          console.log(to.path);*/
          this.transitionName = 'slide-right'
        } else if(isBack) {
          // console.log(isBack);
          this.transitionName = 'slide-right'
        } else if (to.path.length < from.path.length) {
          this.transitionName = 'slide-right'
        } else {
          this.transitionName = 'slide-left'
        }
        // console.log(this.transitionName);
        this.$router.isBack = false
      },

    },
    methods: {

    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus">
  // 整个应用组件的样式
  #app
    background #fff
/*    .v-enter
      opacity 0
      transform translateX(100%)
    .v-leave-to
      opacity 0
      transform translateX(-100%)
      position absolute
    .v-enter-active,.v-leave-active
      transition all 0.5s ease*/
    .Router
      width 100%
      position absolute
      transition all .5s ease
    .slide-left-enter, .slide-right-leave-active
      opacity 0
      -webkit-transform translate(100%, 0)
      transform translate(100%, 0)
    .slide-left-leave-active, .slide-right-enter
      opacity 0
      -webkit-transform translate(-100%, 0)
      transform translate(-100% 0)
</style>
