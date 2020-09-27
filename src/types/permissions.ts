export const
  PERMISSION = {
    USER: {
      '*': 'user',
      'INDEX': 'user.index',
      'STORE': 'user.store',
      'UPDATE': 'user.update',
      'DESTROY': 'user.destroy',
    },
    ROLE: {
      '*': 'role',
      'INDEX': 'role.index',
      'STORE': 'role.store',
      'UPDATE': 'role.update',
      'DESTROY': 'role.destroy',
    },
    CUSTOMER: {
      '*': 'customer',
      'INDEX': 'customer.list',
      'STORE': 'customer.store',
      'SHOW': 'customer.show',
      'UPDATE': 'customer.update',
      'DESTROY': 'customer.destroy',
      'EXPORT': 'customer.export',
      'IMPORT': 'customer.import',
      'ATTRIBUTE': {
        '*': 'customer.attribute',
        'INDEX': 'customer.attribute.index',
        'STORE': 'customer.attribute.store',
        'UPDATE': 'customer.attribute.update',
        'DESTROY': 'customer.attribute.destroy',
      },
    },
    CONTACT: {
      '*': 'contact',
      'INDEX': 'contact.list',
      'STORE': 'contact.store',
      'SHOW': 'contact.show',
      'UPDATE': 'contact.update',
      'DESTROY': 'contact.destroy',
      'EXPORT': 'contact.export',
      'IMPORT': 'contact.import',
      'ATTRIBUTE': {
        '*': 'contact.attribute',
        'INDEX': 'contact.attribute.index',
        'STORE': 'contact.attribute.store',
        'UPDATE': 'contact.attribute.update',
        'DESTROY': 'contact.attribute.destroy',
      },
    },
    PRODUCT: {
      '*': 'product',
      'INDEX': 'product.list',
      'STORE': 'product.store',
      'SHOW': 'product.show',
      'UPDATE': 'product.update',
      'DESTROY': 'product.destroy',
      'EXPORT': 'product.export',
      'IMPORT': 'product.import',
      'ATTRIBUTE': {
        '*': 'product.attribute',
        'INDEX': 'product.attribute.index',
        'STORE': 'product.attribute.store',
        'UPDATE': 'product.attribute.update',
        'DESTROY': 'product.attribute.destroy',
      },
    },
    DEAL: {
      '*': 'deal',
      'INDEX': 'deal.list',
      'STORE': 'deal.store',
      'SHOW': 'deal.show',
      'UPDATE': 'deal.update',
      'DESTROY': 'deal.destroy',
      'EXPORT': 'deal.export',
      'IMPORT': 'deal.import',
      'ATTRIBUTE': {
        '*': 'deal.attribute',
        'INDEX': 'deal.attribute.index',
        'STORE': 'deal.attribute.store',
        'UPDATE': 'deal.attribute.update',
        'DESTROY': 'deal.attribute.destroy',
      },
      'ME': {
        '*': 'deal.me',
        'INDEX': 'deal.me.index',
        'STORE': 'deal.me.store',
        'UPDATE': 'deal.me.update',
        'DESTROY': 'deal.me.destroy',
      },
      'PAYMENT': {
        '*': 'deal.payment',
        'INDEX': 'deal.payment.index',
        'STORE': 'deal.payment.store',
        'UPDATE': 'deal.payment.update',
        'DESTROY': 'deal.payment.destroy',
      },
      'WORKFLOW': {
        '*': 'deal.workflow',
        'INDEX': 'deal.workflow.index',
      },
    },
    SALE_MANAGEMENT: {
      '*': 'sale_management',
      'INDEX': 'sale_management.index',
      'STORE': 'sale_management.store',
      'UPDATE': 'sale_management.update',
      'DESTROY': 'sale_management.destroy',
    },
  }