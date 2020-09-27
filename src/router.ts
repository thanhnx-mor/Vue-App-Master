import Vue from 'vue'
import Router from 'vue-router'

import UserRouter from '@/modules/users/router'
import CustomersRouter from '@/modules/customers/router'
import RolesRouter from '@/modules/roles/router'
import SettingsRouter from '@/modules/settings/router'
import ContactsRouter from '@/modules/contacts/router'
import ProductsRouter from '@/modules/products/router'
import DealsRouter from '@/modules/deals/router'
import utils from '@/utils/utils'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [{
    path: '',
    name: 'main',
    component: () => import('./views/main/Main.vue'),
    children: [
      ...UserRouter,
      ...CustomersRouter,
      ...ContactsRouter,
      ...ProductsRouter,
      ...RolesRouter,
      ...SettingsRouter,
      ...DealsRouter,
    ],
  }, {
    path: '/login',
    name: 'login',
    component: () => import('@/modules/auth/views/login/Login.vue'),
  }, {
    path: '/403',
    name: 'Forbidden',
    component: () => import('./views/errors/forbidden/Forbidden.vue'),
  }, {
    path: '/404',
    name: 'NotFound',
    component: () => import('./views/errors/not-found/NotFound.vue'),
  }, {
    path: '*',
    redirect: '404',
  }],
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/403', '/404']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = utils.getCookie('access_token')

  if (authRequired && !loggedIn) {
    const { pathname, search } = window.location
    const returnUrl = pathname + search
    return next({ path: '/login', query: { returnUrl } })
  }
  if (loggedIn && to.name === 'login') {
    return next('/')
  }

  next()
})

export default router
