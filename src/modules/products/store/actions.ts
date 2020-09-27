import ProductApi from '@/services/ProductApi'
import {
  GET_PRODUCT_ATTRIBUTES,
  SET_PRODUCT_ATTRIBUTES,
  GET_PRODUCT_ATTRIBUTE_CREATE,
  GET_PRODUCT_ATTRIBUTE_SHOW,
  GET_PRODUCT_ATTRIBUTE_UPDATE,
  GET_PRODUCT_ATTRIBUTE_DELETE,
  GET_PRODUCT_CHECK_BEFORE_ATTRIBUTE_DELETE,
} from '../type'

const productApi = new ProductApi()

export const actions = {
  async [GET_PRODUCT_ATTRIBUTES](context: any) {
    try {
      const res = await productApi.attributes()
      context.commit(SET_PRODUCT_ATTRIBUTES, res.data)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_PRODUCT_ATTRIBUTE_CREATE](context: any, params: object) {
    try {
      const res = await productApi.createAttribute(params)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_PRODUCT_ATTRIBUTE_SHOW](context: any, id: number) {
    try {
      const res = await productApi.getAttribute(id)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_PRODUCT_ATTRIBUTE_UPDATE](context: any, params: { id: number }) {
    try {
      const res = await productApi.updateAttribute(params.id, params)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_PRODUCT_CHECK_BEFORE_ATTRIBUTE_DELETE](context: any, id: number) {
    try {
      const res = await productApi.checkCanDestroy(id)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_PRODUCT_ATTRIBUTE_DELETE](context: any, id: number) {
    try {
      const res = await productApi.removeAttribute(id)
      return res
    } catch (e) {
      return e
    }
  },
}
