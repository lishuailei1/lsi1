import axios from 'axios'
import useUserStore from "../store/modules/user";
import { ElMessage } from 'element-plus'
let request = axios.create({
  // 基础路径
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000
})
// 请求拦截器
request.interceptors.request.use((config) => {
  let userStore = useUserStore()
  if(userStore.token){
    config.headers.token = userStore.token
  }
  return config
})
// 响应拦截器
request.interceptors.response.use((response) => {
  return response.data

}, (error) => {
  let message = ''
  let status = error.response.status
  switch (status) {
    case 401:
      message = 'token过期'
      break;
    case 403:
      message = '无权访问'
      break;
    case 404:
      message = '请求地址错误'
      break;
    case 500:
      message = '服务器出现问题'
      break
    default:
      message = '网络错误'
  };
  // 提示错误信息
  ElMessage({
    type: 'error',
    message
  })
  return Promise.reject(error)

})
export default request
