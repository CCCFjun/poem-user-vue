/*
  State:状态对象
 */
export default {
  userInfo: {},// 用户信息

  currentIndex: 0,//当前题目索引，默认为0
  singleAnswers: [],//单选题答案数
  multipleAnswers: [],//多选题答案数组
  judgeAnswers: [],//判断题答案数组
  fillAnswers: [],//填空题答案数组
  fillTwoAnswers: [],//填空题答案数组
  firstCurrentTime:0,//花费时间
}
