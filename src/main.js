import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import '../src/assets/css/reset.css';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import 'lib-flexible'
import JsonViewer from 'vue-json-viewer'
import {formatDate} from './utils/util'
import _ from 'lodash'
Vue.use(Antd);
Vue.use(JsonViewer);
Vue.config.productionTip = false;
Vue.filter('formatDate', formatDate)
Vue.prototype._ = _
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
