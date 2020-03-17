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
  </section>
</template>

<script>
import HeaderTop from "@/components/HeaderTop/HeaderTop.vue";
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
      ansShow: [],
      timer: 0,
      currentIndex: 0,
      isRight: []
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
        if (this.timer === 100 && this.currentIndex < this.queNum - 1) {
          this.nextItem();
        }
        this.timer += 1;
      }, 50);
      //   const vm = this
      //   if(vm.timer < 100){
      //     setTimeout(()=>{
      //       vm.timer += 1
      //       this.countTime()
      //     },50)
      //   }else{
      //     if(this.currentIndex < this.queNum-1){
      //       this.nextItem()
      //     }
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
    HeaderTop
  },
  watch: {
    judgeAnswer(val) {
      if (val != "") {
        this.ansShow[this.currentIndex] = 1;
        if (val == this.judgeList[this.currentIndex].judgeAnswer) {
          this.isRight[this.currentIndex] = 1;
          clearInterval(this.countdownInterval);
          setTimeout(() => {
            this.nextItem();
          }, 1000);
        } else {
          this.isRight[this.currentIndex] = 0;
          clearInterval(this.countdownInterval);
          MessageBox.alert("回答错误，退出此次练习").then(
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
      }
    }
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

      >span {
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
      }

      .que_content {
        line-height: 30px;
      }
    }
  }
}
</style>
