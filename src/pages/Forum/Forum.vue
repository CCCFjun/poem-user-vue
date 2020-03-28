<template>
  <section class="posts">
    <!--利用$router.back()返回上一级路由 -->
    <HeaderTop title="百家">

    </HeaderTop>
    <div class="add_post" @click="showAction">
      <i class="iconfont icon-hao"></i>
    </div>
    <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
    
  </section>
</template>

<script>
import HeaderTop from "../../components/HeaderTop/HeaderTop.vue";
import BackToTop from "../../components/BackToTop";
import { reqGetPapersList } from "@/api/exam";
import { Toast, Actionsheet } from "mint-ui";
import Star from "../../components/Star/Star.vue";
import { mapState } from "vuex";
export default {
  name: "",
  data() {
    let that = this;
    return {
      actions:[
        {
            name:"出题贴",
            // method:that.isKey
        },
        {
            name:"讨论帖",
            // method:that.isTime
        }
      ],
      sheetVisible: false
    };
  },
  computed: {},
  created() {},
  methods: {
    async getPapersInfo() {
      let result = await reqGetPapersList();
      if (result.statu == 0) {
        this.papersInfo = result.data.papersList;
      } else {
        Toast({
          message: result.msg,
          duration: 2000
        });
      }
    },
    toPaperDetail(paperId) {
      if (!this.$store.state.userInfo.userPhone) {
        Toast({
          message: "请先登录系统",
          duration: 1000
        });
        return;
      } else {
        this.$router.push("/exam/detail/" + paperId);
      }
    },
    showAction(){
      this.sheetVisible = true
    }
  },
  components: {
    HeaderTop,
    BackToTop
  }
};
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixins.styl';
.posts
  padding-top 45px
  .add_post
    width 50px
    height 50px
    position fixed
    bottom 16%
    right 10%
    background-color #FF0000
    border-radius 50%
    .iconfont
      display inline-block
      color #fff
      margin-left 15px
      margin-top 15px
      font-size 20px
</style>
