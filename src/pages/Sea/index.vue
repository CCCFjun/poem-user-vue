<template>
  <section class="practice">
    <!--利用$router.back()返回上一级路由 -->
    <HeaderTop title="学海"></HeaderTop>

    <Swiper :lunbotuList="rotationImages" :isfull="true" class="swiper"></Swiper>

    <div class="kind_list" v-for="(item) in kindList" :key="item.langId" @click="toKindDetail(item.langId)">
      <div class="item_border" >
        <div class="kind_list_item" >
          <span class="kind_title">
            <!-- <span class="icon_kind">{{queType}}</span> -->
            {{item.langName}}
          </span>
          <img
            class="kind_img"
            :src="item.langImgSrc"
          />
        </div>
      </div>
    </div>
    <div class="bottom_tips">
      <span>我是有底线的</span>
    </div>

    <back-to-top
      :custom-style="myBackToTopStyle"
      :visibility-height="300"
      :back-position="0"
      transition-name="fade"
    />
  </section>
</template>

<script>
import HeaderTop from "../../components/HeaderTop/HeaderTop.vue";
import BackToTop from "../../components/BackToTop";
import Swiper from '../../components/Swiper/Swiper.vue'
import { reqPracticeKind, reqRotationImages } from "@/api/practice";
import { Toast } from "mint-ui";
export default {
  name: "",
  data() {
    return {
      kindList: [],
      myBackToTopStyle: {
          right: '37px',
          bottom: '90px',
          width: '40px',
          height: '40px',
          'border-radius': '4px',
          'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
          background: '#909399'// 按钮的背景颜色 The background color of the button
      },
      rotationImages:[]
    };
  },
  computed: {},
  created() {
    this.getKindList();
    this.getRotationImages()
  },
  methods: {
    async getRotationImages(){
      const result = await reqRotationImages()
      if (result.statu === 0) {
        this.rotationImages = result.data
      }
    },
    async getKindList() {
      let result = await reqPracticeKind();
      if (result.statu == 0) {
        this.kindList = result.data;
      } else {
        Toast({
          message: result.msg,
          duration: 2000
        });
      }
    },
    toKindDetail(kindId){
      if (!this.$store.state.userInfo.userPhone){
          Toast({
            message:'请先登录系统',
            duration: 1000
          });
          return
      }else{
        this.$router.push('/sea/practice/detail/' + kindId)
      }
      
    },
  },
  components: {
    HeaderTop,
    BackToTop,
    Swiper
  }
};
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixins.styl';

.practice 
  padding-top: 45px;
  width: 100%;
  margin-bottom 50px
  background-color #f5f5f5
  .kind_list 
    display: flex;
    flex-direction: column;
    .item_border
      border-bottom: 1px solid #CDC9C9;
      .kind_list_item 
        display: flex;
        flex-direction: column;
        width: 86%;
        margin: 0 auto;
        margin-bottom: 8px;
        .kind_title 
          height: 50px;
          line-height: 50px;
          font-size: 16px;       
        .kind_img 
          height: 120px;        
        .icon_kind 
          border: 1px solid #B22222;
          border-radius: 36%;
          padding: 3px 8px;
          color: #B22222;
          margin-right: 10px;
        
</style>
