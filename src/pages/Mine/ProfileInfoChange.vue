<template>
  <section class="profile_info_change">
    <!--利用$router.back()返回上一级路由 -->
    <HeaderTop title="信息修改">
      <a href="javascript:" slot="left" class="go_back" @click="$router.goBack()">
        <i class="iconfont iconxiazai6"></i>
      </a>
    </HeaderTop>

    <!--个人信息修改-->
    <div class="profile_info_change_field">
      <div class="profile_img_div">
        <label for="fileInput">      
          <img :src="userImgSrc ? userImgSrc : require('../../common/imgs/adminlogo.png')" class="profile_img">       
        </label>
      </div>
      <input v-show="false" type="file" id="fileInput" class="img_file"
             accept="image/jpeg,image/jpg,image/png,image/gif" @change="getImgFile" ref="imgFile">
      
      <mt-cell title="账号" :value="userPhone"></mt-cell>
      <mt-cell title="用户名" :value="userName" is-link @click.native="changeName"></mt-cell>
      <mt-cell title="签名" :value="userIntroduction" is-link @click.native="changeIntroduction"></mt-cell>
      <mt-cell title="姓别" :value="userSex" is-link @click.native="changeSex"></mt-cell>
      <mt-button size="large" @click.native="changeInfo">保存修改</mt-button>
    </div>

  </section>
</template>

<script>
  import HeaderTop from '../../components/HeaderTop/HeaderTop.vue'
  import {Toast, MessageBox } from 'mint-ui'
  import {mapState} from 'vuex'
  import { reqInfoChange } from '@/api/mine'
  export default {
    name: "",
    data() {
      return {
        userImgSrc:this.$store.state.userInfo.userImgSrc,
        userName:this.$store.state.userInfo.userName,
        userIntroduction:this.$store.state.userInfo.userIntroduction,
        userSex:this.$store.state.userInfo.userSex,
        userPhone:this.$store.state.userInfo.userPhone,
        tempImgSrc:this.$store.state.userInfo.userImgSrc
      }
    },
    methods: {
      changeName(){
        MessageBox.prompt('修改用户名','',{inputValue: this.userName,
          inputValidator:function(v){return v !== '';},
          inputErrorMessage:'用户名不能为空'}).then(({ value, action }) => {
          this.userName = value;
        },() => {});
      },
      changeIntroduction(){
        MessageBox.prompt('修改签名','',{inputValue: this.userIntroduction,
          inputValidator:function(v){return v !== '';},
          inputErrorMessage:'签名不能为空'}).then(({ value, action }) => {
          this.userIntroduction = value;
        },() => {});
      },
      changeSex(){
        MessageBox.prompt('修改姓别','',{inputValue: this.userSex,
          inputValidator:function(v){return v == '男' || v == '女';},
          inputErrorMessage:'请输入男或者女'}).then(({ value, action }) => {
          this.userSex = value;
        },() => {});
      },
      async changeInfo(){
        // 声明一个FormData对象，有file以表单方式发送请求
        var formData = new window.FormData();
        const {userPhone, userName, userIntroduction, userSex} = this;
        var userImgSrc = this.$refs.imgFile.files[0];
        if (typeof userImgSrc !== 'undefined' && userImgSrc.size > 4194304) {
          // console.log(userImgSrc.size)
          Toast({
            message: '请选择4M以内的图片',
            duration: 1500
          });
        } else {
          formData.append('userImgSrc',userImgSrc);
          formData.append('userPhone',this.userPhone);
          formData.append('userName',this.userName);
          formData.append('userIntroduction',this.userIntroduction);
          formData.append('userSex',this.userSex);
          let result = await reqInfoChange(formData);
          if (result.statu == 0){
            var user = result.data;
            // console.log(this.tempImgSrc)
            user.userImgSrc = this.tempImgSrc;
            this.$store.dispatch('recordUser', user);
            //更新sessionStorage中userInfo
            sessionStorage.setItem("userInfo",JSON.stringify(user));
            Toast({
              message: result.msg,
              iconClass: 'iconfont iconunie045',
              duration: 1500
            });
            this.$router.push('/profile');
          }
          else if (result.msg == '会话失效，请重新登录') {
            MessageBox.confirm('会话失效，是否重新登录？').then(action => {
              //点击确定按钮操作
              //清空sessionStorage会话
              sessionStorage.clear();
              // 请求退出
              this.$store.dispatch('logout');
              Toast('请重新登录系统');
              this.$router.push('/login')
            }, () => {
              //点击取消按钮操作
            })
          }
          else {
            Toast({
              message: result.msg,
              position: 'bottom',
              duration: 1500
            });
          }
        }
      },
      getImgFile(){
        if (typeof this.$refs.imgFile.files[0] === 'undefined') {
          Toast({
            message: '若无法上传头像，可能是由于微信内置浏览器暂不支持Android版上传文件，请点击右上角选择其他浏览器打开',
            iconClass: 'iconfont iconxinxi',
            duration: 4000
          });
        }
        if (this.$refs.imgFile.value) {
          var _self = this;
          this.stuImg = '头像路径：' + this.$refs.imgFile.value;
          //前端实现上传头像预览
          var fileObj = this.$refs.imgFile;
          var file = fileObj.files[0];
          var fReader = new FileReader();
          fReader.readAsDataURL(file);
          fReader.onload = function () {
            _self.tempImgSrc = this.result;
            _self.userImgSrc = this.result;
          }
        }
      }
    },
    components:{
      HeaderTop
    },
    computed:{
      ...mapState(['userInfo'])
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  .profile_info_change
    padding-top 45px
    background-color #EEE9E9
    height 100%
    .profile_info_change_field
      display: flex
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .profile_img_div
        margin 10% 0 10% 0
        .profile_img
          width 70px
          height 70px
          border-radius 10%
          margin auto 0
      .mint-cell
        width 100%
        line-height 30px
        border-top 1px solid #EEE9E9
      .mint-button
        color: #B22222;
        border: 1px solid #B22222;
        width: 70%;
        background-color #EEE9E9
        margin-top 10%
      .img_file
        width 60%
        background-color #fff
        position absolute
        top 55px
        left 70px
</style>
