import Vue from "vue";
import Vuex from "vuex";
if (!window.VueRouter) {
  Vue.use(Vuex);
}
localStorage.getItem('From-Value');

export default new Vuex.Store({
  state: {
    local_url_list: [
      { name: 'XuperChain', url: 'http://127.0.0.1:8088' },
    ],
    add_local_url_list: [],
    baseURL_list_value:  window.localStorage.getItem("value_url")?JSON.parse(window.localStorage.getItem("value_url")):[{ name: '超级链', url: 'http://127.0.0.1:8088' }],
    ListeningToThe:0
  },
  mutations: {
    ADD_LOCAL_URL_LIST:(state, data)=>{
      state.add_local_url_list=data
    },
    LOCAL_URL_LIST:(state, data)=>{
      state.LOCAL_URL_LIST=data
    },
    BASEURL_LIST_VALUE:(state, data)=>{
      state.baseURL_list_value=data
    },
    LISTENING_TO_THE: (state, data) => {
      state.ListeningToThe=data
    }
  },
  actions: {},
  modules: {
  }
});
