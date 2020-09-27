import { SET_CUSTOMER_ATTRIBUTES, SET_CUSTOMER_DETAILS } from '../type'

export const mutations = {
  [SET_CUSTOMER_ATTRIBUTES](state: any, customerAttributes: any) {
    state.customerAttributes = customerAttributes
  },
  [SET_CUSTOMER_DETAILS](state: any, customer: any) {
    state.customer = customer
  },
}
