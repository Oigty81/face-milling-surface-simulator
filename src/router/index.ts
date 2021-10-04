import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import Home from '../views/Home.vue';
import Simulator from '../views/Simulator.vue';
import Settings from '../views/Settings.vue';

import Help from '../views/Help.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/Home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '',
        name: 'Simulator',
        component: Simulator,
      },
      {
        path: 'Settings',
        name: 'Settings',
        component: Settings,
      },
    ]
  },
  {
    path: '/Help',
    name: 'Help',
    component: Help
  },
  {
    path: '*',
    redirect: '/Home'
  }
];

const router = new VueRouter({
  //INFO: use history mode for production build when server is configure for SPA history mode
  mode: process.env.VUE_APP_HISTORYMODE === 'true' ? 'history' : 'hash',
  routes
});

export default router;
