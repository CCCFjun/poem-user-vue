<template>
  <section class="single_collection">
    <HeaderTop>
      <a href="javascript:" slot="left" class="go_back" @click="toBack">
        <i class="iconfont iconfanhui"></i>
      </a>
    </HeaderTop>

    <section
      class="que"
      v-for="(item, index) in singleList"
      :key="'single'+ item.singleId"
      v-show="index == currentIndex"
    >
      
      <div class="content">
        <span class="que_content">{{index + 1}}.&nbsp;{{item.content}}</span>
        <img :src="item.pictureSrc" alt style="width: 100%" v-if="item.pictureSrc" />
        <mt-radio v-model="singleAnswer" :options="singleList[index].options"></mt-radio>
        <div v-if="ansShow[currentIndex]" class="que_ans">
          <span class="green_answer">正确答案</span>{{item.singleAnswer}}
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
import { reqSinglePractice } from "@/api/practice";
import { Toast, Indicator, MessageBox } from "mint-ui";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "",
  data() {
    return {
      singleList: [],
      singleAnswer: "",
      queNum: 0,
      kindId: this.$route.params.kindId,
      ansShow: [],
    };
  },
  computed: {
    ...mapState([
      "currentIndex", //当前题数
      "singleAnswers"
    ])
  },
  created() {
    Indicator.open({
      text: "加载中...",
      spinnerType: "fading-circle"
    });
    this.getSingleList(() => {
      this.$store.dispatch("initSingleAnswersLength", this.queNum);
    });
  },
  methods: {
    ...mapActions([
      "nextQue", //点击下一题
      "prevQue", //点击上一题
      "recordSingleAnswers", //记录单选题答案到数组，第一个参数为数组下标，第二个参数为当前下标的值
      "refreshCurrentIndex",
      "refreshSingleAnswers"
    ]),
    async getSingleList(callback) {
      let result = await reqSinglePractice();
      if (result.statu == 0) {
        this.singleList = result.data;
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
      this.singleAnswer = "";
      this.prevQue();
      this.getCurrentAnswer();
    },
    //点击下一题
    nextItem() {
      this.singleAnswer = "";
      this.nextQue();
      this.getCurrentAnswer();
    },
    //点击返回按钮
    toBack() {
      MessageBox.confirm("退出此次练习?").then(
        action => {
          //清除sessionStorage数据
          sessionStorage.removeItem("currentIndex");
          sessionStorage.removeItem("singleAnswers");
          //清除vuex数据
          this.refreshCurrentIndex(0);
          this.refreshSingleAnswers([]);
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
          sessionStorage.removeItem("singleAnswers");
          //清除vuex数据
          this.refreshCurrentIndex(0);
          this.refreshSingleAnswers([]);
          //详情页面
          this.$router.isBack = true;
          this.$router.replace("/sea/practice/detail/" + this.kindId);
    },
    //单选题点击change事件
    singleChange() {
      const { currentIndex, singleAnswer } = this;
      this.recordSingleAnswers({ currentIndex, singleAnswer });
      if(this.singleAnswers[currentIndex]!=null){
          this.ansShow[currentIndex] = 1
      }
    },
    getCurrentAnswer() {
        const currentAnswer = this.singleAnswers[this.currentIndex];
        if (currentAnswer) {
          this.singleAnswer = currentAnswer;
        } else {
          const { currentIndex, singleAnswer } = this;
          this.recordSingleAnswers({ currentIndex, singleAnswer });
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
    singleAnswer(val) {
      if (val != "") {
        this.singleChange();
      }
    },
  }
};
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
.single_collection {
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
