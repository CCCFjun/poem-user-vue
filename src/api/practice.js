/*
  与后台交互模块 （依赖已封装的ajax函数）
 */
import ajax from './ajax'
// const BASE_URL = 'http://localhost:8080/api/student'
const BASE_URL = process.env.BASE_API

/*
  获取轮播图片数据
 */
export const reqRotationImages = () => ajax('api/user' + '/getRotationImages')
/*
  获取题型种类数据
 */
export const reqPracticeKind = () => ajax(BASE_URL + '/getPracticeKind')
/*
  获取题型信息
 */
export const reqKindInfoById = ({kindId}) => ajax(BASE_URL + '/getKindInfoById',{kindId})

export const reqSinglePractice = () => ajax('api/user' + '/getSinglePractice')
export const reqJudgePractice = () => ajax('api/user' + '/getJudgePractice')
export const reqFillPractice = () => ajax('api/user' + '/getFillPractice')
export const reqFillTwoPractice = () => ajax('api/user' + '/getFillTwoPractice')