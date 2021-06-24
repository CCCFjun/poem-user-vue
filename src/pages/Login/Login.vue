<template>
  <section class="register">
    <!--利用$router.back()返回上一级路由 -->
    <van-nav-bar
      title="登录"
      left-arrow
      @click-left="$router.goBack()"
    />

    <div class="register-1">
      <img src="../../common/imgs/adminlogo.png" alt />
    </div>
    <!-- 登录 -->
    <div v-show="showLogin">
      <div class="register-2">
        <van-cell-group>
          <van-field
            v-model="userPhone"
            label="账号"
            :right-icon="phoneState"
            @blur.native.capture="checkUserPhone"
          />
          <van-field
            v-model="userPsw"
            clearable
            label="密码"
            :right-icon="pswState"
            @blur.native.capture="checkPsw"
            @keyup.enter.native="checkLogin"
          />
        </van-cell-group>
      </div>
      <div class="register-3">
        <van-button class="btn" @click="checkLogin">登陆</van-button>
      </div>
      <div class="register-3">
        <van-button class="btn" @click="toRegister">注册</van-button>
      </div>
    </div>
    <!--注册-->
    <div class="login-wrap" v-show="showRegister">
      <div class="register-2">
      <van-cell-group>
        <van-field
          v-model="newUserName"
          placeholder="请输入昵称"
          :right-icon="newUserNameState"
          @blur.native.capture="checkNewName"
        />
        <van-field
          v-model="newUserPhone"
          clearable
          placeholder="请输入手机号"
          :state="newUserPhoneState"
          @blur.native.capture="checkNewUserPhone"
        />
        <van-field
          clearable
          placeholder="请输入至少6位数字密码"
          type="password"
          v-model="newUserPsw"
          :state="newUserPswState"
          @blur.native.capture="checkNewUserPsw"
        />
        <van-field
          clearable
          placeholder="请再次输入密码"
          type="password"
          v-model="newUserPswConfirm"
          :state="newUserPswConfirmState"
          @blur.native.capture="checkNewUserPswConfirm"
        />
      </van-cell-group>
      </div>
      <div class="register-3">
        <van-button class="btn" @click="userRegister">注册</van-button>
      </div>
      <div class="toggle-register login-tip">
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
      newUserPswConfirmState: "",
      mdnewUserPsw: "",
      mdnewUserPswConfirm: "",
      pswRtoL: "",
    };
  },
  methods: {
    // 登录校验手机号
    checkUserPhone() {
      if (this.userPhone === "") {
        this.phoneState = "";
      } else if (
        !/^1[3-9]\d{9}$/.test(this.userPhone) ||
        this.userPhone.length < 11
      ) {
        this.phoneState = "close";
      } else {
        this.phoneState = "passed";
      }
    },
    // 登录校验密码
    checkPsw() {
      if (this.userPhone === "") {
        this.pswState = "";
      } else if (this.userPsw.length < 6) {
        this.pswState = "close";
      } else {
        this.pswState = "passed";
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
      this.userPsw = this.$md5(this.userPsw);
      const { userPhone, userPsw } = this;
      let result = await reqLogin({ userPhone, userPsw });
      if (result.statu == 0) {
        const user = result.data;
        Toast({
          message: "登录成功",
          iconClass: "iconfont iconunie045",
          duration: 1500,
        });
        sessionStorage.setItem("userInfo", JSON.stringify(user));
        this.$store.dispatch("recordUser", user);
        this.$router.replace("/profile");
      } else {
        Toast({
          message: result.msg,
          duration: 1500,
        });
      }
    },
    //异步学生注册
    async userRegister() {
      this.pswRtoL = this.newUserPsw;
      this.newUserPsw = this.$md5(this.newUserPsw);
      this.newUserPswConfirm = this.$md5(this.newUserPswConfirm);
      const { newUserName, newUserPhone, newUserPsw, newUserPswConfirm } = this;
      let result = await reqRegister({
        newUserName,
        newUserPhone,
        newUserPsw,
        newUserPswConfirm,
      });
      if (result.statu == 0) {
        MessageBox.confirm("注册成功，是否自动登录?").then(
          (action) => {
            //点击确定按钮操作
            this.userPhone = this.newUserPhone;
            this.userPsw = this.pswRtoL;
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
          duration: 1500,
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
    },
  },
  components: {
    HeaderTop,
  },
};
</script>

<style scoped>
.register {
  width: 100%;
  height: 100%;
  position: fixed;
  background: white;
  left: 0;
  top: 0;
}
.register-1 {
  margin-top: 2rem;
}
.register-1 img {
  width: 3rem;
  display: block;
  margin: 0.6rem auto;
}
.register-1 p {
  color: black;
  text-align: center;
  font-size: 0.5rem;
}
.register-2 {
  /* display: flex;
  flex-direction: column; */
  margin-top: 0.6rem;
  margin-bottom: 0.6rem;
}
.register-2 label {
  width: 90%;
  margin: auto;
  height: 1.5rem;
  border-bottom: 0.03rem solid #f2f2f2;
  display: flex;
}
.register-2 label span {
  width: 20%;
  font-size: 0.5rem;
  line-height: 1.5rem;
  display: block;
  float: left;
}

.register-2 label input {
  width: 80%;
  font-size: 0.4rem;
  padding-left: 0.3rem;
}
.register-3 {
  display: flex;
}
.btn {
  width: 9rem;
  height: 1.1rem;
  margin: 0 auto;
  /* margin-top: 0.72rem; */
  margin-bottom: 0.3rem;
  text-align: center;
  line-height: 1.1rem;
  font-size: 0.45rem;
  color: #fff;
  border-radius: 0.6rem;
  background-color: #99ffcc;
  background-image: linear-gradient(90deg, #90ee90, #99ffcc);
}
.login-tip{
  font-size: 14px;
  margin-left: 6%;
}
</style>