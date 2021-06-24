<template>
  <section class="user_notice">
    <van-nav-bar
      title="通知"
      left-arrow
      @click-left="$router.goBack()"
    />

    <div class="user_notice_detail" v-if="noticeList.length">
      <ul class="user_notice_detail_ul" v-for="(item, index) in noticeList" :key="index">
        <li class="user_notice_time_li">
          <span class="user_notice_time">发布时间：{{item.noticeCreateTime | date-format}}</span>
        </li>
        <li class="message_li">
          <viewer>
            <img src="../../common/imgs/adminlogo.png" alt />
          </viewer>
          <span>
            {{item.noticeContent}}
          </span>
        </li>
      </ul>

      <back-to-top
        :custom-style="myBackToTopStyle"
        :visibility-height="300"
        :back-position="0"
        transition-name="fade"
      />

      <div class="bottom_tips" style="margin-top: 30px">
        <span>我是有底线的</span>
      </div>
    </div>

    <div v-else class="no_user_notice_detail">
      <div class="no_user_notice_detail_text">暂无通知</div>
    </div>
  </section>
</template>

<script>
import HeaderTop from "../../components/HeaderTop/HeaderTop.vue";
import BackToTop from "../../components/BackToTop";
import { reqGetNoticesList } from "@/api/mine";
import { mapState } from "vuex";
export default {
  name: "",
  data() {
    return {
      myBackToTopStyle: {
        right: "15px",
        bottom: "15px",
        width: "40px",
        height: "40px",
        "border-radius": "4px",
        "line-height": "45px", // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: "#e7eaf1" // 按钮的背景颜色 The background color of the button
      },
      noticeList: []
    };
  },
  created() {
    this.getNoticesList();
  },
  methods: {
    async getNoticesList() {
      let result = await reqGetNoticesList();
      if (result.statu === 0) {
        this.noticeList = result.data
      }
      this.listLoading = false;
    }
  },
  components: {
    HeaderTop,
    BackToTop
  },
  computed: {
  }
};
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixins.styl';

.user_notice {
  background-color: #f5f5f5;
  height 100%
  .no_user_notice_detail {
    .no_user_notice_detail_text {
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      background-color: #fff;
    }
  }

  .user_notice_detail {
    list-style: none;
    
    padding-bottom: 20px;

    .user_notice_detail_ul {
      padding: 8px;
      font-size: 16px;

      .user_notice_time_li {
        width: 100%;
        display: flex;
        justify-content: center;
        padding-top: 14px;

        .user_notice_time {
          display: inline-block;
          padding: 5px;
          color: #8c8c8c;
          font-size: 14px;
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 5px;
        }
      }
    }

    .message_li {
      width: 100%;
      display: flex;
      padding-top: 15px;

      i {
        font-weight: bold;
        color: #02a774;
      }

      img {
        width: 44px;
        height: 44px;
        border-radius: 25px;
      }

      span {
        display: block;
        max-width: 220px;
        line-height: 25px;
        background: #fff;
        padding: 12px;
        border-radius: 10px;
        margin: 3px 10px 0 12px;
        box-shadow: 0 0 3px #ccc;
        position: relative;

        &:after, &:before {
          border: solid transparent;
          content: '';
          width: 0;
          height: 0;
          position: absolute;
        }

        &:after {
          border-width: 8px;
          border-right-color: #fff;
          left: -15px;
          top: 13px;
        }

        &:before {
          border-width: 9px;
          border-right-color: #ccc;
          left: -18px;
        }
      }
    }
  }
}
</style>
