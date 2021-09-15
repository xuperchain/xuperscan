// 一些全局的config配置
const modeUrlObj = {
  // 生产环境
  production: {
    // baseURL: "https://marketouchplus-uat.brandmax.com.cn/",
    authBaseURL: ""
  },
  // 开发环境
  development: {
    baseURL: "",
    authBaseURL: ""
  },
  // 测试环境
  test: {
    // baseURL: "https://marketouchplus-sim.brandmax.com.cn/",
    authBaseURL: ""
  }
};
export default modeUrlObj[process.env.NODE_ENV];
