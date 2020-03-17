<template>
  <section class="login-container">
    <!--利用$router.back()返回上一级路由 -->
    <HeaderTop title="登录">
      <a href="javascript:" slot="left" class="go_back" @click="$router.goBack()">
        <i class="iconfont iconxiazai6"></i>返回
      </a>
      <div class="header_message" slot="right">
        <span @click="toRegister">注册</span>
      </div>
    </HeaderTop>

    <!--实现登录功能-->
    <!--<transition name="el-fade-in">-->
    <div class="login-wrap" v-show="showLogin">
      <mt-field
        placeholder="    手机号码"
        v-model="userPhone"
        :state="phoneState"
        @blur.native.capture="checkUserPhone"
      />
      <mt-field
        placeholder="    密码"
        type="password"
        v-model="userPsw"
        :state="pswState"
        @blur.native.capture="checkPsw"
        @keyup.enter.native="checkLogin"
      />
      <mt-button type="primary" size="large" @click.native="checkLogin">登录</mt-button>

      <div class="toggle-login">
        <!-- <span @click="toRegister">没有账号？马上注册</span> -->
        <!-- <span @click="toFindPsw">忘记密码？</span> -->
      </div>
    </div>
    <!--</transition>-->

    <!--实现注册功能-->
    <!--<transition name="el-fade-in">-->
    <div class="login-wrap" v-show="showRegister">
      <mt-field
        placeholder="       请输入昵称"
        v-model="newUserName"
        :state="newUserNameState"
        @blur.native.capture="checkNewName"
      />
      <mt-field
        placeholder="       请输入手机号"
        v-model="newUserPhone"
        :state="newUserPhoneState"
        @blur.native.capture="checkNewUserPhone"
      />
      <mt-field
        placeholder="       请输入至少6位数字密码"
        type="password"
        v-model="newUserPsw"
        :state="newUserPswState"
        @blur.native.capture="checkNewUserPsw"
      />
      <mt-field
        placeholder="       请再次输入密码"
        type="password"
        v-model="newUserPswConfirm"
        :state="newUserPswConfirmState"
        @blur.native.capture="checkNewUserPswConfirm"
      />
      <mt-button type="primary" size="large" @click.native="userRegister">注册</mt-button>
      <div class="toggle-register">
        <span @click="toLogin">已有账号？马上登录</span>
      </div>
    </div>
  </section>
</template>

<script>
import HeaderTop from "../../components/HeaderTop/HeaderTop.vue";
import { reqLogin, reqRegister } from "@/api/mine";
import { Toast, MessageBox } from "mint-ui";
export default {
  name: "",
  data() {
    return {
      showLogin: true,
      showRegister: false,
      userPhone: "",
      phoneState: "",
      userPsw: "",
      pswState: "",
      newUserName: "",
      newUserNameState: "",
      newUserPhone: "",
      newUserPhoneState: "",
      newUserPsw: "",
      newUserPswState: "",
      newUserPswConfirm: "",
      newUserPswConfirmState: ""
    };
  },
  methods: {
    // 登录校验手机号
    checkUserPhone() {
      if (this.userPhone === "") {
        this.phoneState = "";
      } else if (!/^\d{11}$/.test(this.userPhone)) {
        this.phoneState = "error";
      } else {
        this.phoneState = "success";
      }
    },
    // 登录校验密码
    checkPsw() {
      if (this.userPhone === "") {
        this.pswState = "";
      } else if (this.userPsw.length < 6) {
        this.pswState = "error";
      } else {
        this.pswState = "success";
      }
    },
    // 注册校验手机号
    checkNewUserPhone() {
      if (this.newUserPhone === "") {
        this.newUserPhone = "";
      } else if (!/^\d{11}$/.test(this.newUserPhone)) {
        this.newUserPhoneState = "error";
      } else {
        this.newUserPhoneState = "success";
      }
    },
    //注册校验姓名
    checkNewName() {
      if (this.newUserName === "") {
        this.newUserNameState = "";
      } else {
        this.newUserNameState = "success";
      }
    },
    // 注册校验密码
    checkNewUserPsw() {
      if (this.newUserPsw === "") {
        this.newUserPswState = "";
      } else if (this.newUserPsw.length >= 6) {
        this.newUserPswState = "success";
      } else {
        this.newPswState = "error";
      }
    },
    //注册校验再次输入密码
    checkNewUserPswConfirm() {
      if (this.newUserPswConfirm === "") {
        this.newUserPswConfirmState = "";
      } else if (
        this.newUserPswConfirm.length >= 6 &&
        this.newUserPswConfirm === this.newUserPsw
      ) {
        this.newUserPswConfirmState = "success";
      } else {
        this.newUserPswConfirmState = "error";
      }
    },
    // 异步用户登录
    async checkLogin() {
      const { userPhone, userPsw } = this;
      let result = await reqLogin({ userPhone, userPsw });
      if (result.statu == 0) {
        const user = result.data;
        Toast({
          message: "登录成功",
          iconClass: "iconfont iconunie045",
          duration: 1500
        });
        //将数据存储到sessionStorage中，防止刷新页面自动退出
        sessionStorage.setItem("userInfo", JSON.stringify(user));
        // 将user保存到vuex的state
        this.$store.dispatch("recordUser", user);
        // 去个人中心界面
        this.$router.replace("/profile");
      } else {
        Toast({
          message: result.msg,
          duration: 1500
        });
      }
    },
    //异步学生注册
    async userRegister() {
      const { newUserName, newUserPhone, newUserPsw, newUserPswConfirm } = this;
      let result = await reqRegister({
        newUserName,
        newUserPhone,
        newUserPsw,
        newUserPswConfirm
      });
      if (result.statu == 0) {
        MessageBox.confirm("注册成功，是否自动登录?").then(
          action => {
            //点击确定按钮操作
            this.userPhone = this.newUserPhone;
            this.userPsw = this.newUserPsw;
            this.checkLogin();
          },
          () => {
            //点击取消按钮操作
            this.newUserName = "";
            this.newUserNameState = "";
            this.newUserPhone = "";
            this.newUserPhoneState = "";
            this.newUserPsw = "";
            this.newUserPswState = "";
            this.newUserPswConfirm = "";
            this.newUserPswConfirmState = "";
          }
        );
      } else {
        Toast({
          message: result.msg,
          duration: 1500
        });
      }
    },
    //点击展示登录面板
    toLogin() {
      this.userPhone = "";
      this.phoneState = "";
      this.userPsw = "";
      this.pswState = "";
      this.showLogin = true;
      this.showRegister = false;
    },
    //点击展示注册面板
    toRegister() {
      this.newUserName = "";
      this.newUserNameState = "";
      this.newUserPhone = "";
      this.newUserPhoneState = "";
      this.newUserPsw = "";
      this.newUserPswState = "";
      this.newUserPswConfirm = "";
      this.newUserPswConfirmState = "";
      this.showLogin = false;
      this.showRegister = true;
    }
  },
  components: {
    HeaderTop
  }
};
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
.login-container {
  padding-top: 45px;

  >h3 {
    padding: 20px;
  }

  .login-wrap {
    width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-top 10%
    .mint-field {
      border-bottom: 1px solid #CDC9C9;
      width: 70%;
    }

    .mint-button {
      background-color: #fff;
      margin-top: 15px;
      margin-bottom: 15px;
      color: #B22222;
      border: 1px solid #B22222;
      width: 70%;
    }

    .toggle-login {
      margin-left: 26%;
      color: #8B8989;
    }
  }

  .register-wrap {
    width: 90%;
    margin: 0 auto;
    padding-bottom: 80px;

    .mint-button {
      background-color: #4ab8a1;
      margin-top: 15px;
      margin-bottom: 15px;
    }

    .toggle-register {
      display: flex;
      justify-content: space-between;
      color: #4ab8a1;
    }
  }

  .find-psw-wrap {
    width: 90%;
    margin: 0 auto;
    padding-bottom: 80px;

    .get-captcha {
      height: 30px;
      background-color: #4ab8a1;
      color: #fff;
      border-radius: 2px;
      border: 0;
    }

    .mint-button {
      background-color: #4ab8a1;
      margin-top: 15px;
      margin-bottom: 15px;
    }

    .toggle-find-psw {
      display: flex;
      justify-content: space-between;
      color: #4ab8a1;
    }
  }
}
</style>
