<template>
  <section class="add_post">
    <HeaderTop :title="labelName">
      <a href="javascript:" slot="left" class="cancel" @click="$router.goBack()">
        <i class="iconfont icon-cha"></i>
      </a>
      <div class="header_message" slot="right" >
        <span @click="addPost">上传</span>
      </div>
    </HeaderTop>

    <div class="post">
        <mt-field v-model="postTitle" placeholder="标题 / 选填"></mt-field>
        <mt-field v-model="postContent" type="textarea" rows="8" placeholder="文字"></mt-field>
    </div>
  </section>
</template>

<script>
import HeaderTop from "../../components/HeaderTop/HeaderTop.vue";
import { reqAddPost } from "@/api/forum";
import {Toast, MessageBox} from 'mint-ui'
export default {
  name: "",
  data() {
    return {
        labelId: this.$route.params.labelId,
        labelName: this.$route.params.labelName,
        userPhone: this.$store.state.userInfo.userPhone,
        postContent: "",
        postTitle: ""
    };
  },
  methods: {
      async addPost(){
        const {userPhone, postTitle, postContent ,labelId} = this;
        let result = await reqAddPost({userPhone, postTitle, postContent, labelId});
        if (result.statu == 0){
          Toast({
            message: result.msg,
            iconClass: 'iconfont iconunie045',
            duration: 1500
          });
          this.$router.push('/forum');
        }
        else {
          Toast({
            message: result.msg,
            duration: 1500
          });
        }
      },
  },
  components: {
      HeaderTop
  }
};
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
.add_post 
  width: 90%;
  padding-top: 40px;
  margin-left 5%
  .post
    .mint-field
      width 100%
      margin 0 auto
</style>