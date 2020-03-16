<template>
  <section class="wrong_collection">
    <!--利用$router.back()返回上一级路由 -->
    <HeaderTop title="收藏题目">
      <a href="javascript:" slot="left" class="go_back" @click="$router.goBack()">
        <i class="iconfont iconxiazai6"></i>返回
      </a>
    </HeaderTop>

    <!--ly-tab实现触摸滑动具有回弹效果的分类导航-->
    <ly-tab
      v-model="selectedId"
      :items="items"
      :options="options"
      v-if="userInfo.sno"
      @change="clickTab">
    </ly-tab>

    <!--显示收藏题目列表-->
    <div class="collections_list">
      <mt-loadmore :top-method="loadTop" ref="loadmore">
        <div v-for="(item, index) in collectionsList" :key="index" @click="toCollectionDetail(item.answerId, item.queType)">
          <ProfileItem :title="item.content" icon="iconshoucangxuanzhong"></ProfileItem>
        </div>
        <div v-if="!isCollectionsList" class="bottom_tips" style="margin-top: 25px">
          <span>我是有底线的</span>
        </div>
      </mt-loadmore>
    </div>

    <!--无收藏题目列表显示的内容-->
    <div class="no_collections_list" v-if="userInfo.userPhone && isCollectionsList">
      <img src="@/common/imgs/nopaperwrong.png" alt="">
      <h3>暂无收藏记录</h3>
    </div>

    <!--点击返回顶部按钮-->
    <back-to-top :custom-style="myBackToTopStyle" :visibility-height="300" :back-position="0" transition-name="fade" />
  </section>
</template>

<script>
  import HeaderTop from '@/components/HeaderTop/HeaderTop.vue'
  import ProfileItem from '@/components/ProfileItem/ProfileItem.vue'
  import BackToTop from '@/components/BackToTop'
  import {Toast} from 'mint-ui'
  import {mapState} from 'vuex'
  import {reqAllCollections} from '@/api/collection'
  export default {
    name: "",
    data() {
      return {
        myBackToTopStyle: {
          right: '15px',
          bottom: '15px',
          width: '40px',
          height: '40px',
          'border-radius': '4px',
          'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
          background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
        },
        userPhone:this.$store.state.userInfo.userPhone,
        noticesList:this.$store.state.examCalendar,
        selectedId: 0,
        items:[
          {queType:0, label:'全部'},
          {queType:1, label:'单选题'},
          {queType:2, label:'多选题'},
          {queType:3, label:'选择题'},
          {queType:4, label:'填空题'}
        ],
        options: {
          activeColor: '#4ab8a1',
          // 可在这里指定labelKey为你数据里文字对应的字段
          // labelKey: 'langName'
        },
        collectionsList:[],
        isCollectionsList:false
      }
    },
    created(){
      this.getAllCollections();
    },
    computed: {
      optionLeft () {
        return {
          direction: 2,
          limitMoveNum: 2,
          // hoverStop: false
        }
      },
      ...mapState(['userInfo'])
    },
    methods: {
      loadTop() {
        if (this.selectedId === 0){
          this.getAllCollections();
        } else {
          this.getCollectionsById(this.selectedId);
        }
        setTimeout(() => {
          this.$refs.loadmore.onTopLoaded()
        }, 1000)
      },
      async getAllCollections(){
        const {userPhone} = this;
        let result = await reqAllCollections({userPhone});
        if (result.statu == 0){
          this.collectionsList = result.data;
        }
        else {
          Toast({
            message:result.msg,
            duration: 1500
          });
        }
      },
      clickTab(item, index){
        if (item.queType == 0){
          this.getAllCollections();
        }
        else {
          this.getCollectionsById(item.queType);
        }
      },
      toCollectionDetail(answerId, queType){
        if (queType == 1){
          this.$router.push('/profile/collection/single/' + answerId)
        }
        else if (queType == 2){
          this.$router.push('/profile/collection/judge/' + answerId)
        }
        else {
          this.$router.push('/profile/collection/fill/' + answerId)
        }
      }
    },
    components:{
      HeaderTop,
      ProfileItem,
      BackToTop
    },
    //监听collectionsList长度，确定是否显示暂无收藏题目图标
    watch:{
      collectionsList (value) {
        if (!value.length){
          this.isCollectionsList = true;
        }
        else {
          this.isCollectionsList = false;
        }
      }
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  @import '~@/common/stylus/mixins.styl'
  .wrong_collection
    padding-top 45px
    width 100%
    height 100%
    background-color #f5f5f5
    .no_collections_list
      display flex
      padding-top 100px
      flex-direction column
      align-items center
      >img
        width 250px
      >h3
        font-size 17px
        color #6a6a6a
    .collections_list
      padding-bottom 6px
</style>
