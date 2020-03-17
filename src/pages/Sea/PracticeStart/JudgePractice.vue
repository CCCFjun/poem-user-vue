<template>
  <section class="judge_collection">
    <HeaderTop>
      <a href="javascript:" slot="left" class="go_back" @click="toBack">
        <i class="iconfont iconfanhui"></i>
      </a>
    </HeaderTop>

    <section
      class="que"
      v-for="(item, index) in judgeList"
      :key="'judge'+ item.judgeId"
      v-show="index == currentIndex"
    >
      <mt-progress :value="timer" :bar-height="5"></mt-progress>
      <div class="content">
        <span class="que_content">{{index + 1}}.&nbsp;{{item.content}}</span>
        <img :src="item.pictureSrc" alt style="width: 100%" v-if="item.pictureSrc" />
        <mt-radio v-model="judgeAnswer" :options="judgeList[index].options"></mt-radio>
        <div v-if="ansShow[currentIndex]" class="que_ans">
          <span class="green_answer">正确答案</span>{{item.judgeAnswer}}
          <div class="que_explain">解析：<span class="correct_answer">{{item.answerExplain}}</span></div>
        </div>
      </div>
      
    </section>
    

    <div class="paper_button">
      <mt-button type="primary" @click.native="preItem" :disabled="currentIndex < 1">
        {{currentIndex < 1 ? '无' :
        '上一题'}}
      </mt-button>
      <mt-button type="primary" @click.native="nextItem" v-if="currentIndex != queNum - 1">
        下一题
      </mt-button>
      <mt-button
          type="primary"
          @click.native="backToDetail"
          v-if="currentIndex == queNum-1"
        >完成练习</mt-button>
    </div>
  </section>
</template>

<script>
import HeaderTop from "@/components/HeaderTop/HeaderTop.vue";
import { reqJudgePractice } from "@/api/practice";
import { Toast, Indicator, MessageBox } from "mint-ui";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "",
  data() {
    return {
      judgeList: [],
      judgeAnswer: "",
      queNum: 0,
      kindId: this.$route.params.kindId,
      ansShow: [],
      timer: 0
    };
  },
  computed: {
    ...mapState([
      "currentIndex", //当前题数
      "judgeAnswers"
    ])
  },
  created() {
    Indicator.open({
      text: "加载中...",
      spinnerType: "fading-circle"
    });
    this.getJudgeList(() => {
      // this.countTime();
      this.$store.dispatch("initJudgeAnswersLength", this.queNum);
    });
  },
  methods: {
    ...mapActions([
      "nextQue", //点击下一题
      "prevQue", //点击上一题
      "recordJudgeAnswers", //记录单选题答案到数组，第一个参数为数组下标，第二个参数为当前下标的值
      "refreshCurrentIndex",
      "refreshJudgeAnswers"
    ]),
    countTime(){
      const vm = this
      if(this.timer < 100){
        setTimeout(()=>{
          vm.timer += 1
          vm.countTime()
        },50)
      }else{
        // this.nextItem()
      } 
    },
    async getJudgeList(callback) {
      let result = await reqJudgePractice();
      if (result.statu == 0) {
        this.judgeList = result.data;
        this.queNum = result.data.length;
        Indicator.close();
        callback && callback();
      } else {
        Toast({
          message: result.msg,
          duration: 1500
        });
      }
    },
    //点击上一题
    preItem() {
      this.judgeAnswer = "";
      this.prevQue();
      this.getCurrentAnswer();
    },
    //点击下一题
    nextItem() {
      this.judgeAnswer = "";
      this.nextQue();
      this.getCurrentAnswer();
    },
    //点击返回按钮
    toBack() {
      MessageBox.confirm("退出此次练习?").then(
        action => {
          //清除sessionStorage数据
          sessionStorage.removeItem("currentIndex");
          sessionStorage.removeItem("judgeAnswers");
          //清除vuex数据
          this.refreshCurrentIndex(0);
          this.refreshJudgeAnswers([]);
          //详情页面
          this.$router.isBack = true;
          this.$router.replace("/sea/practice/detail/" + this.kindId);
        },
        () => {
          //点击取消按钮操作
        }
      );
    },
    backToDetail(){
        //清除sessionStorage数据
          sessionStorage.removeItem("currentIndex");
          sessionStorage.removeItem("judgeAnswers");
          //清除vuex数据
          this.refreshCurrentIndex(0);
          this.refreshJudgeAnswers([]);
          //详情页面
          this.$router.isBack = true;
          this.$router.replace("/sea/practice/detail/" + this.kindId);
    },
    //单选题点击change事件
    judgeChange() {
      const { currentIndex, judgeAnswer } = this;
      this.recordJudgeAnswers({ currentIndex, judgeAnswer });
      if(this.judgeAnswers[currentIndex]!=null){
          this.ansShow[currentIndex] = 1
      }
    },
    getCurrentAnswer() {
        const currentAnswer = this.judgeAnswers[this.currentIndex];
        if (currentAnswer) {
          this.judgeAnswer = currentAnswer;
        } else {
          const { currentIndex, judgeAnswer } = this;
          this.recordJudgeAnswers({ currentIndex, judgeAnswer });
        }
    },
    async updatePaperAnswerIsCollect(isCollect) {
      let answerId = parseInt(this.answerId);
      let result = await reqUpdatePaperAnswerIsCollect(answerId, isCollect);
      if (result.statu == 0) {
        return true;
      } else {
        return false;
      }
    },
    clickCollect() {
      if (this.item.isCollect == "0") {
        this.item.isCollect = "1";
        if (this.updatePaperAnswerIsCollect("1")) {
          Toast({
            message: "收藏成功",
            duration: 1000,
            position: "bottom"
          });
        }
      } else {
        this.item.isCollect = "0";
        if (this.updatePaperAnswerIsCollect("0")) {
          Toast({
            message: "已取消收藏",
            duration: 1000,
            position: "bottom"
          });
        }
      }
    }
  },
  components: {
    HeaderTop
  },
  watch: {
    currentIndex() {
      sessionStorage.removeItem("currentIndex");
      sessionStorage.setItem("currentIndex", this.currentIndex);
    },
    judgeAnswer(val) {
      if (val != "") {
        this.judgeChange();      
      }
    },
  }
};
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
.judge_collection {
  width: 90%;
  padding-top: 45px;
  min-height: 900px;
  margin-left: 5%;

  .go_back {
    width: 40px;
  }

  .que {
    .content {
      height: 24px;
      line-height: 24px;

      > span {
        display: block;
      }
      .que_ans{
        margin-top 10px
        .green_answer{
          border 1px solid #00CD66
          color #00CD66
          margin-top 10px
          display inline-block
          padding 2px 8px
          margin 8px 10px 0 0
          border-radius 2px
          font-size 14px
        }
        .que_explain{
          margin 10px 0
        }
      }
      
      .que_content {
        line-height: 30px;
      }
    }
  }

  .paper_button {
    position: fixed;
    z-index: 100;
    left: 0;
    right: 0;
    bottom: 10%;
    width: 100%;
    display: flex;
    justify-content: space-evenly;

    .mint-button {
      width: 40%;
    }
  }
}
</style>
