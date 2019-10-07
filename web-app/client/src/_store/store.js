import Vue from 'vue';
import Vuex from 'vuex';

import { account } from './account.module';
import { alert } from './alert.module';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status_sidebar: false
  },
  actions: {
    changeStatusSidebar({ commit }) {
      commit('changeStatusSidebar');
    }
  },
  mutations: {
    changeStatusSidebar(state) {
      state.status_sidebar = !state.status_sidebar;
    }
  },
  modules: {
    account,
    alert
  }
});
