import { PERMISSION } from '@/types/permissions'

export default [{
  path: '/customers',
  name: PERMISSION.CUSTOMER.INDEX,
  component: () => import('./views/list/List'),
}, {
  path: '/customers/:id',
  name: PERMISSION.CUSTOMER.SHOW,
  component: () => import('./views/details/Details'),
}]
