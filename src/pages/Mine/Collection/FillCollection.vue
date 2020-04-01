<template>
  <section class="fill_collection">
    <HeaderTop title="收藏题目详情">
      <a href="javascript:" slot="left" class="go_back" @click="$router.goBack()">
        <i class="iconfont iconxiazai6"></i>
      </a>
    </HeaderTop>

    <div class="content_container">
      <div class="que_content">
        <div class="que_ques">{{item.fillContent}}</div>
        <div class="que_img"><img :src="item.fillImgSrc" v-if="showImg"></div>
        <div><span class="green_answer">正确答案</span>{{item.fillAnswer}}</div>
        <div class="que_explain">解析：<span class="correct_answer">{{item.explain}}</span></div>
      </div>
      <div class="que_collect">
        <img :src="item.isCollect == '0' ? require('../../../common/imgs/no-collect.png') : require('../../../common/imgs/yes-collect.png')" @click="clickCollect()"/>
      </div>
    </div>
  </section>
</template>

<script>
  import HeaderTop from '@/components/HeaderTop/HeaderTop.vue'
  import {reqFillByAnswerId, reqUpdatePaperAnswerIsCollect} from '@/api/collection'
  import {Toast} from 'mint-ui'
  export default {
    name: "",
    data() {
      return {
        answerId:this.$route.params.answerId,
        item:{},
        showImg: 0
      }
    },
    created(){
      this.getFillByAnswerId();
    },
    methods: {
      async getFillByAnswerId(){
        const {answerId} = this;
        let result = await reqFillByAnswerId({answerId});
        if (result.statu == 0){
          this.item = result.data;
          if(this.item.fillImgSrc != null){
            this.showImg = 1;
          }
        }
        else {
          Toast({
            message:result.msg,
            duration: 1500
          });
        }
      },
      async updatePaperAnswerIsCollect(isCollect){
        let answerId = parseInt(this.answerId);
        let result = await reqUpdatePaperAnswerIsCollect(answerId, isCollect);
        if (result.statu == 0){
          return true;
        }
        else {
          return false;
        }
      },
      clickCollect(){
        if (this.item.isCollect == '0') {
          this.item.isCollect = '1';
          if (this.updatePaperAnswerIsCollect('1')) {
            Toast({
              message:'收藏成功',
              duration: 1000,
              position:'bottom'
            });
          }
        }
        else {
          this.item.isCollect = '0';
          if (this.updatePaperAnswerIsCollect('0')) {
            Toast({
              message:'已取消收藏',
              duration: 1000,
              position:'bottom'
            });
          }
        }
      }
    },
    components:{
      HeaderTop
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  .fill_collection
    width 90%
    padding-top 40px
    margin-left 5%
    .go_back
      width 40px
    .content_container
      display: flex;
      justify-content: space-between;
      margin-top 15px
      font-size 16px
      .que_collect
        >img
          height 18px
          width 18px
      .que_content
        line-height 24px
        .que_ques
          >.icon-gou1
            color #00CD66
          >.icon-cha
            color #FF0000
        .green_answer
          display inline-block
          padding 2px 8px
          margin 8px 10px 0 0
          border-radius 2px
          font-size 14px
          border 1px solid #00CD66
          color #00CD66
          margin-top 10px
        .que_explain
          margin 10px 0
        .que_img
          margin-top 10px
          >img
            height 120px
            width 100%
</style>
