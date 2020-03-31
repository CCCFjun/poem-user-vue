import ajax from './ajax'
const BASE_URL = "/api/user"
// const BASE_URL = "http://101.37.13.111:8085/api/user"

/*
  获取帖子类型列表
 */
export const reqGetLabelList = () => ajax(BASE_URL + '/getPostLabelList')
/*
  发帖
 */
export const reqAddPost = ({userPhone, postTitle, postContent, labelId}) => ajax(BASE_URL + '/userAddPost',{userPhone, postTitle, postContent, labelId},'POST')
/*
  获取全部帖子
 */
export const reqGetPostList = () => ajax(BASE_URL + '/getPostList')
/*
  通过帖子id获取信息
 */
export const reqGetPostDetailByPid = ({pid}) => ajax(BASE_URL + '/getPostDetailByPid',{pid} )
/*
  发帖
 */
export const reqAddReplay = ({userPhone, pid, replayContent}) => ajax(BASE_URL + '/userAddReplay',{userPhone, pid, replayContent},'POST')
/*
  通过帖子id获取评论
 */
export const reqGetReplayByPid = ({pid}) => ajax(BASE_URL + '/getReplayByPid',{pid} )
/*
  喜欢
 */
export const reqUpdateLikePost = ({pid, userPhone}) => ajax(BASE_URL + '/updateLikePost',{pid, userPhone},'POST')
/*
  喜欢列表pid
 */
export const reqGetAllLikePostOnlyPid = ({userPhone}) => ajax(BASE_URL + '/getAllLikePostOnlyPid',{userPhone} )
/*
  喜欢列表
 */
export const reqGetAllLikePost = ({userPhone}) => ajax(BASE_URL + '/getAllLikePost',{userPhone} )