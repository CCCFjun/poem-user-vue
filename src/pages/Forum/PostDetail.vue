<template>
  <section class="post_detail">
    <HeaderTop>
      <a href="javascript:" slot="left" class="go_back" @click="$router.goBack()">
        <i class="iconfont iconxiazai6"></i>返回
      </a>
    </HeaderTop>
    <div class="detail">
      <div class="user_info">
        <div class="user_img">
          <img
            :src="userInfo.userImgSrc ? userInfo.userImgSrc : require('@/common/imgs/profile.jpg')"
            alt="用户头像"
          />
        </div>
        <div class="name_time">
          <p class="user_name">{{userInfo.userName}}</p>
          <p class="user_time">
            <span>{{initTime | date-format}}</span>
          </p>
        </div>
      </div>
      <div class="post_title">{{title}}</div>
      <div class="post_content"><pre>{{content}}</pre></div>
    </div>

    <div class="replay_list" v-for="item in replayList" :key="item.rid">
        <div class="user_img">
          <img
            :src="item.userInfo[0].userImgSrc ? item.userInfo[0].userImgSrc : require('@/common/imgs/profile.jpg')"
            alt="用户头像"
          />
        </div>
        <div class="replay_right">
          <div class="user_name">{{item.userInfo[0].userName}}</div>
          <div class="post_content"><pre>{{item.content}}</pre></div>
          <div class="user_time">{{item.initTime | date-format}}</div>
        </div>
      
    </div>
    <div class="add_replay" @click="toAddReplay">
      <i class="iconfont icon-xiaoxi"></i>
      <span>写评论</span>
    </div>
  </section>
</template>

<script>
import HeaderTop from "@/components/HeaderTop/HeaderTop.vue";
import { reqGetPostDetailByPid, reqGetReplayByPid } from "@/api/forum";
import { reqGetUserDetailByUserp } from "@/api/mine";
export default {
  name: "",
  data() {
    return {
      pid: this.$route.params.pid,
      userPhone: this.$route.params.userPhone,
      userInfo: [],
      initTime: "",
      title: "",
      content: "",
      replayList: []
    };
  },
  created() {
    this.getPostDetailByPid();
    this.getUserDetail();
    this.getReplayList();
  },
  methods: {
    async getPostDetailByPid() {
      const { pid } = this;
      let result = await reqGetPostDetailByPid({ pid });
      if (result.statu == 0) {
        this.initTime = result.data.initTime;
        this.title = result.data.title;
        this.content = result.data.content;
      } else {
        Toast({
          message: result.msg,
          duration: 2000
        });
      }
    },
    async getUserDetail() {
      const { userPhone } = this;
      let result = await reqGetUserDetailByUserp({ userPhone });
      if (result.statu == 0) {
        this.userInfo = result.data;
      } else {
        Toast({
          message: result.msg,
          duration: 2000
        });
      }
    },
    async getReplayList() {
      const { pid } = this;
      let result = await reqGetReplayByPid({ pid });
      if (result.statu == 0) {
        this.replayList = result.data.list;
      } else {
        Toast({
          message: result.msg,
          duration: 2000
        });
      }
    },
    toAddReplay() {
      this.$router.push("/forum/addReplay/" + this.pid);
    }
  },
  components: {
    HeaderTop
  }
};
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
.post_detail {
  width: 90%;
  padding-top: 45px;
  margin-left: 5%;

  .detail{
    border-bottom: 1px solid #ccc;
    margin-top: 10px;
    letter-spacing: 1px;
    font-size: 18px;
    line-height 22px
    .user_info {
      display: flex;

      img {
        width: 60px;
        height: 60px;
        border-radius: 10%;
      }

      .name_time {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding-left: 20px;

        .user_name {
          font-size: 18px;
        }

        .user_time {
          color: #8B8989;
          font-size: 14px;
        }
      }
    }

    .post_title {
      margin-top: 20px;
      font-size: 22px;
      font-weight: bold;
    }

    .post_content {
      margin: 20px 0;
    }
  }
  .replay_list{
    border-bottom: 1px solid #ccc;
    margin-top: 10px;
    letter-spacing: 1px;
    display: flex;
      img {
        width: 50px;
        height: 50px;
        border-radius: 10%;
      }

      .replay_right {
        font-size: 18px;
        margin-left 20px
        line-height 30px
        .user_name{
          color: #8B8989;
          font-size: 14px;
        }
        .user_time{
          color: #8B8989;
          font-size: 14px;
        }
      }
      
    

    
  }

  .add_replay {
    height: 50px;
    width: 100%;
    line-height: 50px;
    position: fixed;
    bottom: 0;
    left: 0;
    border-top: 1px solid #ccc;

    .iconfont {
      margin-left: 5%;
      color: #ff0000;
    }

    span {
      margin-left: 5%;
      color: #8B8989;
    }
  }
}
</style>