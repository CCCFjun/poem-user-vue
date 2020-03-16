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
      <img :src="practiceImg" class="paper_src" />
      <div class="paper_name">{{practiceName}}</div>
      <div class="paper_intro">{{practiceDesc}}</div>
      <div class="paper_intro">随机出题，填写回答后，可立即查看答案。</div>
    </div>
    <!--点击试卷开始按钮-->
    <div class="paper_start">
      <mt-button
        class="grey_buttom"
        @click.native="toStartPractice"
      >开始练习</mt-button>
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
      practiceName: '',
      practiceDesc: '',
      practiceImg: '',
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
    optionLeft() {
      return {
        direction: 2,
        limitMoveNum: 2
        // hoverStop: false
      };
    },
  },
  methods: {
    async getKindInfoById() {
      const { kindId } = this;
      let result = await reqKindInfoById({ kindId });
      if (result.statu === 0) {
        this.practiceName = result.data.langName;
        this.practiceDesc = result.data.langDesc;
        this.practiceImg = result.data.langImgSrc;
      } else {
        Toast({
          message: result.msg,
          duration: 2000
        });
      }
    },
    // 点击开始考试按钮
    toStartPractice() {
      if(this.kindId == 12){
        this.$router.replace("/sea/practice/single/" + this.kindId);
      }else if(this.kindId == 13){
        this.$router.replace("/sea/practice/judge/" + this.kindId);
      }else{
        this.$router.replace("/sea/practice/fill/" + this.kindId);
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

.paper {
  padding-top: 45px;
  padding-bottom: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  .paper_info {
    width: 100%;
    border-bottom: 8px solid #EEE9E9;
    letter-spacing: 2px;

    .paper_src {
      width: 100%;
      height: 120px;
    }

    .paper_name {
      color: #8B8989;
      padding-left: 12px;
      height: 30px;
      line-height: 30px;
    }

    .paper_intro {
      color: #8B8989;
      padding-left: 12px;
      line-height: 30px;
    }
  }

  .my_score {
    border-bottom 16px solid #EEE9E9
    clearFix()
    position relative
    display block
    padding 10px 10px
    .profile_image {
      float left
      width 60px
      height 60px
      border-radius 10%
      overflow hidden
      vertical-align top
    }
    .user-info {
      float left
      margin-top 8px
      margin-left 15px
      p {
        font-weight: 700
        font-size 18px
        &.user-info-top {
          padding-bottom 18px
        }
        &.user-info-bottom {
          color #8B8989
          font-size 14px
        }
      }
    }
  }
  .score_list{
    .score_list_item{
      border-bottom 1px solid #EEE9E9
      clearFix()
      position relative
      display block
      padding 10px 10px
      .profile_image {
        float left
        width 60px
        height 60px
        border-radius 10%
        overflow hidden
        vertical-align top
      }
      .user-info {
        float left
        margin-top 8px
        margin-left 15px
        p {
          font-weight: 700
          font-size 18px
          &.user-info-top {
            padding-bottom 18px
          }
          &.user-info-bottom {
            color #8B8989
            font-size 14px
          }
        }
      }
      .user_call{
        float right
        margin-top 8px
        margin-right 15px
        .call_red {
          color #ff0000
        }
        .call_grey {
          color #8B8989
        }
      }
    }
  }
  .paper_start {
    position: fixed;
    bottom: 30px;
    left: 36%;
    z-index: 100;

    .grey_buttom {
      background-color: #ccc;
      margin-top: 15px;
      margin-bottom: 15px;
      color: #fff;
      border-radius: 45%;
      width: 120px;
    }
  }
}
</style>
