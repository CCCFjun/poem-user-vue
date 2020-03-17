/*
  与后台交互模块 （依赖已封装的ajax函数）
 */
import ajax from './ajax'
// const BASE_URL = 'http://localhost:8080/api/student'
const BASE_URL = 'api/user'

/*
  获取轮播图片数据
 */
export const reqRotationImages = () => ajax('api/admin' + '/getRotationImgsList')
/*
  获取题型种类数据
 */
export const reqPracticeKind = () => ajax(BASE_URL + '/getPracticeKind')
/*
  获取题型信息
 */
export const reqKindInfoById = ({kindId}) => ajax(BASE_URL + '/getKindInfoById',{kindId})
/*
  随机出题
 */
export const reqSinglePractice = () => ajax(BASE_URL + '/getSinglePractice')
export const reqJudgePractice = () => ajax(BASE_URL + '/getJudgePractice')
export const reqFillPractice = () => ajax(BASE_URL + '/getFillPractice')
export const reqFillTwoPractice = () => ajax(BASE_URL + '/getFillTwoPractice')