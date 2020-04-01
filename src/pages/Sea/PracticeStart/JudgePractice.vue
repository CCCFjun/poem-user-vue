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
          <i class="iconfont icon-gou1" v-if="isRight[currentIndex] == 1"></i>
          <i class="iconfont icon-cha" v-else></i>
        </div>
      </div>
    </section>

    <ResultPage
      v-if="isEnd"
      :result="isPass"
      :kindId="kindId"
      :resultMsg="resultMsg"
    />
  </section>

</template>

<script>
import HeaderTop from "@/components/HeaderTop/HeaderTop.vue";
import ResultPage from "@/components/ResultPage/index.vue";
import { reqJudgePractice } from "@/api/practice";
import { Toast, Indicator, MessageBox } from "mint-ui";
export default {
  name: "",
  data() {
    return {
      judgeList: [],
      judgeAnswer: "",
      queNum: 0,
      kindId: this.$route.params.kindId,
      praLayer: this.$route.params.praLayer,
      ansShow: [],
      timer: 0,
      timerCount: 0,
      currentIndex: 0,
      isRight: [],
      isEnd: false,
      isPass: "",
      resultMsg: ""
    };
  },
  computed: {},
  created() {
    Indicator.open({
      text: "加载中...",
      spinnerType: "fading-circle"
    });
    this.getJudgeList(() => {
      this.countTime();
      this.isRight.length = this.queNum;
    });
  },
  methods: {
    countTime() {
      clearInterval(this.countdownInterval);
      this.countdownInterval = setInterval(() => {
        if(this.timer == 100){   //超时未作答
          clearInterval(this.countdownInterval);
          setTimeout(() => {
            this.currentIndex++
            this.isEnd = true
            this.isPass = "fail"
            this.resultMsg = "回答超时"
          }, 1000);
        }
        this.timer += 1;
      }, this.timerCount);
    },
    async getJudgeList(callback) {
      switch(this.praLayer){
        case '1': this.queNum = 3 
          this.timerCount = 70
          break
        case '2': this.queNum = 5
          this.timerCount = 50
          break
        case '3': this.queNum = 10
          this.timerCount = 30
          break
      }  
      const {queNum} = this
      let result = await reqJudgePractice({ queNum });
      if (result.statu == 0) {
        this.judgeList = result.data;
        // this.queNum = result.data.length;
        Indicator.close();
        callback && callback();
      } else {
        Toast({
          message: result.msg,
          duration: 1500
        });
      }
    },
    //点击下一题
    nextItem() {
      this.timer = 0;
      this.judgeAnswer = "";
      this.currentIndex++;
      if (this.timer == 0) {
        this.countTime();
      }
    },
    //点击返回按钮
    toBack() {
      MessageBox.confirm("退出此次练习?").then(
        action => {
          //详情页面
          this.$router.isBack = true;
          this.$router.replace("/sea/practice/detail/" + this.kindId);
        },
        () => {
          //点击取消按钮操作
        }
      );
    }
  },
  components: {
    HeaderTop,
    ResultPage
  },
  watch: {
    judgeAnswer(val) {
      if (val != "") {
        this.ansShow[this.currentIndex] = 1;
        //回答正确
        if (val == this.judgeList[this.currentIndex].judgeAnswer) {
          this.isRight[this.currentIndex] = 1;
          clearInterval(this.countdownInterval);   //清除当前题目计时器
          if(this.currentIndex == this.queNum-1){
            setTimeout(() => {    //全部回答正确
              this.currentIndex++
              this.isEnd = true
              this.isPass = "pass"
            }, 1000);
          }else{
            setTimeout(() => {    //1s后进入下一题
              this.nextItem();
            }, 1000);
          }  
        } else {          //回答错误，退出
          this.isRight[this.currentIndex] = 0;
          clearInterval(this.countdownInterval);
          setTimeout(() => {
            this.currentIndex++
            this.isEnd = true
            this.isPass = "fail"
            this.resultMsg = "回答错误"
          }, 1000);
        }
          
      }
    }
  }
}
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
.judge_collection 
  width: 90%;
  padding-top: 45px;
  margin-left: 5%;
  .go_back 
    width: 40px
  .que 
    .content 
      font-size 16px
      height: 24px;
      line-height: 24px;
      z-index 2
      >span 
        display: block;
      .que_ans 
        margin: 30px 0 0 40%;
        .iconfont 
          font-size: 34px;
        .icon-gou1 
          color: #00CD66;
        .icon-cha 
          color: #FF0000;
      .que_content 
        line-height: 30px;
  .pass_icon
    z-index 1
</style>
