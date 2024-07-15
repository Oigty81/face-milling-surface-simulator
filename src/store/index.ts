import Vue from 'vue';
import Vuex from 'vuex';

import CommonModule from './modules/Common';
import FileDataModule from './modules/FileData';
import MessageConsoleModule from './modules/MessageConsole';
import NcModule from './modules/Nc';
import ProfileModule from './modules/Profile';
import UtilitiesModule from './modules/Utilities';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    CommonModule,
    FileDataModule,
    MessageConsoleModule,
    NcModule,
    ProfileModule,
    UtilitiesModule
  }
});
