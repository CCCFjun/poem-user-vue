<template>
  <section class="profile_feedback">
    <van-nav-bar title="反馈留言" left-arrow @click-left="$router.goBack()" />

    <div class="profile_feedback_field">
      <!-- <div class="feedback_current_time">{{currentDate | date-format}}</div> -->
      <van-field
        v-model="feedback"
        rows="9"
        autosize
        label="留言"
        type="textarea"
        maxlength="150"
        placeholder="请输入留言"
        show-word-limit
      />
      <i
        class="iconfont iconbiaoqing"
        id="emotionBtn"
        @click="clickEmotion"
        :style="{ color: showEmotion ? '#6ba7f0' : '' }"
      ></i>
      <!-- <mt-button type="primary" size="large" @click="sendFeedback"
        >发送</mt-button
      > -->
      <van-button class="btn" @click="sendFeedback">发送</van-button>
    </div>
    <div
      v-show="showEmotion"
      id="emotionDiv"
      style="
        z-index: 999;
        background-color: #ffffff;
        position: relative;
        top: 5px;
      "
    >
      <emotion @emotion="handleEmotion" :height="295"></emotion>
    </div>
  </section>
</template>

<script>
import HeaderTop from "../../components/HeaderTop/HeaderTop.vue";
import Emotion from "../../components/Emotion/index.vue";
import { reqSendFeedback } from "@/api/mine";
import { Toast, MessageBox } from "mint-ui";
export default {
  name: "",
  data() {
    return {
      userPhone: this.$store.state.userInfo.userPhone,
      currentDate: new Date(),
      feedback: "",
      showEmotion: false,
    };
  },
  mounted() {
    document.addEventListener("click", (e) => {
      if (!$(e.target).closest("#emotionBtn,#emotionDiv").length) {
        this.showEmotion = false;
      }
    });
  },
  methods: {
    async sendFeedback() {
      const { userPhone, feedback } = this;
      let result = await reqSendFeedback({ userPhone, feedback });
      if (result.statu == 0) {
        Toast({
          message: result.msg,
          iconClass: "iconfont iconunie045",
          duration: 1500,
        });
        this.$router.push("/profile");
      } else if (result.msg == "会话失效，请重新登录") {
        MessageBox.confirm("会话失效，是否重新登录？").then(
          (action) => {
            //点击确定按钮操作
            //清空sessionStorage会话
            sessionStorage.clear();
            // 请求退出
            this.$store.dispatch("logout");
            Toast("请重新登录系统");
            this.$router.push("/login");
          },
          () => {
            //点击取消按钮操作
          }
        );
      } else {
        Toast({
          message: result.msg,
          position: "bottom",
          duration: 1500,
        });
      }
    },
    clickEmotion() {
      this.showEmotion = !this.showEmotion;
    },
    handleEmotion(i) {
      this.feedback += i;
    },
    // 将匹配结果替换表情图片
    emotion(res) {
      let word = res.replace(/\#|\;/gi, "");
      const list = [
        "微笑",
        "撇嘴",
        "色",
        "发呆",
        "得意",
        "流泪",
        "害羞",
        "闭嘴",
        "睡",
        "大哭",
        "尴尬",
        "发怒",
        "调皮",
        "呲牙",
        "惊讶",
        "难过",
        "酷",
        "冷汗",
        "抓狂",
        "吐",
        "偷笑",
        "可爱",
        "白眼",
        "傲慢",
        "饥饿",
        "困",
        "惊恐",
        "流汗",
        "憨笑",
        "大兵",
        "奋斗",
        "咒骂",
        "疑问",
        "嘘",
        "晕",
        "折磨",
        "衰",
        "骷髅",
        "敲打",
        "再见",
        "擦汗",
        "抠鼻",
        "鼓掌",
        "糗大了",
        "坏笑",
        "左哼哼",
        "右哼哼",
        "哈欠",
        "鄙视",
        "委屈",
        "快哭了",
        "阴险",
        "亲亲",
        "吓",
        "可怜",
        "菜刀",
        "西瓜",
        "啤酒",
        "篮球",
        "乒乓",
        "咖啡",
        "饭",
        "猪头",
        "玫瑰",
        "凋谢",
        "示爱",
        "爱心",
        "心碎",
        "蛋糕",
        "闪电",
        "炸弹",
        "刀",
        "足球",
        "瓢虫",
        "便便",
        "月亮",
        "太阳",
        "礼物",
        "拥抱",
        "强",
        "弱",
        "握手",
        "胜利",
        "抱拳",
        "勾引",
        "拳头",
        "差劲",
        "爱你",
        "NO",
        "OK",
        "爱情",
        "飞吻",
        "跳跳",
        "发抖",
        "怄火",
        "转圈",
        "磕头",
        "回头",
        "跳绳",
        "挥手",
        "激动",
        "街舞",
        "献吻",
        "左太极",
        "右太极",
      ];
      let index = list.indexOf(word);
      return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" style="position: relative;top: 4px">`;
    },
  },
  components: {
    HeaderTop,
    Emotion,
  },
};
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
.profile_feedback {
  .profile_feedback_field {
    position: relative;

    .feedback_current_time {
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #999;
      font-size: 14px;
    }

    .iconbiaoqing {
      z-index: 999;
      font-size: 30px;
      position: absolute;
      right: 15px;
      bottom: 45px;
    }

    .mint-button {
      background-color: #fff;
      margin-top: 15px;
      margin-bottom: 15px;
      color: #B22222;
      border: 1px solid #B22222;
      width: 70%;
      margin-left: 15%;
    }
  }
}
</style>
// <style lang='scss' scoped>
// .btn {
//   width: 9rem;
//   height: 1.1rem;
//   margin: 0 auto;
//   /* margin-top: 0.72rem; */
//   margin-bottom: 0.3rem;
//   text-align: center;
//   line-height: 1.1rem;
//   font-size: 0.45rem;
//   color: #fff;
//   border-radius: 0.6rem;
//   background-color: #99ffcc;
//   background-image: linear-gradient(90deg, #90ee90, #99ffcc);
// }
// </style>
