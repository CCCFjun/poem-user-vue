/*
  与后台交互模块 （依赖已封装的ajax函数）
 */
import ajax from './ajax'
const BASE_URL = "/api/user"
// const BASE_URL = "http://101.37.13.111:8085/api/user"

export const reqLogin = ({userPhone, userPsw}) => ajax(BASE_URL + '/checkUserLogin', {userPhone, userPsw}, 'POST')
/*
  用户注册
 */
export const reqRegister = ({newUserName,newUserPhone, newUserPsw, newUserPswConfirm}) => ajax(
  BASE_URL + '/userRegister',{newUserName,newUserPhone, newUserPsw, newUserPswConfirm},'POST'
)
/*
  用户信息修改
 */
export const reqInfoChange = (formData) => ajax(
  BASE_URL + '/userInfoChange',formData,'POST'
)
/*
  密码修改
 */
export const reqPswChange = ({userPhone, password, newPassword, newPasswordConfirm}) => ajax(
  BASE_URL + '/userPswChange',{userPhone, password, newPassword, newPasswordConfirm},'POST'
)
/*
  反馈留言
 */
export const reqSendFeedback = ({userPhone, feedback}) => ajax(BASE_URL + '/userSendFeedback',{userPhone, feedback},'POST')
/*
  获取公告列表
 */
export const reqGetNoticesList = () => ajax(BASE_URL + '/getNoticesList')
/*
  我的页面顶部右侧管理员回复消息提醒数目
 */
export const reqUnreadMsgCount = (userPhone) => ajax(BASE_URL + '/adminReplyCount', { userPhone })
