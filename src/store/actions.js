/*
  Action:通过操作mutation间接更新state的多个方法的对象
 */

// 注意要引入api接口函数
import {
  reqLogout,
} from '@/api/mine'
import {
  RECEIVE_USER_INFO,
  RESET_USER_INFO,
  RECEIVE_USER_UNREADMSG_COUNT,
  RESET_USER_UNREADMSG_COUNT,
  RECEIVE_USER_FEEDBACK_INFO,
  RECORD_FEEDBACK_INFO,
  INIT_SINGLE_ANSWERS_LENGTH,
  INIT_MULTIPLE_ANSWERS_LENGTH,
  INIT_JUDGE_ANSWERS_LENGTH,
  INIT_FILL_ANSWERS_LENGTH,
  INIT_FILLTWO_ANSWERS_LENGTH,
  NEXT_QUE,
  PREV_QUE,
  RECORD_FIRST_CURRENT_TIME,
  RECORD_SINGLE_ANSWERS,
  RECORD_MULTIPLE_ANSWERS,
  RECORD_JUDGE_ANSWERS,
  RECORD_FILL_ANSWERS,
  RECORD_FILLTWO_ANSWERS,
  REFRESH_CURRENT_INDEX,
  REFRESH_SINGLE_ANSWERS,
  REFRESH_MULTIPLE_ANSWERS, REFRESH_JUDGE_ANSWERS, REFRESH_FILL_ANSWERS,REFRESH_FILLTWO_ANSWERS, REFRESH_FIRST_CURRENT_TIME
} from "./mutation-types";

export default {
  // 同步记录用户信息
  recordUser ({commit}, userInfo) {
    commit(RECEIVE_USER_INFO, {userInfo})
  },
  // 异步登出
  async logout ({commit}) {
    const result = await reqLogout()
    if (result.statu === 0) {
      commit(RESET_USER_INFO)
    }
  },
  //获取未读消息数目
  // async getUnreadMsgCount({commit, state}){
  //   const result = await reqUnreadMsgCount(state.userInfo.userPhone);
  //   if (result.statu === 0) {
  //     const unreadMsgCount = result.data;
  //     commit(RECEIVE_USER_UNREADMSG_COUNT,{unreadMsgCount})
  //   }
  // },
  //同步重置未读消息数目
  resetUnreadMsgCount({commit}){
    commit(RESET_USER_UNREADMSG_COUNT)
  },
  //异步获取反馈信息
  async receiveFeedbackInfo({commit, state}, setStore){
    // const result = await reqFeedbackInfo(state.userInfo.userPhone);
    // if (result.statu == 0){
    //   const feedbackInfo = result.data;
    //   commit(RECEIVE_USER_FEEDBACK_INFO, {feedbackInfo});
    //   setStore && setStore()
    // }
  },
  //同步记录反馈信息
  recordFeedbackInfo ({commit}, feedbackInfo) {
    commit(RECORD_FEEDBACK_INFO, {feedbackInfo})
  },

  //初始化单选题答案数组长度
  initSingleAnswersLength({commit}, singleNum) {
    commit(INIT_SINGLE_ANSWERS_LENGTH, {singleNum})
  },
  //初始化多选题答案数组长度
  initMultipleAnswersLength({commit}, multipleNum) {
    commit(INIT_MULTIPLE_ANSWERS_LENGTH, {multipleNum})
  },
  //初始化判断题答案数组长度
  initJudgeAnswersLength({commit}, judgeNum) {
    commit(INIT_JUDGE_ANSWERS_LENGTH, {judgeNum})
  },
  //初始化填空题答案数组长度
  initFillAnswersLength({commit}, fillNum) {
    commit(INIT_FILL_ANSWERS_LENGTH, {fillNum})
  },
  //初始化填空题二答案数组长度
  initFillTwoAnswersLength({commit}, fillTwoNum) {
    commit(INIT_FILLTWO_ANSWERS_LENGTH, {fillTwoNum})
  },

  //点击下一题
  nextQue({commit}) {
    commit(NEXT_QUE)
  },
  //点击上一题
  prevQue({commit}) {
    commit(PREV_QUE)
  },
  //记录当前花费时间
  recordFirstCurrentTime({commit}, firstCurrentTime) {
    commit(RECORD_FIRST_CURRENT_TIME, {firstCurrentTime})
  },
  //记录单选题答案到数组，第一个参数为数组下标，第二个参数为当前下标的值
  recordSingleAnswers({commit}, {currentIndex, singleAnswer}) {
    commit(RECORD_SINGLE_ANSWERS, {currentIndex, singleAnswer})
  },
  //记录多选题答案到数组，第一个参数为数组下标，第二个参数为当前下标的值
  recordMultipleAnswers({commit}, {currentIndex, multipleAnswer}) {
    commit(RECORD_MULTIPLE_ANSWERS, {currentIndex, multipleAnswer})
  },
  //记录判断题答案到数组，第一个参数为数组下标，第二个参数为当前下标的值
  recordJudgeAnswers({commit}, {currentIndex, judgeAnswer}) {
    commit(RECORD_JUDGE_ANSWERS, {currentIndex, judgeAnswer})
  },
  //记录填空题答案到数组，第一个参数为数组下标，第二个参数为当前下标的值
  recordFillAnswers({commit}, {currentIndex, fillAnswer}) {
    commit(RECORD_FILL_ANSWERS, {currentIndex, fillAnswer})
  },
  //记录填空题er答案到数组，第一个参数为数组下标，第二个参数为当前下标的值
  recordFillTwoAnswers({commit}, {currentIndex, fillTwoAnswer}) {
    commit(RECORD_FILLTWO_ANSWERS, {currentIndex, fillTwoAnswer})
  },
  //刷新从sessionStorage取出放入
  refreshCurrentIndex({commit}, currentIndex) {
    commit(REFRESH_CURRENT_INDEX, {currentIndex})
  },
  //刷新从sessionStorage取出放入
  refreshSingleAnswers({commit}, singleAnswers) {
    commit(REFRESH_SINGLE_ANSWERS, {singleAnswers})
  },
  //刷新从sessionStorage取出放入
  refreshMultipleAnswers({commit}, multipleAnswers) {
    commit(REFRESH_MULTIPLE_ANSWERS, {multipleAnswers})
  },
  //刷新从sessionStorage取出放入
  refreshJudgeAnswers({commit}, judgeAnswers) {
    commit(REFRESH_JUDGE_ANSWERS, {judgeAnswers})
  },
  //刷新从sessionStorage取出放入
  refreshFillAnswers({commit}, fillAnswers) {
    commit(REFRESH_FILL_ANSWERS, {fillAnswers})
  },
  //刷新从sessionStorage取出放入
  refreshFillTwoAnswers({commit}, fillTwoAnswers) {
    commit(REFRESH_FILLTWO_ANSWERS, {fillTwoAnswers})
  },
  //刷新从sessionStorage取出放入
  refreshFirstCurrentTime({commit}, firstCurrentTime) {
    commit(REFRESH_FIRST_CURRENT_TIME, {firstCurrentTime})
  }
}
