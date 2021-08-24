/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'

import app from './module/app'
import user from './module/user'

// default router permission control
import permission from './module/permission'
import getters from './getter'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    permission
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})

store.subscribe((action) => {
  // console.log(action.type + ":" + store.state.app.sidebar);
});

export default store;
