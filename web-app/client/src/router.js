import Vue from 'vue';
import Router from 'vue-router';
import AuthLayout from '@/layout/AuthLayout';
import HomePage from '@/layout/HomePage';
import AcademyLayout from '@/layout/AcademyLayout';
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
          component: () => import('./views/HomePage.vue')
        }
      ]
    },
    {
      path: '/',
      redirect: 'academy',
      component: AcademyLayout,
      children: [
        {
          path: '/academy',
          name: 'academyPage',
          component: () => import('./views/admin-academy/Academy.vue')
        },
        {
          path: '/academy/subjects',
          name: 'academy-subjects',
          component: () => import('./views/admin-academy/SubjectsManager')
        },
        {
          path: '/academy/subjects/:id/students',
          name: 'academy-subject-student',
          component: () => import('./views/admin-academy/SubjectStudents')
        },
        {
          path: '/profile',
          name: 'academy-profile',
          component: () => import('./views/ProfilePage')
        },
        {
          path: '/academy/teachers',
          name: 'academy-teachers',
          component: () => import('./views/admin-academy/TeacherManager')
        },
        {
          path: '/academy/teachers/:id/subjects',
          name: 'academy-teacher-subject',
          component: () => import('./views/admin-academy/TeacherSubjects')
        },
        {
          path: '/academy/students',
          name: 'academy-student',
          component: () => import('./views/admin-academy/StudentsManager')
        },
        {
          path: '/academy/students/:id/subjects',
          name: 'academy-student',
          component: () => import('./views/admin-academy/StudentSubjects')
        },
        {
          path: '/academy/certificates',
          name: 'academy-certificates',
          component: () => import('./views/admin-academy/CertificatesManager')
        },
        {
          path: '/academy/certificates/:id/students',
          name: 'academy-certificates-students',
          component: () => import('./views/admin-academy/CertificatesStudents')
        }
      ]
    },
    {
      path: '/',
      redirect: 'login',
      component: AuthLayout,
      children: [
        {
          path: '/login',
          name: 'login',
          component: () => import('./views/Login.vue')
        },
        {
          path: '/register',
          name: 'register',
          component: () => import('./views/Register.vue')
        }
      ]
    }
  ]
});
