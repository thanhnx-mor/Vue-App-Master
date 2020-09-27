import CustomerApi from '@/services/CustomerApi'
import {
  GET_CUSTOMER_ATTRIBUTES,
  SET_CUSTOMER_ATTRIBUTES,
  GET_CUSTOMER_ATTRIBUTE_CREATE,
  GET_CUSTOMER_ATTRIBUTE_SHOW,
  GET_CUSTOMER_ATTRIBUTE_UPDATE,
  GET_CUSTOMER_ATTRIBUTE_DELETE,
  GET_CUSTOMER_CHECK_BEFORE_ATTRIBUTE_DELETE,
  GET_CUSTOMER_DETAILS,
  SET_CUSTOMER_DETAILS,
} from '../type'

const customerApi = new CustomerApi()

export const actions = {
  async [GET_CUSTOMER_ATTRIBUTES](context: any) {
    try {
      const res = await customerApi.attributes()
      context.commit(SET_CUSTOMER_ATTRIBUTES, res.data)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_CUSTOMER_ATTRIBUTE_CREATE](context: any, params: object) {
    try {
      const res = await customerApi.createAttribute(params)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_CUSTOMER_ATTRIBUTE_SHOW](context: any, id: number) {
    try {
      const res = await customerApi.getAttribute(id)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_CUSTOMER_ATTRIBUTE_UPDATE](context: any, params: { id: number }) {
    try {
      const res = await customerApi.updateAttribute(params.id, params)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_CUSTOMER_CHECK_BEFORE_ATTRIBUTE_DELETE](context: any, id: number) {
    try {
      const res = await customerApi.checkCanDestroy(id)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_CUSTOMER_ATTRIBUTE_DELETE](context: any, id: number) {
    try {
      const res = await customerApi.removeAttribute(id)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_CUSTOMER_DETAILS](context: any, id: number) {
    try {
      const res = await customerApi.details(id)
      context.commit(SET_CUSTOMER_DETAILS, res.data)
      return res
    } catch (e) {
      return e
    }
  },
}
