import ajax from './ajax'
const BASE_URL = "/api/user"
// const BASE_URL = "http://101.37.13.111:8085/api/user"

// 获取全部科举试卷信息
export const reqGetPapersList = () => ajax(BASE_URL + '/getAdminPapersList')

/*
  通过paperId获取试卷信息
 */
export const reqPapersInfoByPaperId = ({ paperId }) => ajax(BASE_URL + '/getPapersInfoByPaperId', { paperId })
/*
  请求获取当前试卷状态，即是否已完成
 */
export const reqCurrentPaperStatus = ({ userPhone, paperId }) => ajax(BASE_URL + '/getCurrentPaperStatus', { userPhone, paperId }, 'POST')
/*
  插入用户成绩表成绩信息，包含三个字段，考试开始时间、学号和试卷id，考试开始时间在后台插入
 */
export const reqInsertStudentPaperScore = ({userPhone, paperId}) => ajax(BASE_URL + '/insertStudentPaperScore',{userPhone, paperId},'POST')
/*
  提交答卷，插入用户成绩表成绩信息和试卷答题记录信息
 */
export const reqSubmitPaper = ({userPhone, paperId, singleAnswers, judgeAnswers, fillAnswers, fillTwoAnswers, timeUsed}) => ajax(
  BASE_URL + '/submitPaper',{userPhone, paperId, singleAnswers, judgeAnswers, fillAnswers, fillTwoAnswers, timeUsed},'POST')

/*
  通过userPhone和paperId获取已参与试卷的题目和个人回答
 */
export const reqPapersInfoByJoinedPaperId = ({userPhone, paperId}) => ajax(BASE_URL + '/getPapersInfoByJoinedPaperId',{userPhone, paperId})
/*
  请求根据answerId更新用户试卷答案表isCollect字段
 */
export const reqUpdatePaperAnswerIsCollect = (answerId, isCollect) => ajax(BASE_URL + '/updatePaperAnswerIsCollect',{answerId, isCollect}, 'POST')
/*
  获取paper的成绩排行
 */
export const reqScoreList = ({ paperId }) => ajax(BASE_URL + '/getScoreListByPaperId', { paperId })