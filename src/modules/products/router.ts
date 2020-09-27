import { PERMISSION } from '@/types/permissions'

export default [{
  path: '/products',
  name: PERMISSION.PRODUCT.INDEX,
  component: () => import('./views/list/List'),
}, {
  path: '/products/:id',
  name: PERMISSION.PRODUCT.SHOW,
  component: () => import('./views/details/Details'),
}]
