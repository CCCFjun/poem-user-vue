<template>
  <section
    class="paper"
    v-loading="loading"
    element-loading-text="加载中..."
    element-loading-background="rgba(245, 245, 245, 1)"
  >
    <!--顶部标题栏-->
    <HeaderTop>
      <a href="javascript:" slot="left" class="go_back" @click="$router.goBack()">
        <i class="iconfont iconxiazai6"></i>返回
      </a>
    </HeaderTop>

    <div class="paper_info">
      <!-- <img :src="practiceImg" class="paper_src" /> -->
      <img class="kind_img" :src="getImgUrl(langEnName)" />
      <div class="paper_intro">{{practiceDesc}}</div>
      <div class="paper_intro">随机出题，回答错误立即退出本次答题。</div>
      <div class="paper_intro">练习等级提高，题目数增多，答题时间随之减少。</div>
    </div>
    <!--点击试卷开始按钮-->
    <div class="paper_start">
      <!-- <mt-button class="grey_buttom" @click.native="toStartPractice">开始练习</mt-button> -->
      <!-- <mt-button class="grey_buttom" @click.native="toStartPractice">县试</mt-button>
      <mt-button class="grey_buttom" @click.native="toStartPractice">府试</mt-button>
      <mt-button class="grey_buttom" @click.native="toStartPractice">院试</mt-button> -->
      <img @click="toStartPractice(1)" src="@/common/imgs/layer.png" alt="">
      <img @click="toStartPractice(2)" src="@/common/imgs/layer2.png" alt="">
      <img @click="toStartPractice(3)" src="@/common/imgs/layer3.png" alt="">
    </div>
  </section>
</template>

<script>
import { reqKindInfoById } from "@/api/practice";
import HeaderTop from "../../components/HeaderTop/HeaderTop.vue";
import Star from "../../components/Star/Star.vue";
import { Toast, MessageBox, Indicator } from "mint-ui";
export default {
  name: "",
  data() {
    return {
      userPhone: this.$store.state.userInfo.userPhone,
      userName: this.$store.state.userInfo.userName,
      kindId: this.$route.params.kindId,
      practiceName: "",
      practiceDesc: "",
      langEnName: "",
      loading: false
    };
  },
  created() {
    this.loading = true;
    this.getKindInfoById();
    setTimeout(() => {
      this.loading = false;
    }, 800);
  },
  computed: {

  },
  methods: {
    getImgUrl(langEnName){
      return require("@/common/imgs/"+langEnName+".png");
    },
    async getKindInfoById() {
      const { kindId } = this;
      let result = await reqKindInfoById({ kindId });
      if (result.statu === 0) {
        this.practiceName = result.data.langName;
        this.practiceDesc = result.data.langDesc;
        this.langEnName = result.data.langEnName;
      } else {
        Toast({
          message: result.msg,
          duration: 2000
        });
      }
    },
    // 点击开始考试按钮
    toStartPractice(praLayer) {
      if (this.kindId == 12) {
        this.$router.replace("/sea/practice/single/" + this.kindId + "/" + praLayer);
      } else if (this.kindId == 13) {
        this.$router.replace("/sea/practice/judge/" + this.kindId + "/" + praLayer);
      } else {
        this.$router.replace("/sea/practice/fill/" + this.kindId + "/" + praLayer);
      }
    }
  },
  components: {
    HeaderTop,
    Star
  }
};
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixins.styl';

.paper 
  padding-top: 45px;
  padding-bottom: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  .paper_info 
    width: 100%;
    border-bottom: 8px solid #EEE9E9;
    letter-spacing: 2px;
    text-align center
    margin-top 10px
    .kind_img
      width 120px
      height 120px
      
    .paper_name 
      color: #8B8989;
      padding-left: 12px;
      height: 30px;
      line-height: 30px;

    .paper_intro 
      color: #8B8989;
      padding-left: 12px;
      line-height: 30px;

  .paper_start 
    margin-top 30px
    display: flex;
    flex-direction: column;
    width 100%
    align-items: center;
    >img 
      margin-top 16px
    .grey_buttom 
      background-color: #ccc;
      margin-top: 15px;
      margin-bottom: 15px;
      color: #fff;
      border-radius: 45%;
      width: 120px;

</style>
