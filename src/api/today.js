import ajax from './ajax'

// 获取每日一句诗词
export const reqPoem = () => ajax("https://v1.jinrishici.com/all" )