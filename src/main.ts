import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import { BootstrapVue } from 'bootstrap-vue';
import ResizeComponentWithIndex from './plugins/ResizeComponentWithIndex';

import './styles/main.scss';

Vue.use(BootstrapVue);
Vue.use(ResizeComponentWithIndex);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
