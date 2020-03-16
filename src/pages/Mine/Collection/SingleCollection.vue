<template>
  <section class="single_collection">
    <HeaderTop title="收藏题目详情">
      <a href="javascript:" slot="left" class="go_back" @click="$router.goBack()">
        <i class="iconfont iconfanhui"></i>
      </a>
    </HeaderTop>

    <div class="content_container">
      <div class="que_content">
        <div class="que_ques">{{item.singleContent}}</div>
        <div class="que_option" v-for="(option, optionIndex) in item.options"
             :key="'single'+ item.singleId + optionIndex">
            <span :class="{'green_op':option.value==item.singleAnswer,'normal_op':option.value}">{{option.label}}</span>
          </div>
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
  import {reqSingleByAnswerId, reqUpdatePaperAnswerIsCollect} from '@/api/collection'
  import {Toast} from 'mint-ui'
  export default {
    name: "",
    data() {
      return {
        answerId:this.$route.params.answerId,
        item:{}
      }
    },
    created(){
      this.getSingleByAnswerId();
    },
    methods: {
      async getSingleByAnswerId(){
        const {answerId} = this;
        let result = await reqSingleByAnswerId({answerId});
        if (result.statu == 0){
          this.item = result.data;
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
  .single_collection
    width 90%
    padding-top 45px
    min-height 900px
    margin-left 5%
    .go_back
      width 40px
    .content_container
      display: flex;
      justify-content: space-between;
      margin-top 15px
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
        .que_option
          .normal_op
          .green_op
            display inline-block
            border 1px solid #D3D3D3
            margin-top 8px
            padding 6px 20px
            border-radius 2px
          .green_op
            border 1px solid #00CD66
        .que_explain
          margin 10px 0
</style>
