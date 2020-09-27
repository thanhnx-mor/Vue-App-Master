import { PERMISSION } from '@/types/permissions'

export default [{
  path: '/users',
  name: PERMISSION.USER.INDEX,
  component: () => import('./views/list/List'),
}]
