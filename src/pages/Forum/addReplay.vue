<template>
  <section class="add_replay">
    <HeaderTop title="说点什么">
      <a href="javascript:" slot="left" class="cancel" @click="$router.goBack()">
        <i class="iconfont icon-cha"></i>
      </a>
      <div class="header_message" slot="right" >
        <span @click="addReplay">提交</span>
      </div>
    </HeaderTop>

    <div class="post">
        <mt-field v-model="replayContent" type="textarea" rows="8" placeholder="文字"></mt-field>
    </div>
  </section>
</template>

<script>
import HeaderTop from "../../components/HeaderTop/HeaderTop.vue";
import { reqAddReplay } from "@/api/forum";
import {Toast, MessageBox} from 'mint-ui'
export default {
  name: "",
  data() {
    return {
        pid: this.$route.params.pid,
        userPhone: this.$store.state.userInfo.userPhone,
        replayContent: ""
    };
  },
  methods: {
      async addReplay(){
        const {userPhone, pid, replayContent } = this;
        let result = await reqAddReplay({userPhone, pid, replayContent});
        if (result.statu == 0){
          Toast({
            message: result.msg,
            iconClass: 'iconfont iconunie045',
            duration: 1500
          });
          this.$router.goBack()
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
.add_replay 
  width: 90%;
  padding-top: 45px;
  margin-left 5%
  .post
    margin-top 5%
    .mint-field
      border-bottom 1px solid #ccc
      width 100%
      margin 0 auto
</style>