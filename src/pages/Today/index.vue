<template>
  <div class="bground">
      <div class="poem_list verrl">
        {{poem}}
      </div>
      <div class="author verrl">{{author}}</div>
  </div>
</template>

<script>
  import {Toast} from 'mint-ui'
  import HeaderTop from '../../components/HeaderTop/HeaderTop.vue'
  import Swiper from '../../components/Swiper/Swiper.vue'
  import {mapState} from 'vuex'
  import {reqPoem} from '@/api/today'

  export default {
    name: "",
    data() {
      return {
       poem: null,
       author: null
      }
    },
    created(){
        this.getPoem()
    },
    methods: {
      async getPoem(){
          let result = await reqPoem()
          this.poem = result.content
          this.author = result.author
      }
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .bground
    background-color #f5f5f5
    width 80%
    height 76%
    margin-top 16%
    margin-left 10%
    // position relative
    .verrl
      writing-mode vertical-rl
    .author
      float right
      font-size 20px
      margin-right 80%
      margin-top 30%
    .poem_list
      margin-top 10%
      float right
      margin-right 20%
      height 50% 
      font-size 24px
      width 40%
                
</style>
