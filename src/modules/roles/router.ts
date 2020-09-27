import { PERMISSION } from '@/types/permissions'
export default [{
    path: '/roles',
    name: PERMISSION.ROLE.INDEX,
    component: () => import('./views/list/List'),
}]
