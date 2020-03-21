<template>
  <section class="paper">
    <HeaderTop>
      <a href="javascript:" slot="left" class="go_back" @click="toBack">
        <i class="iconfont iconxiazai6"></i>
      </a>
    </HeaderTop>

    <mt-progress :value="timer" :bar-height="5"></mt-progress>

    <!--试卷问题及选项区域-->
    <div class="paper_container">
      <!--百里挑一列表-->
      <section
        class="que"
        v-for="(item, index) in singleQueList"
        :key="'single'+ item.singleId"
        v-show="index == currentIndex"
      >
        <div class="content">
          <span class="que_content">{{index + 1}}.&nbsp;{{item.singleContent}}</span>
          <img :src="item.pictureSrc" alt style="width: 100%" v-if="item.pictureSrc" />
          <mt-radio v-model="singleAnswer" :options="singleQueList[index].options"></mt-radio>
          <!-- <mu-radio :value="option.value" v-model="singleAnswer" :label="option.label" v-if="option.label" @change="singleChange"></mu-radio> -->
          <!-- </div> -->
          <radio></radio>
        </div>
      </section>

      <!--判断题分秒必争列表-->
      <section
        class="que"
        v-for="(item, index) in judgeQueList"
        :key="'judge'+ item.judgeId"
        v-show="(index + queNumInfo.singleNum) == currentIndex"
      >
        <div class="content">
          <span class="que_content">{{index + 1 + queNumInfo.singleNum}}.&nbsp;{{item.judgeContent}}</span>
          <mt-radio
            v-model="judgeAnswer"
            :options="[{value: 'T',label:'是'},{value: 'F',label:'否'}]"
          ></mt-radio>
        </div>
      </section>

      <!--填空题一承上启下列表-->
      <section
        class="que"
        v-for="(item, index) in fillQueList"
        :key="'fill'+ item.fillId"
        v-show="(index + queNumInfo.singleNum + queNumInfo.judgeNum) == currentIndex"
      >
        <div class="content">
          <span
            class="que_content"
          >{{index + 1 + queNumInfo.singleNum + queNumInfo.judgeNum}}.&nbsp;{{item.fillContent}}</span>
          <div class="fill_option">
            <mt-field v-model="fillAnswer" rows="3"></mt-field>
          </div>
        </div>
      </section>

      <!--填空题二画中有话列表-->
      <section
        class="que"
        v-for="(item, index) in fillTwoQueList"
        :key="'fillTwo'+ item.fillId"
        v-show="(index + queNumInfo.singleNum + queNumInfo.judgeNum + queNumInfo.fillNum) == currentIndex"
      >
        <div class="content">
          <span
            class="que_content"
          >{{index + 1 + queNumInfo.singleNum + queNumInfo.judgeNum + queNumInfo.fillNum}}.&nbsp;请填写下图所表达的诗句一句</span>
          <img :src="item.fillImgSrc" class="fill_img" />
          <div class="fill_option">
            <mt-field v-model="fillTwoAnswer" rows="3"></mt-field>
          </div>
        </div>
      </section>

      <!--上一题和下一题按钮-->
      <div class="paper_button">
        <mt-button type="primary" @click.native="preItem" :disabled="currentIndex < 1">
          {{currentIndex < 1 ? '无' :
          '上一题'}}
        </mt-button>
        <mt-button
          type="primary"
          @click.native="nextItem"
          v-if="currentIndex != queNumInfo.totalNum-1"
        >下一题</mt-button>
        <mt-button
          type="primary"
          @click.native="clickSubmit"
          v-if="currentIndex == queNumInfo.totalNum-1"
        >提交试卷</mt-button>
      </div>
    </div>
  </section>
</template>

<script>
import HeaderTop from "../../components/HeaderTop/HeaderTop.vue";
import { Toast, MessageBox, Indicator } from "mint-ui";
import {
  reqPapersInfoByPaperId,
  reqInsertStudentPaperScore,
  reqSubmitPaper
} from "@/api/exam";
import { getNumberPrefix } from "../../utils/common.js";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "",
  data() {
    return {
      userPhone: this.$store.state.userInfo.userPhone,
      //当前日期
      currentDate: new Date(),
      //路由传值paperId
      paperId: this.$route.params.paperId,
      //试卷信息
      paperInfo: {},
      //试卷问题类型数量
      queNumInfo: {},

      //初始化时间戳
      FirstCurrentTime: new Date().getTime(),
      timeUsed: 0, //考试花费时间
      timer: 0,
      //单选题数组
      singleQueList: [],
      //单选题答案
      singleAnswer: "",
      //判断题数组
      judgeQueList: [],
      //判断题答案
      judgeAnswer: "",
      //填空题数组
      fillQueList: [],
      //填空题答案
      fillAnswer: "",
      //填空题二数组
      fillTwoQueList: [],
      //填空题而答案
      fillTwoAnswer: "",
      
    };
  },
  computed: {
    ...mapState([
      "currentIndex", //当前题数
      "singleAnswers",
      //   "multipleAnswers",
      "judgeAnswers",
      "fillAnswers",
      "fillTwoAnswers",
      "firstCurrentTime"
    ]),
    ...mapGetters(["completeNumber"])
  },
  created() {
    Indicator.open({
      text: "加载中...",
      spinnerType: "fading-circle"
    });

    //加入callback回调函数保证在异步获取数据后执行this.countTime();
    this.getPaperInfoByPaperId(() => {
      //初始化state中单选题答案数组长度
      this.$store.dispatch(
        "initSingleAnswersLength",
        this.queNumInfo.singleNum
      );
      //初始化state中判断题答案数组长度
      this.$store.dispatch("initJudgeAnswersLength", this.queNumInfo.judgeNum);
      //初始化state中填空题答案数组长度
      this.$store.dispatch("initFillAnswersLength", this.queNumInfo.fillNum);
      //初始化state中填空题答案数组长度
      this.$store.dispatch(
        "initFillTwoAnswersLength",
        this.queNumInfo.fillTwoNum
      );

      //若vuex中state没被赋值过则将最先进入考试的开始时间存入vuex的state
      if (this.firstCurrentTime == 0) {
        //同步记录开始时间
        let firstCurrentTime = this.currentTime;
        this.recordFirstCurrentTime(firstCurrentTime);
        sessionStorage.removeItem("firstCurrentTime");
        sessionStorage.setItem("firstCurrentTime", firstCurrentTime);
      }

      //调用计时器方法，在试卷信息数据请求成功后获取考试时长开始计时
      this.countTime();

      //判断是否已经初始化插入数据到学生考试成绩表，防止刷新二次执行插入以及关闭浏览器二次插入数据
      if (
        !sessionStorage.getItem(
          "userPhone" + this.userPhone + "paperId" + this.paperId
        )
      ) {
        this.insertStudentPaperScore();
      }
    });
  },
  /*mounted() {
      // 挂载完成后，判断浏览器是否支持popstate
      if(window.history && window.history.pushState) {
        // 进入页面时给history压入一个本地的连接
        window.history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.toBack, false);
      }
    },
    destroyed() {
      window.removeEventListener('popstate', this.toBack, false);
    },*/
  methods: {
    ...mapActions([
      "nextQue", //点击下一题
      "prevQue", //点击上一题
      "cardQue", //点击答题卡序号
      "recordFirstCurrentTime", //记录当前花费时间
      "recordSingleAnswers", //记录单选题答案到数组，第一个参数为数组下标，第二个参数为当前下标的值
      //   "recordMultipleAnswers", //记录多选题答案到数组，第一个参数为数组下标，第二个参数为当前下标的值
      "recordJudgeAnswers", //记录判断题答案到数组，第一个参数为数组下标，第二个参数为当前下标的值
      "recordFillAnswers", //记录填空题答案到数组，第一个参数为数组下标，第二个参数为当前下标的值
      "recordFillTwoAnswers", //记录填空题二答案到数组，第一个参数为数组下标，第二个参数为当前下标的值
      "refreshCurrentIndex",
      "refreshSingleAnswers",
      //   "refreshMultipleAnswers",
      "refreshJudgeAnswers",
      "refreshFillAnswers",
      "refreshFillTwoAnswers",
      "refreshFirstCurrentTime"
    ]),
    //插入学生成绩表成绩信息，包含三个字段，考试开始时间、账号和试卷id
    async insertStudentPaperScore() {
      const { userPhone, paperId } = this;
      let result = await reqInsertStudentPaperScore({ userPhone, paperId });
      if (result.statu == 0) {
        sessionStorage.setItem(
          "userPhone" + this.userPhone + "paperId" + this.paperId,
          result.msg
        );
      } else {
        Toast({
          message: result.msg,
          duration: 1500
        });
      }
    },
    // 根据paperId获取试卷信息和问题数量信息
    async getPaperInfoByPaperId(callback) {
      const { paperId } = this;
      let result = await reqPapersInfoByPaperId({ paperId });
      if (result.statu == 0) {
        this.paperInfo = result.data.paperInfo;
        this.queNumInfo = result.data.queNumInfo;
        this.singleQueList = result.data.singleQueList;
        // this.multipleQueList = result.data.multipleQueList;
        this.judgeQueList = result.data.judgeQueList;
        this.fillQueList = result.data.fillQueList;
        this.fillTwoQueList = result.data.fillTwoQueList;
        Indicator.close();
        callback && callback();
      } else {
        Toast({
          message: result.msg,
          duration: 2000
        });
      }
    },
    //倒计时
    countTime() {
      //定义常量vm代表vue实例，指向当前this
      const vm = this,
        endTime = vm.paperInfo.paperDuration * 1000 + vm.firstCurrentTime, //firstCurrentTime即最先进入考试的时间
        currentTime = new Date().getTime(),
        restTime = endTime - currentTime,
        hours = getNumberPrefix(
          parseInt((restTime / (1000 * 60 * 60)) % 24, 10)
        ),
        minutes = getNumberPrefix(parseInt((restTime / (1000 * 60)) % 60, 10)),
        seconds = getNumberPrefix(parseInt((restTime / 1000) % 60, 10));
      vm.restTime = `${hours}:${minutes}:${seconds}`;

      vm.timer = setTimeout(function() {
        if (restTime > 0) {
          vm.countTime();
        } else if (restTime <= 0) {
          clearTimeout(vm.timer);
          Toast({
            message: "交卷时间已到，系统将帮您自动交卷",
            duration: 1000
          });
          setTimeout(() => {
            let result = vm.handleSubmit();
            if (result) {
              //等待成绩计算完毕并插入数据库表
              Indicator.open({
                text: "加载中...",
                spinnerType: "fading-circle"
              });
              setTimeout(() => {
                Indicator.close();
                //清除sessionStorage数据
                sessionStorage.removeItem("currentIndex");
                sessionStorage.removeItem("singleAnswers");
                // sessionStorage.removeItem("multipleAnswers");
                sessionStorage.removeItem("judgeAnswers");
                sessionStorage.removeItem("fillAnswers");
                sessionStorage.removeItem("fillTwoAnswers");
                sessionStorage.removeItem("firstCurrentTime");
                sessionStorage.removeItem(
                  "userPhone" + vm.userPhone + "paperId" + vm.paperId,
                  result.msg
                );
                //清除vuex数据
                vm.refreshCurrentIndex(0);
                vm.refreshSingleAnswers([]);
                // vm.refreshMultipleAnswers([]);
                vm.refreshJudgeAnswers([]);
                vm.refreshFillAnswers([]);
                vm.refreshFillTwoAnswers([]);
                vm.refreshFirstCurrentTime(0);
                vm.$router.replace("/exam/detail/" + vm.paperId);
              }, 3000);
            } else {
              Toast({
                message: "交卷失败，数据库错误，请重新开始考试",
                duration: 1500
              });
              vm.$router.replace("/exam/detail" + vm.paperId);
            }
          }, 2000);
        }
      }, 1000);
    },
    //用户手动点击提交试卷按钮，弹出确认框
    clickSubmit() {
      MessageBox.confirm("确定要提交试卷吗?").then(
        action => {
          let result = this.handleSubmit();
          if (result) {
            //等待成绩计算完毕并插入数据库表
            Indicator.open({
              text: "自动计算成绩中...",
              spinnerType: "double-bounce"
            });
            setTimeout(() => {
              Indicator.close();
              Toast({
                message: "提交成功",
                duration: 1500
              });
              //清除sessionStorage数据
              sessionStorage.removeItem("currentIndex");
              sessionStorage.removeItem("singleAnswers");
              //   sessionStorage.removeItem("multipleAnswers");
              sessionStorage.removeItem("judgeAnswers");
              sessionStorage.removeItem("fillAnswers");
              sessionStorage.removeItem("fillTwoAnswers");
              sessionStorage.removeItem("firstCurrentTime");
              sessionStorage.removeItem(
                "userPhone" + this.userPhone + "paperId" + this.paperId,
                result.msg
              );
              //清除vuex数据
              this.refreshCurrentIndex(0);
              this.refreshSingleAnswers([]);
              //   this.refreshMultipleAnswers([]);
              this.refreshJudgeAnswers([]);
              this.refreshFillAnswers([]);
              this.refreshFillTwoAnswers([]);
              this.refreshFirstCurrentTime(0);
              this.$router.replace("/exam/detail/" + this.paperId);
            }, 4000);
          } else {
            Toast({
              message: "交卷失败，数据库错误，请重新开始考试",
              duration: 1500
            });
            this.$router.replace("/exam/detail/" + this.paperId);
          }
        },
        () => {
          //点击取消按钮操作
        }
      );
    },
    //最终提交答案，包含用户手动点击提交按钮和到时自动提交
    async handleSubmit() {
      this.timeUsed = new Date().getTime() - this.firstCurrentTime;
      clearTimeout(this.timer);

      //将考试答案数据提交给后台
      const {
        userPhone,
        paperId,
        singleAnswers,
        judgeAnswers,
        fillAnswers,
        fillTwoAnswers,
        timeUsed
      } = this;
      let result = await reqSubmitPaper({
        userPhone,
        paperId,
        singleAnswers,
        judgeAnswers,
        fillAnswers,
        fillTwoAnswers,
        timeUsed
      });
      if (result.statu == 0) {
        //交卷成功
        /*//清除sessionStorage数据
          sessionStorage.removeItem("currentIndex");
          sessionStorage.removeItem("singleAnswers");
          sessionStorage.removeItem("multipleAnswers");
          sessionStorage.removeItem("judgeAnswers");
          sessionStorage.removeItem("judgeAnswers");
          sessionStorage.removeItem("fillAnswers");
          sessionStorage.removeItem("firstCurrentTime");
          sessionStorage.removeItem("sno" + this.sno + "paperId" + this.paperId, result.msg);
          //清除vuex数据
          this.refreshCurrentIndex(0);
          this.refreshSingleAnswers([]);
          this.refreshMultipleAnswers([]);
          this.refreshJudgeAnswers([]);
          this.refreshFillAnswers([]);
          this.refreshFillTwoAnswers([]);
          this.refreshFirstCurrentTime(0);*/
        // this.$router.replace("/exam/detail/" + this.paperId);
        return true;
      } else {
        return false;
      }
    },
    //点击上一题
    preItem() {
      this.singleAnswer = "";
      //   this.multipleAnswer = [];
      this.judgeAnswer = "";
      this.fillAnswer = "";
      this.fillTwoAnswer = "";
      this.prevQue();
      this.getCurrentAnswer();
    },
    //点击下一题
    nextItem() {
      this.singleAnswer = "";
      //   this.multipleAnswer = [];
      this.judgeAnswer = "";
      this.fillAnswer = "";
      this.fillTwoAnswer = "";
      this.nextQue();
      this.getCurrentAnswer();
    },
    //点击返回按钮
    toBack() {
      MessageBox.confirm("系统将自动提交试卷，请确认是否离开考试?").then(
        action => {
          //提交试卷
          let result = this.handleSubmit();
          Indicator.open({
            text: "加载中...",
            spinnerType: "fading-circle"
          });
          if (result) {
            setTimeout(() => {
              Indicator.close();
              //清除sessionStorage数据
              sessionStorage.removeItem("currentIndex");
              sessionStorage.removeItem("singleAnswers");
              // sessionStorage.removeItem("multipleAnswers");
              sessionStorage.removeItem("judgeAnswers");
              sessionStorage.removeItem("judgeAnswers");
              sessionStorage.removeItem("fillAnswers");
              sessionStorage.removeItem("firstCurrentTime");
              sessionStorage.removeItem(
                "userPhone" + this.userPhone + "paperId" + this.paperId,
                result.msg
              );
              //清除vuex数据
              this.refreshCurrentIndex(0);
              this.refreshSingleAnswers([]);
              // this.refreshMultipleAnswers([]);
              this.refreshJudgeAnswers([]);
              this.refreshFillAnswers([]);
              this.refreshFillTwoAnswers([]);
              this.refreshFirstCurrentTime(0);
              //返回试卷详情页面
              this.$router.isBack = true;
              this.$router.replace("/exam/detail/" + this.paperId);
            }, 3000);
          } else {
            Toast({
              message: "交卷失败，数据库错误，请重新开始考试",
              duration: 1500
            });
            this.$router.isBack = true;
            this.$router.replace("/exam/detail/" + this.paperId);
          }
        },
        () => {
          //点击取消按钮操作
        }
      );
    },
    /*touchToBack() {
        this.toBack()
        // 进入页面时压入的本地连接已消耗，重新给history压入一个本地的连接
        window.history.pushState(null, null, document.URL);
      },*/
    //单选题点击change事件
    singleChange() {
      const { currentIndex, singleAnswer } = this;
      this.recordSingleAnswers({ currentIndex, singleAnswer });
    },
    //判断题点击change事件
    judgeChange() {
      const { currentIndex, judgeAnswer } = this;
      this.recordJudgeAnswers({ currentIndex, judgeAnswer });
    },
    //填空题点击change事件
    fillChange() {
      const { currentIndex, fillAnswer } = this;
      this.recordFillAnswers({ currentIndex, fillAnswer });
    },
    //填空题er点击change事件
    fillTwoChange() {
      const { currentIndex, fillTwoAnswer } = this;
      this.recordFillTwoAnswers({ currentIndex, fillTwoAnswer });
    },
    //获取当前题目填写的答案
    getCurrentAnswer() {
      //获取单选题当前答案
      if (this.currentIndex < this.queNumInfo.singleNum) {
        const currentAnswer = this.singleAnswers[this.currentIndex];
        if (currentAnswer) {
          this.singleAnswer = currentAnswer;
        } else {
          const { currentIndex, singleAnswer } = this;
          this.recordSingleAnswers({ currentIndex, singleAnswer });
        }
      }
      //获取判断题当前答案
      else if (
        this.currentIndex <
        this.queNumInfo.singleNum + this.queNumInfo.judgeNum
      ) {
        const currentAnswer = this.judgeAnswers[
          this.currentIndex - this.queNumInfo.singleNum
        ];
        if (currentAnswer) {
          this.judgeAnswer = currentAnswer;
        } else {
          const { currentIndex, judgeAnswer } = this;
          this.recordJudgeAnswers({ currentIndex, judgeAnswer });
        }
      }
      //获取填空题当前答案
      else if (
        this.currentIndex <
        this.queNumInfo.singleNum +
          this.queNumInfo.judgeNum +
          this.queNumInfo.fillNum
      ) {
        const currentAnswer = this.fillAnswers[
          this.currentIndex -
            this.queNumInfo.singleNum -
            this.queNumInfo.judgeNum
        ];
        if (currentAnswer) {
          this.fillAnswer = currentAnswer;
        } else {
          const { currentIndex, fillAnswer } = this;
          this.recordFillAnswers({ currentIndex, fillAnswer });
        }
      }
      //填空题二
      else {
        const currentAnswer = this.fillTwoAnswers[
          this.currentIndex -
            this.queNumInfo.singleNum -
            this.queNumInfo.judgeNum -
            this.queNumInfo.fillNum
        ];
        if (currentAnswer) {
          this.fillTwoAnswer = currentAnswer;
        } else {
          const { currentIndex, fillTwoAnswer } = this;
          this.recordFillAnswers({ currentIndex, fillTwoAnswer });
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
    judgeAnswer(val) {
      if (val != "") {
        this.judgeChange();
      }
    },
    fillAnswer(val) {
      if (val != "") {
        this.fillChange();
      }
    },
    fillTwoAnswer(val) {
      if (val != "") {
        this.fillTwoChange();
      }
    },
    singleAnswers() {
      sessionStorage.removeItem("singleAnswers");
      sessionStorage.setItem(
        "singleAnswers",
        JSON.stringify(this.singleAnswers)
      );
    },
    judgeAnswers() {
      sessionStorage.removeItem("judgeAnswers");
      sessionStorage.setItem("judgeAnswers", JSON.stringify(this.judgeAnswers));
    },
    fillAnswers() {
      sessionStorage.removeItem("fillAnswers");
      sessionStorage.setItem("fillAnswers", JSON.stringify(this.fillAnswers));
    },
    fillTwoAnswers() {
      sessionStorage.removeItem("fillTwoAnswers");
      sessionStorage.setItem(
        "fillTwoAnswers",
        JSON.stringify(this.fillTwoAnswers)
      );
    }
  }
};
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixins.styl';

.paper {
  width: 100%;
  height: 800px;
  padding-top: 45px;

  .paper_sub_title_second {
    width: 100%;
    height: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    > span {
      display: inline-block;
      color: lightcoral;
    }

    .paper_clock {
      padding-left: 15px;

      .iconjishiqi {
        padding-right: 10px;
        color: #000;
      }
    }
  }

  .paper_container {
    width: 90%;
    margin: 15px auto;
    margin-bottom: 15px;

    .que {
      .content {
        height: 24px;
        line-height: 24px;

        > span {
          display: block;
        }

        .que_content {
          line-height: 30px;
        }
      }

      .fill_img {
        height: 140px;
        width: 100%;
      }

      .single_option, .judge_option, .fill_option {
        margin-top: 25px;
        margin-bottom: 25px;

        .mint-field {
          border: 1px solid #ccc;
          width: 70%;
          margin: 0 auto;
          border-radius: 10%;
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
}
</style>
