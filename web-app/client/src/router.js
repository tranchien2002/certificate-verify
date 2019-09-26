import Vue from 'vue';
import Router from 'vue-router';
// import DashboardLayout from '@/layout/DashboardLayout';
// import AuthLayout from '@/layout/AuthLayout';
import HomePage from '@/layout/HomePage';
Vue.use(Router);

export default new Router({
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: 'home',
      component: HomePage,
      children: [
        {
          path: '/home',
          name: 'homepage',
          component: () => import(/* webpackChunkName: "demo" */ './views/HomePage.vue')
        }
      ]
    }
  ]
});
