/*
  与后台交互模块 （依赖已封装的ajax函数）
 */
import ajax from './ajax'
const BASE_URL = "/api/user"

/*
  获取轮播图片数据
 */
export const reqRotationImages = () => ajax(BASE_URL + '/getRotationImgsList')
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
export const reqSinglePractice = ({queNum, kindId}) => ajax(BASE_URL + '/getSinglePractice',{queNum, kindId})
export const reqJudgePractice = ({queNum}) => ajax(BASE_URL + '/getJudgePractice',{queNum})
export const reqFillPractice = ({queNum}) => ajax(BASE_URL + '/getFillPractice',{queNum})
export const reqFillTwoPractice = ({queNum}) => ajax(BASE_URL + '/getFillTwoPractice',{queNum})