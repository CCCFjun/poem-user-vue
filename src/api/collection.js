/*
  与后台交互模块 （依赖已封装的ajax函数）
 */
import ajax from './ajax'
// const BASE_URL = 'http://localhost:8080/api/student'
const BASE_URL = '/api/user'

/*
  获取全部收藏题目
*/
export const reqAllCollections = ({userPhone}) => ajax(BASE_URL + '/getAllCollections',{userPhone})
/*
  通过answerId获取收藏单选题目详情
 */
export const reqSingleByAnswerId = ({answerId}) => ajax(BASE_URL + '/getSingleByAnswerId', {answerId})
/*
  通过answerId获取收藏判断题目详情
 */
export const reqJudgeByAnswerId = ({answerId}) => ajax(BASE_URL + '/getJudgeByAnswerId', {answerId})
/*
  通过answerId获取收藏填空题目详情
 */
export const reqFillByAnswerId = ({answerId}) => ajax(BASE_URL + '/getFillByAnswerId', {answerId})
/*
  请求根据answerId更新学生试卷答案表isCollect字段
 */
export const reqUpdatePaperAnswerIsCollect = (answerId, isCollect) => ajax(BASE_URL + '/updatePaperAnswerIsCollect',{answerId, isCollect}, 'POST')