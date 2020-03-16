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
// import Home from '../pages/Home/Home.vue'
// import Wrong from '../pages/Wrong/Wrong.vue'
// import Search from '../pages/Search/Search.vue'
// import Profile from '../pages/Profile/Profile.vue'
import Login from '@/pages/Login/Login.vue'
import ProfileInfo from '@/pages/ProfileInfo/ProfileInfo.vue'
import ProfileStuScore from '@/pages/ProfileStuScore/ProfileStuScore.vue'
import ProfileWrongCollection from '@/pages/ProfileWrongCollection/ProfileWrongCollection.vue'
import ProfileScoreDetail from '@/pages/ProfileScoreDetail/ProfileScoreDetail.vue'
// import ProfilePswChange from '@/pages/ProfilePswChange/ProfilePswChange.vue'
// import ProfileInfoChange from '@/pages/ProfileInfoChange/ProfileInfoChange.vue'
// import ProfileFeedback from '@/pages/ProfileFeedback/ProfileFeedback.vue'
import ProfileReplyDetail from '@/pages/ProfileReplyDetail/ProfileReplyDetail.vue'
// import ProfileExamCalendar from '@/pages/ProfileExamCalendar/ProfileExamCalendar.vue'
import WrongDetail from '@/pages/WrongDetail/WrongDetail.vue'

import Today from '@/pages/Today/index.vue'
import Sea from '@/pages/Sea/index.vue'
import PracticeDetail from '@/pages/Sea/PracticeDetail.vue'
import SinglePractice from '@/pages/Sea/PracticeStart/SinglePractice.vue'
import JudgePractice from '@/pages/Sea/PracticeStart/JudgePractice.vue'
import FillPractice from '@/pages/Sea/PracticeStart/FillPractice.vue'
import Exam from '@/pages/Exam/Exam.vue'
import ExamDetail from '@/pages/Exam/ExamDetail.vue'
import ExamStart from '@/pages/Exam/ExamStart.vue'
import ExamAnswer from '@/pages/Exam/ExamAnswer.vue'
import Profile from '@/pages/Mine/Profile.vue'
import ProfileInfoChange from '@/pages/Mine/ProfileInfoChange.vue'
import ProfilePswChange from '@/pages/Mine/ProfilePswChange.vue'
import ProfileFeedback from '@/pages/Mine/ProfileFeedback.vue'
import ProfileNotice from '@/pages/Mine/ProfileNotice.vue'
import CollectionList from '@/pages/Mine/Collection/CollectionList.vue'
import SingleCollection from '@/pages/Mine/Collection/SingleCollection.vue'
import JudgeCollection from '@/pages/Mine/Collection/JudgeCollection.vue'
import FillCollection from '@/pages/Mine/Collection/FillCollection.vue'

/*import PaperContainer from '../pages/HomePaperStart/PaperContainer/PaperContainer.vue'
import PaperCard from '../pages/HomePaperStart/PaperCard/PaperCard.vue'*/

// 路由组件懒加载
const Wrong = () => import('@/pages/Wrong/Wrong.vue')

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
      path: '/sea/practice/single/:kindId',
      component: SinglePractice
    },
    {
      path: '/sea/practice/judge/:kindId',
      component: JudgePractice
    },
    {
      path: '/sea/practice/fill/:kindId',
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
      path:'/profile/infochange',
      component:ProfileInfoChange
    },
    {
      path:'/profile/feedback',
      component:ProfileFeedback
    },
    {
      path:'/profile/profileNotice',
      component:ProfileNotice
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
      path:'/wrong',
      name:'Wrong',
      component:Wrong,
      meta: {
        showFooter: true
      }
    },
    {
      path: '/wrong/detail/:paperId',
      component: WrongDetail
    },

    {
      path: '/profile/info',
      component: ProfileInfo
    },
    {
      path: '/profile/stuscore',
      component: ProfileStuScore
    },
    {
      path: '/profile/wrongcollection',
      component: ProfileWrongCollection
    },
    // {
    //   path: '/profile/collection/single/:answerId',
    //   component: SingleCollection
    // },
    // {
    //   path: '/profile/collection/multiple/:answerId',
    //   component: MultipleCollection
    // },
    // {
    //   path: '/profile/collection/judge/:answerId',
    //   component: JudgeCollection
    // },
    // {
    //   path: '/profile/collection/fill/:answerId',
    //   component: FillCollection
    // },
    {
      path:'/profile/stuscore/detail/:paperId',
      component:ProfileScoreDetail
    },
    {
      path:'/profile/replydetail',
      component:ProfileReplyDetail
    },
    

    {
      path: '/login',
      name:'Login',
      component: Login
    }
  ]
})
