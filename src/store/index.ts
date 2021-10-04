import Vue from 'vue';
import Vuex from 'vuex';

import CommonModule from './modules/Common';
import MessageConsoleModule from './modules/MessageConsole';
import NcModule from './modules/Nc';
import ProfileModule from './modules/Profile';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    CommonModule,
    MessageConsoleModule,
    NcModule,
    ProfileModule
  }
});
