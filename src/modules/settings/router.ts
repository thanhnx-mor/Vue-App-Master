import { PERMISSION } from '@/types/permissions'

export default [{
  path: '/settings/customer-attributes',
  name: PERMISSION.CUSTOMER.ATTRIBUTE.INDEX,
  component: () => import('./views/customer/attributes/list/List'),
}, {
  path: '/settings/contact-attributes',
  name: PERMISSION.CONTACT.ATTRIBUTE.INDEX,
  component: () => import('./views/contact/attributes/list/List'),
}, {
  path: '/settings/product-attributes',
  name: PERMISSION.PRODUCT.ATTRIBUTE.INDEX,
  component: () => import('./views/product/attributes/list/List'),
}, {
  path: '/settings/deal-attributes',
  name: PERMISSION.DEAL.ATTRIBUTE.INDEX,
  component: () => import('./views/deal/attributes/list/List'),
}, {
  path: '/settings/deal-workflow',
  name: PERMISSION.DEAL.WORKFLOW.INDEX,
  component: () => import('./views/deal/workflow/list/List'),
}, {
  path: '/settings/deal-action',
  name: 'dealAction',
  component: () => import('./views/deal/action/list/List'),
  meta: {
    hasPermission: true,
  },
}, {
  path: '/settings/deal-action-result',
  name: 'dealActionResult',
  component: () => import('./views/deal/actionResult/list/List'),
  meta: {
    hasPermission: true,
  },
}, {
  path: '/settings/deal-stage',
  name: 'dealStage',
  component: () => import('./views/deal/stage/list/List'),
  meta: {
    hasPermission: true,
  },
}, {
  path: '/settings/deal-lead-type',
  name: 'dealLeadType',
  component: () => import('./views/deal/leadType/list/List'),
  meta: {
    hasPermission: true,
  },
}, {
  path: '/settings/sale-managment',
  name: PERMISSION.SALE_MANAGEMENT.INDEX,
  component: () => import('@/modules/sales/views/list/List'),
}]
