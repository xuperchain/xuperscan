import axios from "axios";
import store from "../store"  ;
import config from "../config/index"; 

// 创建axios 实例
const service = axios.create({
  baseURL: config.baseURL, // api的base_url
  timeout: 4000, // 请求超时时间
});
// request 拦截器
service.interceptors.request.use(
  config => {
    let baseURL = (config.baseURL || store.state.baseURL_list_value[0].url);
    if (String(baseURL).indexOf(`http://`) == -1) {
      baseURL = `http://${baseURL}`;
    }
    config.baseURL = baseURL;
    return config;
  },
  error => {
  //  这里处理一些请求出错的情况
    Promise.reject(error);
  }
);
// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    return res;
  },
  error => {
    return Promise.reject(error);
  }
);

export default service;
