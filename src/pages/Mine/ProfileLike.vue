<template>
  <section class="posts">
    <!--利用$router.back()返回上一级路由 -->
    <HeaderTop title="喜欢">
      <a href="javascript:" slot="left" class="go_back" @click="$router.goBack()">
        <i class="iconfont iconxiazai6"></i>返回
      </a>
    </HeaderTop>

    <div class="label_container">
      <mt-loadmore :top-method="loadTop" ref="loadmore" v-if="haveLikeList.length != 0">
          <div class="post_list" v-for="(item, index) in haveLikeList" :key="item.pid" @click="toPostDetail(item.pid, item.userInfo[0].userPhone)">
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
              <i v-if="isLike[index]==1" class="iconfont icon-like-chose" @click.stop="clickLike(item.pid, index)"></i>
              <i v-else class="iconfont icon-xihuan" @click.stop="clickLike(item.pid ,index)"></i>
              <span v-if="likeCount[index] != 0">{{likeCount[index]}}</span>
            </div>
          </div>
      </mt-loadmore>
      <div v-else class="none_like">
          <p>暂无数据</p>
      </div>
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
import { reqGetAllLikePost, reqUpdateLikePost } from "@/api/forum";
import { Toast, Actionsheet } from "mint-ui";
import { mapState } from "vuex";
export default {
  name: "",
  data() {
    return {
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
      haveLikeList: [],
      isLike: [],
      likeCount: [],
    };
  },
  computed: {},
  created() {
    this.getAllLikePost()
  },
  methods: {
    async getAllLikePost() {
      let userPhone = this.$store.state.userInfo.userPhone
      let result = await reqGetAllLikePost( {userPhone});
      if (result.statu == 0) {
        this.haveLikeList = result.data
        this.isLike.length = this.haveLikeList.length
        this.likeCount.length = this.haveLikeList.length
        for(let i=0; i<this.isLike.length; i++){
            this.$set(this.isLike, i, 1)
            this.likeCount[i] = this.haveLikeList[i].good
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
    loadTop() {
        this.getAllLikePost();
    },
    toPostDetail(pid, userPhone) {
        this.$router.push("/forum/detail/" + pid + "/" + userPhone);
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
  padding-top: 45px;

  .label_container {
    width: 90%;
    margin-left: 5%;
    margin-bottom 50px
    .none_like{
        text-align center
        margin-top 10%
    }
    .post_list {
      border-bottom: 1px solid #ccc;
      margin-top 10px
      letter-spacing 1px
      font-size: 18px;
      line-height 22px
      .user_info{
        display: flex;
        img{
          width 60px
          height 60px
          border-radius 10%
        }
        .name_time{
          display: flex;
          flex-direction: column
          justify-content: space-around
          padding-left 20px
          height 60px
          .user_name{
            font-size 18px
          }
          .user_time{
            color #8B8989
            font-size 14px
          }
        }
      }
      .post_title{
        margin-top 20px
        font-size 22px
        font-weight bold
      }
      .post_content{
        margin-top 20px
      }
      .post_opt{
        margin 20px 0
        .iconfont{
          font-size 22px
          color #8B8989
        }
        .icon-like-chose{
          color #ff0000
        }
      }
    }
    
  }
}
</style>
