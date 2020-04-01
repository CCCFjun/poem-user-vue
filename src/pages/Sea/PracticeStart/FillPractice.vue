<template>
  <section class="fill_collection">
    <HeaderTop>
      <a href="javascript:" slot="left" class="go_back" @click="toBack">
        <i class="iconfont iconfanhui"></i>
      </a>
    </HeaderTop>

    <section
      class="que"
      v-for="(item, index) in fillList"
      :key="'fill'+ item.fillId"
      v-show="index == currentIndex"
    >
      <mt-progress :value="timer" :bar-height="5"></mt-progress>
      <div class="content">
        <span class="que_content">{{index + 1}}.&nbsp;{{item.content}}</span>
        <img :src="item.fillImgSrc" alt style="width: 100%" v-if="item.fillImgSrc" />
        <div class="fill_option">
          <mt-field v-model="fillAnswer" rows="3"></mt-field>
        </div>
        <mt-button class="que_match" @click="matchAnswer(currentIndex)">提交答案</mt-button>
        <div class="que_ans" v-if="ansShow[currentIndex]">
          <i class="iconfont icon-gou1" v-if="isRight[currentIndex] == 1"></i>
          <i class="iconfont icon-cha" v-else></i>
        </div>
      </div>
    </section>

    <ResultPage
      v-if="isEnd"
      :result="isPass"
      :kindId="kindId"
    />
  </section>
</template>

<script>
import HeaderTop from "@/components/HeaderTop/HeaderTop.vue";
import ResultPage from "@/components/ResultPage/index.vue";
import { reqFillPractice, reqFillTwoPractice } from "@/api/practice";
import { Toast, Indicator, MessageBox } from "mint-ui";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "",
  data() {
    return {
      fillList: [],
      fillAnswer: "",
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
    };
  },
  computed: {

  },
  created() {
    Indicator.open({
      text: "加载中...",
      spinnerType: "fading-circle"
    });
    this.getFillList(() => {
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
            this.currentIndex++    //隐藏题目
            this.isEnd = true
            this.isPass = "fail"
          }, 1000);
        }
        this.timer += 1;
      }, this.timerCount);
    },
    async getFillList(callback) {
      switch(this.praLayer){
        case '1': this.queNum = 3 
          this.timerCount = 120
          break
        case '2': this.queNum = 5
          this.timerCount = 100
          break
        case '3': this.queNum = 10
          this.timerCount = 80
          break
      }  
      const {queNum} = this
      let result
      if(this.kindId == 10){
        result = await reqFillPractice({ queNum });
      }else{
        result = await reqFillTwoPractice({ queNum });
      }
      if (result.statu == 0) {
        this.fillList = result.data;
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
      this.fillAnswer = "";
      this.currentIndex++;
      if (this.timer == 0) {
        this.countTime();
      }
    },
    matchAnswer(currentIndex){
      this.$set(this.ansShow, currentIndex, 1)
      // this.ansShow[currentIndex] = 1;
      if(this.fillAnswer === this.fillList[currentIndex].fillAnswer){
        this.isRight[this.currentIndex] = 1;
        clearInterval(this.countdownInterval);
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
      }else{
        this.isRight[this.currentIndex] = 0;
        clearInterval(this.countdownInterval);
        setTimeout(() => {
          this.currentIndex++
          this.isEnd = true
          this.isPass = "fail"
        }, 1000);
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

  }
};
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
.fill_collection 
  width: 90%;
  padding-top: 40px;
  margin-left: 5%;
  .go_back 
    width: 40px;
  .que 
    .content 
      font-size 16px 
      height: 24px;
      line-height: 24px;
      text-align center
      > span 
        display: block;  
      img 
        height 140px
      .que_ans 
        margin-top 30px;
        .iconfont 
          font-size: 34px;
        .icon-gou1 
          color: #00CD66;
        .icon-cha 
          color: #FF0000;      
      .fill_option 
        margin-top: 25px;
        margin-bottom: 25px;
        .mint-field 
          border: 1px solid #ccc;
          width: 70%;
          margin: 0 auto;
          border-radius: 10%;
</style>
