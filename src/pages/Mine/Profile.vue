<template>
  <div class="profile">
    <HeaderTop title="我">

    </HeaderTop>

    <section class="profile-number">
      <router-link :to="userInfo.userPhone ? '' : '/login'" class="profile-link">
        <div class="profile_image">
          <img :src="userInfo.userImgSrc ? userInfo.userImgSrc : require('../../common/imgs/profile.jpg')" alt="用户头像">
          <!--<img src="../../common/imgs/profile.jpg" alt="头像" v-else>-->
        </div>

        <div class="user-info">
          <p class="user-info-top" v-if="userInfo.userPhone">{{userInfo.userName}}</p>
          <p class="user-info-top" v-else>{{'登录/注册'}}</p>
          <p class="user-info-bottom">{{userInfo.userIntroduction}}
            <!-- <span class="user-info-bottom">编辑个人信息</span> -->
          </p>
        </div>
      </router-link>
    </section>

    <section class="profile-items">
      <!-- <div @click="toDetail('/profile/stuscore')">
        <ProfileItem title="查看成绩" icon="iconchakan"></ProfileItem>
      </div> -->
      <div @click="toDetail('/profile/collectionList')" class="kind_one item_list">
        <ProfileItem title="收藏题目"></ProfileItem>
      </div>
      <!-- <div @click="toDetail('/profile/examcalendar')">
        <ProfileItem title="考试日历" icon="iconrili2"></ProfileItem>
      </div> -->
      <div @click="toDetail('/profile/pswchange')" class="item_list">
        <ProfileItem title="密码修改"></ProfileItem>
      </div>
      <div @click="toDetail('/profile/infochange')" class="item_list">
        <ProfileItem title="信息修改"></ProfileItem>
      </div>
      <div @click="toDetail('/profile/feedback')" class="item_list">
        <ProfileItem title="反馈留言"></ProfileItem>
      </div>
      <!-- <div @click="toDetail('/profile/profileNotice')" class="item_list">
        <ProfileItem title="通知"></ProfileItem>
      </div> -->

      <!--退出登录-->
      <div class="login_out" :class="isSelect?'opacity':''"
           @touchstart="toggleSelect" @touchend="toggleSelect"
           v-show="userInfo.userPhone" @click="logout">
        退出登录
      </div>
    </section>
  </div>
</template>

<script>
  import HeaderTop from '../../components/HeaderTop/HeaderTop.vue'
  import ProfileItem from '../../components/ProfileItem/ProfileItem.vue'
  import { mapState, mapGetters } from 'vuex'
  import { MessageBox, Toast } from 'mint-ui';
  export default {
    name: "",
    data() {
      return {
        userPhone:this.$store.state.userInfo.userPhone,
        userIntroduction:this.$store.state.userInfo.userIntroduction,
        isSelect:false
      }
    },
    computed:{
      ...mapState(['userInfo']),
      ...mapGetters(['unreadMsgCount'])
    },
    created(){
      if (this.$store.state.userInfo.userPhone) {
        //登录成功进入profile页面异步更新state李的examCalendar，防止进入首页来不及异步获取examCalendar控制台报undefined错误
        this.$store.dispatch('getExamCalendar',function () {
          sessionStorage.setItem("examCalendar", JSON.stringify(self.$store.state.examCalendar));
        });
        //获取未读消息条数
        this.$store.dispatch('getUnreadMsgCount');
        //登录成功获取反馈信息保存到vuex的state
        let self = this;
        //等待异步请求完数据后再执行向sessionStorage中存储数据
        this.$store.dispatch('receiveFeedbackInfo', function () {
          // console.log(this.$store.state.feedbackInfo)
          sessionStorage.setItem("feedbackInfo", JSON.stringify(self.$store.state.feedbackInfo));
        });
        // sessionStorage.setItem("feedbackInfo",this.$store.state.feedbackInfo);
      }
    },
    methods: {
      toggleSelect(){
        this.isSelect = !this.isSelect;
      },
      logout(){
        MessageBox.confirm('确定退出登录吗?').then(action => {
          //点击确定按钮操作
          //清空sessionStorage会话
          sessionStorage.clear();
          // 请求退出
          this.$store.dispatch('logout');
          //清除vuex中feedbackInfo
          this.$store.dispatch('recordFeedbackInfo', []);
          //清除vuex中unreadMsgCount
          this.$store.dispatch('resetUnreadMsgCount');
          //清除vuex中examCalendar
          this.$store.dispatch('recordExamCalendar', []);
          // sessionStorage.removeItem("feedbackInfo");
          Toast({
            message:'退出成功',
            duration: 1500
          });
          this.$router.push('/login')
        },() => {
          //点击取消按钮操作
        })
      },
      toDetail(path){
        if (!this.$store.state.userInfo.userPhone){
          Toast({
            message:'请先登录系统',
            duration: 1000
          });
          return
        }
        else{
          this.$router.push(path);
        }
      },
      
    },
    components:{
      HeaderTop,
      ProfileItem
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .profile
    width 100%
    overflow hidden
    padding-bottom 56px
    .profile-number
      margin-top 45.5px
      &:active
        opacity 0.8
      .profile-link
        clearFix()
        position relative
        display block
        padding 20px 10px
        border-bottom 10px solid #EEE9E9
        border-top 10px solid #EEE9E9
        .profile_image
          float left
          width 60px
          height 60px
          border-radius 10%
          overflow hidden
          vertical-align top
          img
            height 100%
            width 100%
          .icon-yonghuming
            background #e4e4e4
            font-size 62px
        .user-info
          float left
          margin-top 8px
          margin-left 15px
          .user-info-top
            font-weight 700 
            padding-bottom 18px
            color #000
            font-size 20px
          .user-info-bottom
            padding-bottom 8px
            color #ccc
            font-size 14px
        .arrow
          position absolute
          right 15px
          top 40%
          .iconjiantou
            color #000
            font-size 30px
    .profile-items
      display: flex;
      flex-direction: column;
      align-items: center;
      .item_list
        width 100%
        border-bottom 1px solid #ccc
      .kind_one
        border-bottom 10px solid #EEE9E9
      .login_out
        width 70%
        height 50px
        margin-top 20%
        background-color #EEE9E9
        display flex
        justify-content center
        align-items center
</style>
