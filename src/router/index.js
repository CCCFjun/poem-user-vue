/*
  路由模块
*/
import Vue from 'vue'
import VueRouter from 'vue-router'
VueRouter.prototype.goBack = function () {
  this.isBack = true;
  window.history.go(-1)
};
// 引入路由组件文件夹下的组件
import Login from '@/pages/Login/Login.vue'
import Today from '@/pages/Today/index.vue'
import Sea from '@/pages/Sea/index.vue'
import PracticeDetail from '@/pages/Sea/PracticeDetail.vue'
import SinglePractice from '@/pages/Sea/PracticeStart/SinglePractice.vue'
import SingleTwoPractice from '@/pages/Sea/PracticeStart/SingleTwoPractice.vue'
import JudgePractice from '@/pages/Sea/PracticeStart/JudgePractice.vue'
import FillPractice from '@/pages/Sea/PracticeStart/FillPractice.vue'
import Exam from '@/pages/Exam/Exam.vue'
import ExamDetail from '@/pages/Exam/ExamDetail.vue'
import ExamStart from '@/pages/Exam/ExamStart.vue'
import ExamAnswer from '@/pages/Exam/ExamAnswer.vue'
import Forum from '@/pages/Forum/Forum.vue'
import AddPost from '@/pages/Forum/AddPost.vue'
import AddReplay from '@/pages/Forum/AddReplay.vue'
import PostDetail from '@/pages/Forum/PostDetail.vue'
import Profile from '@/pages/Mine/Profile.vue'
import ProfileInfoChange from '@/pages/Mine/ProfileInfoChange.vue'
import ProfileLike from '@/pages/Mine/ProfileLike.vue'
import ProfilePswChange from '@/pages/Mine/ProfilePswChange.vue'
import ProfileFeedback from '@/pages/Mine/ProfileFeedback.vue'
import ProfileNotice from '@/pages/Mine/ProfileNotice.vue'
import CollectionList from '@/pages/Mine/Collection/CollectionList.vue'
import SingleCollection from '@/pages/Mine/Collection/SingleCollection.vue'
import JudgeCollection from '@/pages/Mine/Collection/JudgeCollection.vue'
import FillCollection from '@/pages/Mine/Collection/FillCollection.vue'


Vue.use(VueRouter)

// 配置路由表并导出
export default new VueRouter({
  //  去掉地址中的哈希#
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/today'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/today',
      name:'Today',
      component: Today,
      // 此时的Home等都是返回路由组件的函数，只有请求对应的路由路径时(第一次)才会执行此函数并加载路由组件
      // 标识此路由是否显示FooterGuide
      meta: {
        showFooter: true
      }
    },
    {
      path: '/sea',
      name:'Sea',
      component: Sea,
      meta: {
        showFooter: true
      }
    },
    {
      path: '/sea/practice/detail/:kindId',
      component: PracticeDetail,
    },
    {
      path: '/sea/practice/single/:kindId/:praLayer',
      component: SinglePractice
    },
    {
      path: '/sea/practice/singleTwo/:kindId/:praLayer',
      component: SingleTwoPractice
    },
    {
      path: '/sea/practice/judge/:kindId/:praLayer',
      component: JudgePractice
    },
    {
      path: '/sea/practice/fill/:kindId/:praLayer',
      component: FillPractice
    },
    {
      path: '/exam',
      name:'Exam',
      component: Exam,
      meta: {
        showFooter: true
      }
    },
    {
      path:'/exam/detail/:paperId',
      component:ExamDetail
    },
    {
      path:'/exam/detail/start/:paperId',
      component:ExamStart,
    },
    {
      path:'/exam/detail/answer/:paperId',
      component:ExamAnswer,
    },
    {
      path: '/forum',
      name:'Forum',
      component: Forum,
      meta: {
        showFooter: true
      }
    },
    {
      path: '/forum/add/:labelId/:labelName',
      component: AddPost
    },
    {
      path: '/forum/detail/:pid/:userPhone',
      component: PostDetail
    },
    {
      path: '/forum/addReplay/:pid',
      component: AddReplay
    },
    {
      path:'/profile',
      name:'Profile',
      component:Profile,
      meta: {
        showFooter: true
      }
    },
    {
      path:'/profile/pswchange',
      component:ProfilePswChange
    },
    {
      path:'/profile/like',
      component:ProfileLike
    },
    {
      path:'/profile/infochange',
      component:ProfileInfoChange
    },
    {
      path: '/profile/collectionList',
      component: CollectionList
    },
    {
      path: '/profile/collection/single/:answerId',
      component: SingleCollection
    },
    {
      path: '/profile/collection/judge/:answerId',
      component: JudgeCollection
    },
    {
      path: '/profile/collection/fill/:answerId',
      component: FillCollection
    },
    {
      path:'/profile/feedback',
      component:ProfileFeedback
    },
    {
      path:'/profile/profileNotice',
      component:ProfileNotice
    }
    // {
    //   path:'/profile/replydetail',
    //   component:ProfileNotice
    // }
  ],
  scrollBehavior (to, from, savedPosition) { //切换页面时保持在顶部
    if (savedPosition) {
        return savedPosition
    } else {
        return { x: 0, y: 0 }
    }
  }
})
