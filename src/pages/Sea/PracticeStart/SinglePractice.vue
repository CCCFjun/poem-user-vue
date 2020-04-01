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
      <mt-progress :value="timer" :bar-height="5"></mt-progress>
      <div class="content">
        <span class="que_content">{{index + 1}}.&nbsp;{{item.content}}</span>
        <img :src="item.pictureSrc" alt style="width: 100%" v-if="item.pictureSrc" />
        <mt-radio v-model="singleAnswer" :options="singleList[index].options" v-if="kindId != 14"></mt-radio>
        <div class="btn_group" v-else>
          <mt-button
            size="normal"
            v-for="(opItem, i) in singleList[index].options"
            :key="'op'+i"
            @click.native="matchAns(opItem.value, i)"
            :class="{'green_border':isRight[currentIndex] == 1&&btnChecked == i,'red_border':isRight[currentIndex] == 0&&btnChecked == i}"
          >{{opItem.label}}</mt-button>
        </div>
        <div v-if="ansShow[currentIndex]" class="que_ans">
          <i class="iconfont icon-gou1" v-if="isRight[currentIndex] == 1"></i>
          <i class="iconfont icon-cha" v-else></i>
        </div>
      </div>
    </section>
    <ResultPage v-if="isEnd" :result="isPass" :kindId="kindId" />
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
      btnChecked: -1
    };
  },
  computed: {},
  created() {
    Indicator.open({
      text: "加载中...",
      spinnerType: "fading-circle"
    });
    this.getSingleList(() => {
      this.countTime();
      this.isRight.length = this.queNum;
    });
  },
  methods: {
    countTime() {
      clearInterval(this.countdownInterval);
      this.countdownInterval = setInterval(() => {
        if (this.timer == 100) {
          //超时未作答
          clearInterval(this.countdownInterval);
          setTimeout(() => {
            this.currentIndex++;
            this.isEnd = true;
            this.isPass = "fail";
          }, 1000);
        }
        this.timer += 1;
      }, this.timerCount);
    },
    async getSingleList(callback) {
      switch (this.praLayer) {
        case "1":
          this.queNum = 3;
          this.timerCount = 80;
          break;
        case "2":
          this.queNum = 5;
          this.timerCount = 60;
          break;
        case "3":
          this.queNum = 10;
          this.timerCount = 40;
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
    matchAns(val, i){
      this.btnChecked = i
      this.$set(this.ansShow, this.currentIndex, 1)
        //回答正确
        if (val == this.singleList[this.currentIndex].singleAnswer) {
          this.$set(this.isRight, this.currentIndex, 1)
          clearInterval(this.countdownInterval); //清除当前题目计时器
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
          //回答错误，退出
          this.$set(this.isRight, this.currentIndex, 0)
          clearInterval(this.countdownInterval);
          setTimeout(() => {
            this.currentIndex++;
            this.isEnd = true;
            this.isPass = "fail";
          }, 1000);
        }
    },
    //点击下一题
    nextItem() {
      this.timer = 0;
      this.singleAnswer = "";
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
    singleAnswer(val) {
      if (val != "") {
        this.matchAns(val)
      }
    }
  }
};
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
.single_collection {
  width: 90%;
  padding-top: 45px;
  margin-left: 5%;

  .go_back {
    width: 40px;
  }

  .que {
    .content {
      height: 24px;
      line-height: 24px;
      font-size 16px
      > span {
        display: block;
      }

      .que_ans {
        margin: 30px 0 0 40%;

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

      .btn_group {
        margin-top: 20px;
        width: 180px;
        position: absolute;
        left: 50%;
        margin-left: -90px;

        .mint-button {
          width: 60px;
          height: 60px;
          font-size: 26px;
        }
        .green_border {
          border 1px solid #00CD66
        }
        .red_border {
          border 1px solid #FF0000
        }
      }
    }
  }
}
</style>
