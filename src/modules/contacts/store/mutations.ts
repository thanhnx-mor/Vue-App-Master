import { SET_CONTACT_ATTRIBUTES } from '../type'

export const mutations = {
  [SET_CONTACT_ATTRIBUTES](state: any, contactAttributes: any) {
    state.contactAttributes = contactAttributes
  },
}
