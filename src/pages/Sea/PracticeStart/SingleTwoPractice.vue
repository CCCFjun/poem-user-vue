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
      <!-- <mt-progress :value="timer" :bar-height="5"></mt-progress> -->
      <div class="count_down">{{timer}}</div>
      <div class="content">
        <span class="que_content">{{index + 1}}.&nbsp;{{item.content}}</span>
        <div class="tip_group">
          <div v-if="showTip[0] == 1">{{singleList[index].options[0].label}}</div>
          <div v-if="showTip[1] == 1">{{singleList[index].options[1].label}}</div>
          <div v-if="showTip[2] == 1">{{singleList[index].options[2].label}}</div>
        </div>
        <div class="fill_answer">
          <mt-field v-model="singleAnswer" rows="3"></mt-field>
        </div>
        <div class="que_match">
          <mt-button @click="matchAns(currentIndex)">确定</mt-button>
        </div>
        <div v-if="ansShow[currentIndex]" class="que_ans">
          <i class="iconfont icon-gou1" v-if="isRight[currentIndex] == 1"></i>
          <i class="iconfont icon-cha" v-else></i>
        </div>
      </div>
    </section>
    <ResultPage v-if="isEnd" :result="isPass" :kindId="kindId"/>
  </section>
</template>

<script>
import HeaderTop from "@/components/HeaderTop/HeaderTop.vue";
import ResultPage from "@/components/ResultPage/index.vue";
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
      praLayer: this.$route.params.praLayer,
      ansShow: [],
      timer: 0,
      timerCount: 0,
      currentIndex: 0,
      isRight: [],
      isEnd: false,
      isPass: "",
      showTip: [],
      count: 0,
      flagCount: 0
    };
  },
  computed: {},
  created() {
    Indicator.open({
      text: "加载中...",
      spinnerType: "fading-circle"
    });
    this.getSingleList(() => {
      this.$set(this.showTip,0,1)
      this.countTime();
      this.isRight.length = this.queNum;
    });
  },
  methods: {
    countTime() {
      clearInterval(this.countdownInterval);
      this.countdownInterval = setInterval(() => {
        this.timer--
        this.count++
        if(3*this.count == this.timerCount){
          this.$set(this.showTip,1,1)
          this.flagCount = this.count
        }
        if(this.count + this.flagCount == this.timerCount){
          this.$set(this.showTip,2,1)  
        }
        if (this.timer == 0) {
          //超时未作答
          clearInterval(this.countdownInterval);
          setTimeout(() => {
            this.currentIndex++;
            this.isEnd = true;
            this.isPass = "fail";
          }, 1000);
        }
      }, 1000);
    },
    async getSingleList(callback) {
      switch (this.praLayer) {
        case "1":
          this.queNum = 3;
          this.timerCount = 30;
          this.timer = this.timerCount
          break;
        case "2":
          this.queNum = 5;
          this.timerCount = 24;
          this.timer = this.timerCount
          break;
        case "3":
          this.queNum = 10;
          this.timerCount = 15;
          this.timer = this.timerCount
          break;
      }
      const { queNum, kindId } = this;
      let result = await reqSinglePractice({ queNum, kindId });
      if (result.statu == 0) {
        this.singleList = result.data;
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
    //判断答案
    matchAns(i){
      this.$set(this.ansShow, this.currentIndex, 1)
        //回答正确
        if (this.singleAnswer == this.singleList[this.currentIndex].singleAnswer) {
          this.$set(this.isRight, this.currentIndex, 1)
          clearInterval(this.countdownInterval); //清除当前题目计时器
          console.log(this.queNum)
          if (this.currentIndex == this.queNum - 1) {
            setTimeout(() => {
              //全部回答正确
              this.currentIndex++;
              this.isEnd = true;
              this.isPass = "pass";
            }, 1000);
          } else {
            setTimeout(() => {
              //1s后进入下一题
              this.nextItem();
            }, 1000);
          }
        } else {
          //回答错误，
          this.$set(this.isRight, this.currentIndex, 0)
        }
    },
    //点击下一题
    nextItem() {
      this.timer = this.timerCount
      this.singleAnswer = "";
      this.currentIndex++;
      this.showTip[1] = 0
      this.showTip[2] = 0
      this.flagCount = 0
      this.count = 0
      this.countTime();
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
.single_collection {
  width: 90%;
  padding-top: 45px;
  min-height: 900px;
  margin-left: 5%;

  .go_back {
    width: 40px;
  }

  .que {
    .count_down{
      width 40px
      height 40px
      font-size 26px
      color #00CD66
      margin 0 auto
    }
    
    .content {
      height: 24px;
      line-height: 24px;
      text-align center
      > span {
        display: block;
      }

      .que_ans {

        .iconfont {
          font-size: 34px;
        }

        .icon-gou1 {
          color: #00CD66;
        }

        .icon-cha {
          color: #FF0000;
        }

        .green_answer {
          border: 1px solid #00CD66;
          color: #00CD66;
          margin-top: 10px;
          display: inline-block;
          padding: 2px 8px;
          margin: 8px 10px 0 0;
          border-radius: 2px;
          font-size: 14px;
        }

        .que_explain {
          margin: 10px 0;
        }
      }

      .que_content {
        line-height: 30px;
      }

      .tip_group {
        margin 0 auto
        height 300px
        >div {
          width 50%
          margin 0 auto
          font-size: 24px;
          text-align center
          border 1px solid #ccc
          border-radius 50%
          margin-top 10px
          padding 10px 0
        }
      }
      .fill_answer{
        margin-bottom: 25px;
        .mint-field {
          border: 1px solid #ccc;
          width: 70%;
          margin: 0 auto;
          border-radius: 10%;
        }
      }
    }
  }
}
</style>
