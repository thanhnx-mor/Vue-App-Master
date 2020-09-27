import DealApi from '@/services/DealApi'
import {
  GET_DEAL_ATTRIBUTES,
  SET_DEAL_ATTRIBUTES,
  GET_DEAL_ATTRIBUTE_CREATE,
  GET_DEAL_ATTRIBUTE_SHOW,
  GET_DEAL_ATTRIBUTE_UPDATE,
  GET_DEAL_ATTRIBUTE_DELETE,
  GET_DEAL_CHECK_BEFORE_ATTRIBUTE_DELETE,
  GET_DEAL_STAGES,
  SET_DEAL_STAGES,
  GET_DEAL_LEAD_TYPES,
  SET_DEAL_LEAD_TYPES,
  GET_DEAL_ACTION_RESULTS,
  SET_DEAL_ACTION_RESULTS,
  GET_DEAL_WORKFLOWS,
  SET_DEAL_WORKFLOWS,
  GET_DEAL_ACTIONS,
  SET_DEAL_ACTIONS,
  GET_DEAL_ACTION_FLOWS,
  SET_DEAL_ACTION_FLOWS,
} from '../type'

const dealApi = new DealApi()

export const actions = {
  async [GET_DEAL_ATTRIBUTES](context: any) {
    try {
      const res = await dealApi.attributes()
      context.commit(SET_DEAL_ATTRIBUTES, res.data)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_DEAL_ATTRIBUTE_CREATE](context: any, params: object) {
    try {
      const res = await dealApi.createAttribute(params)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_DEAL_ATTRIBUTE_SHOW](context: any, id: number) {
    try {
      const res = await dealApi.getAttribute(id)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_DEAL_ATTRIBUTE_UPDATE](context: any, params: { id: number }) {
    try {
      const res = await dealApi.updateAttribute(params.id, params)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_DEAL_CHECK_BEFORE_ATTRIBUTE_DELETE](context: any, id: number) {
    try {
      const res = await dealApi.checkCanDestroy(id)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_DEAL_ATTRIBUTE_DELETE](context: any, id: number) {
    try {
      const res = await dealApi.removeAttribute(id)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_DEAL_WORKFLOWS](context: any) {
    try {
      const res = await dealApi.listDealWorkflow()
      context.commit(SET_DEAL_WORKFLOWS, res.data)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_DEAL_ACTIONS](context: any) {
    try {
      const res = await dealApi.listDealAction()
      context.commit(SET_DEAL_ACTIONS, res.data)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_DEAL_ACTION_RESULTS](context: any) {
    try {
      const res = await dealApi.listDealActionResult()
      context.commit(SET_DEAL_ACTION_RESULTS, res.data)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_DEAL_ACTION_FLOWS](context: any) {
    try {
      const res = await dealApi.listDealActionFlow()
      context.commit(SET_DEAL_ACTION_FLOWS, res.data)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_DEAL_STAGES](context: any) {
    try {
      const res = await dealApi.listDealStage()
      context.commit(SET_DEAL_STAGES, res.data)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_DEAL_LEAD_TYPES](context: any) {
    try {
      const res = await dealApi.listDealLeadType()
      context.commit(SET_DEAL_LEAD_TYPES, res.data)
      return res
    } catch (e) {
      return e
    }
  },
}
