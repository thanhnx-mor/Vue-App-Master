import { PERMISSION } from '@/types/permissions'

export default [{
  path: '/contacts',
  name: PERMISSION.CONTACT.INDEX,
  component: () => import('./views/list/List'),
}, {
  path: '/contacts/:id',
  name: PERMISSION.CONTACT.SHOW,
  component: () => import('./views/details/Details'),
}]
