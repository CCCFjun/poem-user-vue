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
      <div @click="toDetail('/profile/collectionList')" class="item_list">
        <ProfileItem title="收藏题目"></ProfileItem>
      </div>
      <div @click="toDetail('/profile/like')" class="kind_one item_list">
        <ProfileItem title="喜欢"></ProfileItem>
      </div>

      <div @click="toDetail('/profile/pswchange')" class="item_list">
        <ProfileItem title="密码修改"></ProfileItem>
      </div>
      <div @click="toDetail('/profile/infochange')" class="item_list">
        <ProfileItem title="信息修改"></ProfileItem>
      </div>
      <div @click="toDetail('/profile/feedback')" class="item_list">
        <ProfileItem title="反馈留言"></ProfileItem>
      </div>
      <div @click="toDetail('/profile/profileNotice')" class="item_list">
        <ProfileItem title="通知"></ProfileItem>
      </div>

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
        userImgSrc:this.$store.state.userInfo.userImgSrc,
        userIntroduction:this.$store.state.userInfo.userIntroduction,
        isSelect:false
      }
    },
    computed:{
      ...mapState(['userInfo']),
    },
    created(){

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
    padding-bottom 45px
    background-color #EEE9E9
    .profile-number
      margin-top 40px
      background-color #fff
      &:active
        opacity 0.8
      .profile-link
        clearFix()
        position relative
        display block
        padding 20px 10px
        .profile_image
          float left
          width 50px
          height 50px
          border-radius 10%
          overflow hidden
          vertical-align top
          img
            height 100%
            width 100%
        .user-info
          float left
          margin-top 8px
          margin-left 15px
          .user-info-top
            font-weight 700 
            padding-bottom 10px
            color #000
            font-size 20px
          .user-info-bottom
            color #ccc
            font-size 12px
    .profile-items
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top 10px
      .item_list
        width 100%
        height 40px
        line-height 40px
        border-bottom 1px solid #EEE9E9
      .kind_one
        margin-bottom 14px
      .login_out
        width 100%
        height 40px
        margin-top 14%
        border 1px solid #EEE9E9
        background-color #fff
        display flex
        justify-content center
        align-items center
        font-size 16px
</style>
