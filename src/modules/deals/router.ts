import { PERMISSION } from '@/types/permissions'

export default [{
  path: '/deals',
  name: PERMISSION.DEAL.INDEX,
  component: () => import('./views/list/List'),
}, {
  path: '/deals/:id',
  name: PERMISSION.DEAL.SHOW,
  component: () => import('./views/details/Details'),
}, {
  path: '/deals-me',
  name: PERMISSION.DEAL.ME.INDEX,
  component: () => import('./views/me/list/List'),
}, {
  path: '/deals-payment',
  name: PERMISSION.DEAL.PAYMENT.INDEX,
  component: () => import('./views/accountancy/list/List'),
}]
