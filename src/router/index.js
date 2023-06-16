import { createRouter, createWebHistory } from 'vue-router'




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },

    {
      path: '/success',
      name: 'Success',
      component: () => import('../views/UserData.vue')
    },

    {
      path: '/account',
      name: 'Account',
      component: () => import('../views/akun.vue')
    },

    {
      path : '/app',
      name : 'decide',
      component: () => import('../views/decide.vue')
    },

    {
      path:'/park/:id',
      name : 'UserDetail',
      component : () => import('../views/UserDetail.vue')
    },

    {
      path:'/view',
      name : 'ShowQR',
      component : () => import('../views/viewqr.vue')
    },

    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    },

  ]
})

export default router
