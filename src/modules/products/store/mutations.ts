import { SET_PRODUCT_ATTRIBUTES } from '../type'

export const mutations = {
  [SET_PRODUCT_ATTRIBUTES](state: any, productAttributes: any) {
    state.productAttributes = productAttributes
  },
}
