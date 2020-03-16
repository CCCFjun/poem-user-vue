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
      <img :src="paperInfo.paperImgSrc" class="paper_src" />
      <div class="paper_name">{{paperInfo.paperName}}</div>
      <div class="paper_intro">{{paperInfo.paperAttention}}</div>
    </div>
    <div class="my_score" v-if="currentPaperStatus == 1" @click="toExamAnswer(paperId)">
      <div class="profile_image">
        <img
          :src="userImgSrc ? userImgSrc : require('../../common/imgs/profile.jpg')"
          alt="用户头像"
        />
      </div>
      <div class="user-info">
        <p class="user-info-top">{{userName}}</p>
        <p class="user-info-bottom">
          <span>答对{{correctCount}}题&nbsp;&nbsp;&nbsp;用时{{usedTime}}秒</span>
        </p>
      </div>
    </div>
    <div class="score_list" v-if="scoreList == 1">
      <div class="score_list_item" v-for="(item,index) in scoreListInfo" :key="index">
        <div class="profile_image">
          <img
            :src="item.userInfo[0].userImgSrc ? item.userInfo[0].userImgSrc : require('../../common/imgs/profile.jpg')"
            alt="用户头像"
          />
        </div>
        <div class="user-info">
          <p class="user-info-top">{{item.userInfo[0].userName}}</p>
          <p class="user-info-bottom">
            <span>答对{{item.score}}题&nbsp;&nbsp;&nbsp;用时{{item.timeUsed/1000}}秒</span>
          </p>
        </div>
        <div class="user_call">
          <span :class="{'call_red': index <3, 'call_grey': index>=3 }">{{index | filterCall}}</span>
        </div>
      </div>
    </div>
    <!--点击试卷开始按钮-->
    <div class="paper_start">
      <mt-button
        class="grey_buttom"
        @click.native="toStartPaper"
        v-if="currentPaperStatus == 0 "
      >开始答题</mt-button>
    </div>
  </section>
</template>

<script>
import { reqPapersInfoByPaperId, reqCurrentPaperStatus, reqScoreList } from "@/api/exam";
import HeaderTop from "../../components/HeaderTop/HeaderTop.vue";
import Star from "../../components/Star/Star.vue";
import { Toast, MessageBox, Indicator } from "mint-ui";
import { mapState } from "vuex";
export default {
  name: "",
  data() {
    return {
      userPhone: this.$store.state.userInfo.userPhone,
      userName: this.$store.state.userInfo.userName,
      paperId: this.$route.params.paperId,
      paperInfo: {},
      queNumInfo: {},
      currentPaperStatus: 0,
      loading: false,
      usedTime: 0,
      correctCount: 0,
      userImgSrc:"",
      scoreList: 0,
      scoreListInfo:{}
    };
  },
  created() {
    this.loading = true;
    this.getPaperInfoByPaperId();
    this.getCurrentPaperStatus();
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
    ...mapState(["examCalendar"]),
  },
  methods: {
    // 通过paperId获取试卷详情信息
    async getPaperInfoByPaperId() {
      const { paperId } = this;
      let result = await reqPapersInfoByPaperId({ paperId });
      if (result.statu === 0) {
        this.paperInfo = result.data.paperInfo;
        this.queNumInfo = result.data.queNumInfo;
      } else {
        Toast({
          message: result.msg,
          duration: 2000
        });
      }
    },
    // 获取当前试卷的状态，判断是否显示开始答题按钮
    async getCurrentPaperStatus() {
      const { userPhone, paperId } = this;
      let result = await reqCurrentPaperStatus({ userPhone, paperId });
      if (result.statu === 0) {
        this.currentPaperStatus = 1;
        this.usedTime = result.data[0].timeUsed / 1000;
        this.correctCount = result.data[0].score;
        this.userImgSrc = this.$store.state.userInfo.userImgSrc;
        this.scoreList = 1;
        let item = await reqScoreList({ paperId });
        this.scoreListInfo = item.data
      } else {
        //展示按钮
        this.currentPaperStatus = 0;
      }
    },
    // 点击开始考试按钮
    toStartPaper() {
      MessageBox.confirm("确定开始考试吗?").then(
        action => {
          Toast({
            message: "请开始作答",
            duration: 1500
          });
          this.$router.replace("/exam/detail/start/" + this.paperId);
        },
        () => {
          //点击取消按钮操作
        }
      );
    },
    toExamAnswer(paperId){
      this.$router.push('/exam/detail/answer/' + paperId)
    }
  },
  components: {
    HeaderTop,
    Star
  },
  filters:{
    filterCall(value){
      let msg
      if(value == 0){
        msg = "状元"
      }else if(value == 1){
        msg = "榜眼"
      }else if(value == 2){
        msg = "探花"
      }else{
        msg = "进士"
      }
      return msg
    }
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
