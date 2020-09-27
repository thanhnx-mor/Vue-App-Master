import ContactApi from '@/services/ContactApi'
import {
  GET_CONTACT_ATTRIBUTES,
  SET_CONTACT_ATTRIBUTES,
  GET_CONTACT_ATTRIBUTE_CREATE,
  GET_CONTACT_ATTRIBUTE_SHOW,
  GET_CONTACT_ATTRIBUTE_UPDATE,
  GET_CONTACT_ATTRIBUTE_DELETE,
  GET_CONTACT_CHECK_BEFORE_ATTRIBUTE_DELETE,
} from '../type'

const contactApi = new ContactApi()

export const actions = {
  async [GET_CONTACT_ATTRIBUTES](context: any) {
    try {
      const res = await contactApi.attributes()
      context.commit(SET_CONTACT_ATTRIBUTES, res.data)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_CONTACT_ATTRIBUTE_CREATE](context: any, params: object) {
    try {
      const res = await contactApi.createAttribute(params)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_CONTACT_ATTRIBUTE_SHOW](context: any, id: number) {
    try {
      const res = await contactApi.getAttribute(id)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_CONTACT_ATTRIBUTE_UPDATE](context: any, params: { id: number }) {
    try {
      const res = await contactApi.updateAttribute(params.id, params)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_CONTACT_CHECK_BEFORE_ATTRIBUTE_DELETE](context: any, id: number) {
    try {
      const res = await contactApi.checkCanDestroy(id)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_CONTACT_ATTRIBUTE_DELETE](context: any, id: number) {
    try {
      const res = await contactApi.removeAttribute(id)
      return res
    } catch (e) {
      return e
    }
  },
}
