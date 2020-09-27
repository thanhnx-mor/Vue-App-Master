import { SET_DEAL_ATTRIBUTES, SET_DEAL_STAGES, SET_DEAL_LEAD_TYPES, SET_DEAL_ACTION_RESULTS, SET_DEAL_ACTION_FLOWS, SET_DEAL_WORKFLOWS, SET_DEAL_ACTIONS } from '../type'

export const mutations = {
  [SET_DEAL_ATTRIBUTES](state: any, dealAttributes: any) {
    state.dealAttributes = dealAttributes
  },
  [SET_DEAL_WORKFLOWS](state: any, dealWorkflows: any) {
    state.dealWorkflows = dealWorkflows
  },
  [SET_DEAL_ACTIONS](state: any, dealActions: any) {
    state.dealActions = dealActions
  },
  [SET_DEAL_ACTION_RESULTS](state: any, dealActionResults: any) {
    state.dealActionResults = dealActionResults
  },
  [SET_DEAL_ACTION_FLOWS](state: any, dealActionFlows: any) {
    state.dealActionFlows = dealActionFlows
  },
  [SET_DEAL_STAGES](state: any, dealStages: any) {
    state.dealStages = dealStages
  },
  [SET_DEAL_LEAD_TYPES](state: any, dealLeadTypes: any) {
    state.dealLeadTypes = dealLeadTypes
  },
}
