<template>
  <div class="wrong">
    <HeaderTop title="答题记录">
      <a href="javascript:" slot="left" class="go_back" @click="$router.goBack()">
        <i class="iconfont iconxiazai6"></i>返回
      </a>
    </HeaderTop>

    <!--试卷问题及选项区域-->
    <div class="paper_container">
      <!--单选题列表-->
      <section class="que" v-for="(item, index) in singleQueList" :key="'single'+ item.singleId">
        <div class="que_content">
          <div class="que_ques">{{index + 1}}.&nbsp;{{item.singleContent}}&nbsp;&nbsp;<i :class="{'iconfont':item.singleAnswer,'icon-gou1':item.singleAnswer==item.stuAnswer,'icon-cha':item.singleAnswer!=item.stuAnswer}"></i></div>
          <div class="que_option" v-for="(option, optionIndex) in item.options"
             :key="'single'+ item.singleId + optionIndex">
            <span :class="{'green_op':option.value==item.singleAnswer,'red_op':option.value==item.stuAnswer&&item.isCorrect==0,'normal_op':option.value}">{{option.label}}</span>
          </div>
          <div class="que_explain">解析：<span class="correct_answer">{{item.explain}}</span></div>
        </div>
        <div class="que_collect">
          <img :src="item.isCollect == '0' ? require('../../common/imgs/no-collect.png') : require('../../common/imgs/yes-collect.png')" @click="clickCollect(item.isCollect,index, item.answerId)"/>
          <!-- <mt-buttom @click="clickCollect(item.isCollect,index, item.answerId)">{{item.isCollect}}</mt-buttom> -->
        </div>  
      </section>

      <!--判断题列表-->
      <section class="que" v-for="(item, index) in judgeQueList" :key="'judge'+ item.judgeId">
        <div class="que_content">
          <div class="que_ques">{{index + 1 + queNumInfo.singleNum}}.&nbsp;{{item.judgeContent}}&nbsp;&nbsp;<i :class="{'iconfont':item.judgeAnswer,'icon-gou1':item.judgeAnswer==item.stuAnswer,'icon-cha':item.judgeAnswer!=item.stuAnswer}"></i></div>
          <div class="que_option" v-for="(option, optionIndex) in item.options"
             :key="'judge'+ item.judgeId + optionIndex">
            <span :class="{'green_op':option.value==item.judgeAnswer,'red_op':option.value==item.stuAnswer&&item.isCorrect==0,'normal_op':option.value}">{{option.label}}</span>
          </div> 
          <div class="que_explain">解析：<span class="correct_answer">{{item.explain}}</span></div>
        </div>
        <div class="que_collect">
          <img :src="item.isCollect == '0' ? require('../../common/imgs/no-collect.png') : require('../../common/imgs/yes-collect.png')" @click="clickCollect(item.isCollect,index+queNumInfo.singleNum, item.answerId)"/>
        </div>
      </section>

      <!--填空题列表-->
      <section class="que" v-for="(item, index) in fillQueList" :key="'fill'+ item.fillId">
        <div class="que_content">
          <div class="que_ques">{{index + 1 + queNumInfo.singleNum+queNumInfo.judgeNum}}.&nbsp;{{item.fillContent}}&nbsp;&nbsp;<i :class="{'iconfont':item.fillAnswer,'icon-gou1':item.fillAnswer==item.stuAnswer,'icon-cha':item.fillAnswer!=item.stuAnswer}"></i></div>
          <div><span class="green_answer">正确答案</span>{{item.fillAnswer}}</div>
          <div><span class="red_answer">你的回答</span>{{item.stuAnswer}}</div>
          <div class="que_explain">解析：<span class="correct_answer">{{item.explain}}</span></div>
        </div>
        <div class="que_collect">
          <img :src="item.isCollect == '0' ? require('../../common/imgs/no-collect.png') : require('../../common/imgs/yes-collect.png')" @click="clickCollect(item.isCollect,index + queNumInfo.singleNum+queNumInfo.judgeNum, item.answerId)"/>
        </div>
      </section>

      <!--填空题er列表-->
      <section class="que" v-for="(item, index) in fillTwoQueList" :key="'fill'+ item.fillId">
        <div class="que_content">
          <div class="que_ques">{{index + 1 + queNumInfo.singleNum + queNumInfo.judgeNum + queNumInfo.fillNum}}.&nbsp;{{item.fillContent}}&nbsp;&nbsp;<i :class="{'iconfont':item.fillAnswer,'icon-gou1':item.fillAnswer==item.stuAnswer,'icon-cha':item.fillAnswer!=item.stuAnswer}"></i></div>
          <div class="que_img"><img :src="item.fillImgSrc"></div>
          <div><span class="green_answer">正确答案</span>{{item.fillAnswer}}</div>
          <div><span class="red_answer">你的回答</span>{{item.stuAnswer}}</div>
          <div class="que_explain">解析：<span class="correct_answer">{{item.explain}}</span></div>
        </div>
        <div class="que_collect">
          <img :src="item.isCollect == '0' ? require('../../common/imgs/no-collect.png') : require('../../common/imgs/yes-collect.png')" @click="clickCollect(item.isCollect,index + queNumInfo.singleNum + queNumInfo.judgeNum + queNumInfo.fillNum, item.answerId)"/>
        </div>
      </section>
    </div>

  </div>
</template>

<script>
  import HeaderTop from '../../components/HeaderTop/HeaderTop.vue'
  import {Toast, MessageBox} from 'mint-ui'
  import {reqPapersInfoByJoinedPaperId, reqUpdatePaperAnswerIsCollect} from '@/api/exam'
  import {mapState, mapActions} from 'vuex'
  export default {
    name: "",
    data() {
      return {
        //学号
        userPhone: this.$store.state.userInfo.userPhone,
        //路由传值paperId
        paperId: this.$route.params.paperId,
        //试卷信息
        paperInfo: {},
        //试卷问题类型数量
        queNumInfo: {},
        //单选题数组
        singleQueList: [],
        //多选题数组
        multipleQueList: [],
        //判断题数组
        judgeQueList: [],
        //填空题数组
        fillQueList: [],
        fillTwoQueList: [],
        //是否显示paperContainer,默认进入页面为true
        showPaperContainer: true,
        //是否显示paperCard答题卡，默认进入页面为false，当点击答题卡区域为true
        showPaperCard: false,
        isCollect:'0',
      }
    },
    created(){
      this.getPapersInfoByWrongPaperId();
    },
    computed:{
      
    },
    methods: {
      async getPapersInfoByWrongPaperId(){
        const {userPhone, paperId} = this;
        let result = await reqPapersInfoByJoinedPaperId({userPhone, paperId});
        if (result.statu == 0) {
          this.paperInfo = result.data.paperInfo;
          this.queNumInfo = result.data.queNumInfo;
          this.singleQueList = result.data.singleQueList;
          // this.multipleQueList = result.data.multipleQueList;
          this.judgeQueList = result.data.judgeQueList;
          this.fillQueList = result.data.fillQueList;
          this.fillTwoQueList = result.data.fillTwoQueList;
          // this.isCollect = result.data.singleQueList[0].isCollect;
        }
        else {
          Toast({
            message: result.msg,
            duration: 1500
          });
        }
      },
      async updatePaperAnswerIsCollect(answerId, isCollect){
        let result = await reqUpdatePaperAnswerIsCollect(answerId, isCollect);
        if (result.statu == 0){
          return true;
        }
        else {
          return false;
        }
      },
      clickCollect(isCollect, index, answerId){
        if (isCollect == '0') {
          if (index < this.queNumInfo.singleNum){
            // this.singleQueList[this.currentIndex].isCollect = '1';  数组更改渲染页面
            this.$set(this.singleQueList[index], "isCollect", '1')
          }
          else if (index < (this.queNumInfo.singleNum + this.queNumInfo.judgeNum)) {
            // this.judgeQueList[this.currentIndex - this.queNumInfo.singleNum].isCollect = '1';
            this.$set(this.judgeQueList[index - this.queNumInfo.singleNum], "isCollect", '1')
          }
          else if (index < (this.queNumInfo.singleNum + this.queNumInfo.judgeNum + this.queNumInfo.fillNum)) {
            // this.fillQueList[this.currentIndex - this.queNumInfo.singleNum - this.queNumInfo.judgeNum].isCollect = '1';
            this.$set(this.fillQueList[index - this.queNumInfo.singleNum - this.queNumInfo.judgeNum], "isCollect", '1')
          }
          else {
            // this.fillTwoQueList[this.currentIndex - this.queNumInfo.singleNum - this.queNumInfo.judgeNum - this.queNumInfo.fillNum].isCollect = '1';
            this.$set(this.fillTwoQueList[index - this.queNumInfo.singleNum - this.queNumInfo.judgeNum - this.queNumInfo.fillNum], "isCollect", '1')
          }
          if (this.updatePaperAnswerIsCollect(answerId, '1')) {
            Toast({
              message:'收藏成功',
              duration: 1000,
              position:'bottom'
            });
          }
        }
        else {
          if (index < this.queNumInfo.singleNum){
            // this.singleQueList[this.currentIndex].isCollect = '0'; 
            this.$set(this.singleQueList[index], "isCollect", '0')
          }
          else if (index < (this.queNumInfo.singleNum + this.queNumInfo.judgeNum)) {
            // this.judgeQueList[this.currentIndex - this.queNumInfo.singleNum].isCollect = '0';
            this.$set(this.judgeQueList[index - this.queNumInfo.singleNum], "isCollect", '0')
          }
          else if (index < (this.queNumInfo.singleNum + this.queNumInfo.judgeNum + this.queNumInfo.fillNum)) {
            // this.fillQueList[this.currentIndex - this.queNumInfo.singleNum - this.queNumInfo.judgeNum].isCollect = '0';
            this.$set(this.fillQueList[index - this.queNumInfo.singleNum - this.queNumInfo.judgeNum], "isCollect", '0')
          }
          else {
            this.$set(this.fillTwoQueList[index - this.queNumInfo.singleNum - this.queNumInfo.judgeNum - this.queNumInfo.fillNum], "isCollect", '0')
          }
          if (this.updatePaperAnswerIsCollect(answerId, '0')) {
            Toast({
              message:'已取消收藏',
              duration: 1000,
              position:'bottom'
            });
          }
        }
      },
      toBack(){
        this.$router.goBack();
      }
    },
    components: {
      HeaderTop
    },
    watch:{
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  .wrong
    width 90%
    padding-top 45px
    min-height 900px
    margin-left 5%
    .paper_container
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .que
        border-bottom 1px solid #ccc
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
            .red_op
              border 1px solid #FF0000
          .que_explain
            margin 10px 0
          .green_answer
          .red_answer  
            display inline-block
            padding 2px 8px
            margin 8px 10px 0 0
            border-radius 2px
            font-size 14px
          .green_answer
            border 1px solid #00CD66
            color #00CD66
            margin-top 10px
          .red_answer 
            border 1px solid #FF0000
            color #FF0000
          .que_img
            margin-top 10px
            >img
              height 120px
</style>
