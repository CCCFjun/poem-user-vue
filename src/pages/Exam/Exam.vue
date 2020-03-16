<template>
  <section class="paper">
    <!--利用$router.back()返回上一级路由 -->
    <HeaderTop title="科举"></HeaderTop>

    <!-- <mt-loadmore v-if="papersInfo.length" :top-method="loadTop" ref="loadmore"> -->
    <div class="paper_list" v-for="(item) in papersInfo" :key="item.paperId" @click="toPaperDetail(item.paperId)">
      <div class="item_border" >
        <div class="paper_list_item" >
          <span class="paper_title">
            <span class="icon_paper">科举</span>
            {{item.paperName}}
          </span>
          <img
            class="paper_img"
            :src="item.paperImgSrc"
          />
          <span class="paper_participate">{{item.participateNum}}人已参与</span>
        </div>
      </div>
    </div>
    <div class="bottom_tips">
      <span>我是有底线的</span>
    </div>
    <!-- </mt-loadmore> -->
    <!--</transition-group>-->

    <back-to-top
      :custom-style="myBackToTopStyle"
      :visibility-height="300"
      :back-position="0"
      transition-name="fade"
    />
  </section>
</template>

<script>
import HeaderTop from "../../components/HeaderTop/HeaderTop.vue";
import BackToTop from "../../components/BackToTop";
import { reqGetPapersList } from "@/api/exam";
import { Toast } from "mint-ui";
import Star from "../../components/Star/Star.vue";
import { mapState } from "vuex";
export default {
  name: "",
  data() {
    return {
      papersInfo: [],
      myBackToTopStyle: {
          right: '37px',
          bottom: '90px',
          width: '40px',
          height: '40px',
          'border-radius': '4px',
          'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
          background: '#909399'// 按钮的背景颜色 The background color of the button
      },
    };
  },
  computed: {},
  created() {
    this.getPapersInfo();
  },
  methods: {
    async getPapersInfo() {
      let result = await reqGetPapersList();
      if (result.statu == 0) {
        this.papersInfo = result.data.papersList;
      } else {
        Toast({
          message: result.msg,
          duration: 2000
        });
      }
    },
    toPaperDetail(paperId){
      if (!this.$store.state.userInfo.userPhone){
          Toast({
            message:'请先登录系统',
            duration: 1000
          });
          return
      }else{
        this.$router.push('/exam/detail/' + paperId)
      }
      
    },
  },
  components: {
    HeaderTop,
    Star,
    BackToTop
  }
};
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixins.styl';

.paper {
  padding-top: 45px;
  width: 100%;
  background-color: #f5f5f5;
  margin-bottom 50px
  .paper_list {
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    .item_border{
      border-bottom: 1px solid #CDC9C9;
      .paper_list_item {
        display: flex;
        flex-direction: column;
        width: 86%;
        margin: 0 auto;
        margin-top: 8px;
        .paper_title {
          height: 50px;
          line-height: 50px;
          font-size: 16px;
        }
        .paper_participate {
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          color: #ccc;
          display: flex;
          justify-content: space-between;
        }
        .paper_img {
          height: 120px;
        }
        .icon_paper {
          border: 1px solid #B22222;
          border-radius: 36%;
          padding: 3px 8px;
          color: #B22222;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
