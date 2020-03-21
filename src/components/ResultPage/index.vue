<template>
<transition name="slide-up">
  <div class="result_page">
    <HeaderTop>
      <a href="javascript:" slot="left" class="go_back" @click="toBack">
        <i class="iconfont icon-cha"></i>
      </a>
    </HeaderTop>
    <img class="result_img" :src="getImgUrl(result)" />  
    <p class="result_msg">{{resultMsg}}</p>
  </div>
</transition>
</template>

<script>
import HeaderTop from "@/components/HeaderTop/HeaderTop.vue";
export default {
  name: "ResultPage",
  components:{
    HeaderTop
  },
  props: {
    result: "",
    kindId: 0,
    resultMsg: ""
  },
  created() {
    // setTimeout(()=>{
    //   this.toBack()
    // },1000)
  },
  methods: {
    getImgUrl(result) {
      return require("@/common/imgs/" + result + ".png");
    },
    toBack(){
      this.$router.replace("/sea/practice/detail/" + this.kindId);
    }
  }
};
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: all .8s;
}
.slide-up-enter, .slide-up-leave-to {
  transform: translateY(100%);
}
.result_page 
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 101;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top 45px
  .result_img
    margin-top 20%
  .result_msg
    font-size 24px
</style>