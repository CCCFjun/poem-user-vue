<template>
  <section class="posts">
    <!--利用$router.back()返回上一级路由 -->
    <HeaderTop title="百家">
      <div class="header_message" slot="right" @click="showAction">
        <i class="iconfont icon-hao"></i>
      </div>
    </HeaderTop>

    <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>

    <ly-tab v-model="selectedLabId" :items="items" :options="options" @change="clickTab"></ly-tab>

    <div class="label_container">
      <mt-loadmore :top-method="loadTop" ref="loadmore">
          <div class="post_list" v-for="(item, index) in showPostList" :key="item.pid" @click="toPostDetail(item.pid, item.userInfo[0].userPhone)">
            <div class="user_info">
              <div class="user_img">
                <img
                  :src="item.userInfo[0].userImgSrc ? item.userInfo[0].userImgSrc : require('@/common/imgs/profile.jpg')"
                  alt="用户头像"
                />
              </div>
              <div class="name_time">
                <p class="user_name">{{item.userInfo[0].userName}}</p>
                <p class="user_time">
                  <span>{{item.initTime | date-format}}</span>
                </p>
              </div>
            </div>
            <div class="post_title">{{item.title}}</div>
            <div class="post_content"><pre>{{item.content}}</pre></div>
            <div class="post_opt">
              <i class="iconfont icon-xiaoxi"></i><span v-if="item.replayCount != 0">{{item.replayCount}}</span>
              <!-- <i :class="{'iconfont':isLike[index], 'icon-like-chose':isLike[index]==1, 'icon-xihuan':isLike[index]==0}" @click.stop="clickLike(item.pid)"></i> -->
              <i v-if="isLike[index]==1" class="iconfont icon-like-chose" @click.stop="clickLike(item.pid, index)"></i>
              <i v-else class="iconfont icon-xihuan" @click.stop="clickLike(item.pid ,index)"></i>
              <span v-if="likeCount[index] != 0">{{likeCount[index]}}</span>
            </div>
          </div>
      </mt-loadmore>

      <back-to-top
        :custom-style="myBackToTopStyle"
        :visibility-height="300"
        :back-position="0"
        transition-name="fade"
      />
    </div>
  </section>
</template>

<script>
import HeaderTop from "../../components/HeaderTop/HeaderTop.vue";
import BackToTop from "../../components/BackToTop";
import { reqGetPostList, reqGetLabelList, reqUpdateLikePost, reqGetAllLikePostOnlyPid } from "@/api/forum";
import { Toast, Actionsheet } from "mint-ui";
import Star from "../../components/Star/Star.vue";
import { mapState } from "vuex";
export default {
  name: "",
  data() {
    let that = this;
    return {
      actions: [
        {
          name: "题目贴",
          method: that.toPostProblem
        },
        {
          name: "闲话贴",
          method: that.toPostTalk
        }
      ],
      myBackToTopStyle: {
        right: "16px",
        bottom: "66px",
        width: "40px",
        height: "40px",
        "border-radius": "4px",
        "line-height": "45px", // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: "#e7eaf1" // 按钮的背景颜色 The background color of the button
      },
      sheetVisible: false,
      postOneList: [],
      postTwoList: [],
      postAllList: [],
      showPostList: [],
      haveLikeList: [],
      isLike: [],
      likeCount: [],
      selectedLabId: 0,
      items: [],
      options: {
        activeColor: "#1d98bd",
        // 可在这里指定labelKey为你数据里文字对应的字段
        labelKey: "labelName"
      }
    };
  },
  computed: {},
  created() {
    this.getPostList(()=>{
      this.getAllLikePost()
    })
    this.getPostLabelList()
    
  },
  methods: {
    async getPostList(callback) {
      let result = await reqGetPostList();
      if (result.statu == 0) {
        this.postOneList = result.data.onePostData;
        this.postTwoList = result.data.twoPostData;
        this.postAllList = result.data.allPostData;
        this.showPostList = this.postAllList;
        this.isLike.length = this.postAllList.length
        this.likeCount.length = this.postAllList.length
        callback && callback()
      } else {
        Toast({
          message: result.msg,
          duration: 2000
        });
      }
    },
    async getPostLabelList() {
      let result = await reqGetLabelList();
      if (result.statu == 0) {
        this.items = result.data;
        this.items.unshift({ lid: 0, labelName: "全部" });
      } else {
        Toast({
          message: result.msg,
          duration: 2000
        });
      }
    },
    async getAllLikePost() {
      let userPhone = this.$store.state.userInfo.userPhone
      let result = await reqGetAllLikePostOnlyPid( {userPhone});
      if (result.statu == 0) {
        this.haveLikeList = result.data
        for(let i=0; i<this.isLike.length; i++){
          if(this.haveLikeList.indexOf(this.postAllList[i].pid) != -1){
            this.$set(this.isLike, i, 1)
          }else{
            this.$set(this.isLike, i, 0)
          }
          this.likeCount[i] = this.postAllList[i].good
        }
      } else {
        Toast({
          message: result.msg,
          duration: 2000
        });
      }
    },
    async clickLike(pid, i){
      let userPhone = this.$store.state.userInfo.userPhone
      let result = await reqUpdateLikePost( {pid, userPhone} )
      if(this.isLike[i] == 1){
        this.$set(this.isLike, i, 0)
        this.$set(this.likeCount, i, this.likeCount[i]-1)
      }else{
        this.$set(this.isLike, i, 1)
        this.$set(this.likeCount, i, this.likeCount[i]+1)
      }
    },
    clickTab(item, index) {
      if (item.lid == 0) {
        this.showPostList = this.postAllList;
      } else if (item.lid == 1) {
        this.showPostList = this.postOneList;
      } else {
        this.showPostList = this.postTwoList;
      }
    },
    loadTop() {
      this.getPostList()
      setTimeout(() => {
        this.$refs.loadmore.onTopLoaded()
      }, 1000)
    },
    toPostDetail(pid, userPhone) {
      if (!this.$store.state.userInfo.userPhone) {
        Toast({
          message: "请先登录系统",
          duration: 1000
        });
        return;
      } else {
        this.$router.push("/forum/detail/" + pid + "/" + userPhone);
      }
    },
    showAction() {
      this.sheetVisible = !this.sheetVisible;
    },
    toPostProblem() {
      let labelId = 1;
      let labelName = "题目贴";
      this.$router.push("/forum/add/" + labelId + "/" + labelName);
    },
    toPostTalk() {
      let labelId = 2;
      let labelName = "闲话贴";
      this.$router.push("/forum/add/" + labelId + "/" + labelName);
    }
  },
  components: {
    HeaderTop,
    BackToTop
  }
};
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixins.styl';

.posts {
  padding-top: 40px;
  .label_container {
    width: 90%;
    margin-left: 5%;
    margin-bottom 45px
    .post_list {
      border-bottom: 1px solid #EEE9E9;
      margin-top 10px
      letter-spacing 1px
      font-size: 16px;
      line-height 18px
      .user_info{
        display: flex;
        img{
          width 30px
          height 30px
          border-radius 10%
        }
        .name_time{
          display: flex;
          flex-direction: column
          justify-content: space-around
          padding-left 20px
          height 30px
          .user_name{
            font-size 12px
          }
          .user_time{
            color #8B8989
            font-size 10px
          }
        }
      }
      .post_title{
        margin-top 10px
        font-size 14px
        font-weight bold
      }
      .post_content{
        margin-top 10px
        font-size 13px
        font-weight 400
      }
      .post_opt{
        margin 10px 0
        .iconfont{
          font-size 14px
          color #8B8989
        }
        .icon-like-chose{
          color #ff0000
        }
        span{
          font-size 12px
        }
          
      }
    }
    
  }
}
</style>
