/*
  与后台交互模块 （依赖已封装的ajax函数）
 */
import ajax from './ajax'
const BASE_URL = 'api/user'
// const BASE_URL = 'https://www.fastmock.site/mock/0654ca1b5c81592c50136ed1f9afb5ff/poem/api/user'

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
export const reqSinglePractice = ({queNum}) => ajax(BASE_URL + '/getSinglePractice',{queNum})
export const reqJudgePractice = ({queNum}) => ajax(BASE_URL + '/getJudgePractice',{queNum})
export const reqFillPractice = ({queNum}) => ajax(BASE_URL + '/getFillPractice',{queNum})
export const reqFillTwoPractice = ({queNum}) => ajax(BASE_URL + '/getFillTwoPractice',{queNum})