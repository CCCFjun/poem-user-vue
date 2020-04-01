<template>
  <section class="profile_psw_change">
    <!--利用$router.back()返回上一级路由 -->
    <HeaderTop title="密码修改">
      <a href="javascript:" slot="left" class="go_back" @click="$router.goBack()">
        <i class="iconfont iconxiazai6"></i>返回
      </a>
    </HeaderTop>

    <div class="profile_psw_change_field">
      <mt-field placeholder="请输入原始密码" type="password" v-model="password"></mt-field>
      <mt-field placeholder="请输入新密码" type="password" v-model="newPassword"></mt-field>
      <mt-field placeholder="请再次输入新密码" type="password" v-model="newPasswordConfirm"></mt-field>
      <mt-button type="primary" size="large" @click="checkPswChange">确定</mt-button>
    </div>
  </section>
</template>

<script>
  import HeaderTop from '../../components/HeaderTop/HeaderTop.vue'
  import {reqPswChange} from '@/api/mine'
  import {Toast, MessageBox} from 'mint-ui'
  export default {
    name: "",
    data() {
      return {
        userPhone:this.$store.state.userInfo.userPhone,
        password:'',
        newPassword:'',
        newPasswordConfirm:''
      }
    },
    methods: {
      async checkPswChange(){
        this.password = this.$md5(this.password)
        this.newPassword = this.$md5(this.newPassword)
        this.newPasswordConfirm = this.$md5(this.newPasswordConfirm)
        const {userPhone, password, newPassword, newPasswordConfirm} = this;
        let result = await reqPswChange({userPhone, password, newPassword, newPasswordConfirm});
        if (result.statu == 0) {
          Toast({
            message: '密码修改成功',
            iconClass: 'iconfont iconunie045',
            duration: 1500
          });
          this.$router.replace('/profile');
        }
        else {
          Toast({
            message: result.msg,
            duration: 1500
          });
        }
      }
    },
    components:{
      HeaderTop
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  .profile_psw_change
    padding-top: 45px;
    .profile_psw_change_field
      width: 90%;
      margin-top 10%
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .mint-button
        background-color: #fff;
        margin-top: 15px;
        margin-bottom: 15px;
        color: #B22222;
        border: 1px solid #B22222;
        width: 70%;
    
</style>
