import BaseApi from './BaseApi'

import { BASE_URL } from '@/types/config'

export default class DealApi extends BaseApi {

  private baseUrl: string = BASE_URL

  constructor() {
    super()
  }

  public attributes() {
    return this.get(`${this.baseUrl}deal-attributes`)
  }

  public createAttribute(body: any) {
    const config = { params: { is_popup: true } }
    return this.post(`${this.baseUrl}deal-attributes`, body, config)
  }

  public getAttribute(id: number) {
    return this.get(`${this.baseUrl}deal-attributes/${id}`)
  }

  public updateAttribute(id: number, body: object = {}) {
    const config = { params: { is_popup: true } }
    return this.put(`${this.baseUrl}deal-attributes/${id}`, body, config)
  }

  public removeAttribute(id: number) {
    const config = { params: { is_popup: true } }
    return this.delete(`${this.baseUrl}deal-attributes/${id}`, config)
  }

  public checkCanDestroy(id: number) {
    const config = { params: { is_popup: true } }
    return this.get(`${this.baseUrl}deal-attributes/check-can-destroy/${id}`, config)
  }

  public list(params: {
    page: number,
  }) {
    return this.get(`${this.baseUrl}deals`, { params })
  }

  public details(id: number) {
    return this.get(`${this.baseUrl}deals/${id}`)
  }

  public create(body: any) {
    const config = { params: { is_popup: true } }
    return this.post(`${this.baseUrl}deals`, body, config)
  }

  public update(id: number, body: any) {
    const config = { params: { is_popup: true } }
    return this.put(`${this.baseUrl}deals/${id}`, body, config)
  }

  public remove(id: number) {
    const config = { params: { is_popup: true } }
    return this.delete(`${this.baseUrl}deals/${id}`, config)
  }

  public filter(body: { search: string, page: number, filter: object }) {
    return this.post(`${this.baseUrl}deals/filter`, body)
  }

  public filterByMe(body: { search: string, page: number, filter: object }) {
    return this.post(`${this.baseUrl}deals/filter-by-me`, body)
  }

  public export(body: { search: string, page: number, filter: object, limit: number, offset: number }) {
    const config = { params: { is_popup: true } }
    return this.post(`${this.baseUrl}deals/export`, body, config)
  }

  public exportByMe(body: { search: string, page: number, filter: object, limit: number, offset: number }) {
    const config = { params: { is_popup: true } }
    return this.post(`${this.baseUrl}deals/export-by-me`, body, config)
  }

  public stats() {
    return this.get(`${this.baseUrl}deals/stats`)
  }

  public statsByMe() {
    return this.get(`${this.baseUrl}deals/stats-by-me`)
  }

  public dealActionHistories(params: { deal_id: number }) {
    return this.post(`${this.baseUrl}deal-action-histories/index`, params)
  }

  public createDealActionHistories(params: any) {
    const config = { params: { is_popup: true } }
    return this.post(`${this.baseUrl}deal-action-histories`, params, config)
  }

  // Deal workflows
  public listDealWorkflow() {
    return this.get(`${this.baseUrl}deal-workflows`)
  }

  public createDealWorkflow(params: any) {
    const config = { params: { is_popup: true } }
    return this.post(`${this.baseUrl}deal-workflows`, params, config)
  }

  public detailsDealWorkflow(id: number) {
    return this.get(`${this.baseUrl}deal-workflows/${id}`)
  }

  public updateDealWorkflow(id: number, body: any) {
    const config = { params: { is_popup: true } }
    return this.put(`${this.baseUrl}deal-workflows/${id}`, body, config)
  }

  public removeDealWorkflow(id: number) {
    const config = { params: { is_popup: true } }
    return this.delete(`${this.baseUrl}deal-workflows/${id}`, config)
  }

  // Deal actions
  public listDealAction() {
    return this.get(`${this.baseUrl}deal-actions`)
  }

  public createDealAction(params: any) {
    const config = { params: { is_popup: true } }
    return this.post(`${this.baseUrl}deal-actions`, params, config)
  }

  public detailsDealAction(id: number) {
    return this.get(`${this.baseUrl}deal-actions/${id}`)
  }

  public updateDealAction(id: number, body: any) {
    const config = { params: { is_popup: true } }
    return this.put(`${this.baseUrl}deal-actions/${id}`, body, config)
  }

  public removeDealAction(id: number) {
    const config = { params: { is_popup: true } }
    return this.delete(`${this.baseUrl}deal-actions/${id}`, config)
  }

  // Deal action results
  public listDealActionResult() {
    return this.get(`${this.baseUrl}deal-action-results`)
  }

  public createDealActionResult(params: any) {
    const config = { params: { is_popup: true } }
    return this.post(`${this.baseUrl}deal-action-results`, params, config)
  }

  public detailsDealActionResult(id: number) {
    return this.get(`${this.baseUrl}deal-action-results/${id}`)
  }

  public updateDealActionResult(id: number, body: any) {
    const config = { params: { is_popup: true } }
    return this.put(`${this.baseUrl}deal-action-results/${id}`, body, config)
  }

  public removeDealActionResult(id: number) {
    const config = { params: { is_popup: true } }
    return this.delete(`${this.baseUrl}deal-action-results/${id}`, config)
  }


  // Deal action flows
  public listDealActionFlow() {
    return this.get(`${this.baseUrl}deal-action-flows`)
  }

  public createDealActionFlow(params: any) {
    const config = { params: { is_popup: true } }
    return this.post(`${this.baseUrl}deal-action-flows`, params, config)
  }

  public detailsDealActionFlow(id: number) {
    return this.get(`${this.baseUrl}deal-action-flows/${id}`)
  }

  public updateDealActionFlow(id: number, body: any) {
    const config = { params: { is_popup: true } }
    return this.put(`${this.baseUrl}deal-action-flows/${id}`, body, config)
  }

  public removeDealActionFlow(id: number) {
    const config = { params: { is_popup: true } }
    return this.delete(`${this.baseUrl}deal-action-flows/${id}`, config)
  }

  // Deal stages
  public listDealStage() {
    return this.get(`${this.baseUrl}deal-stages`)
  }

  public createDealStage(params: any) {
    const config = { params: { is_popup: true } }
    return this.post(`${this.baseUrl}deal-stages`, params, config)
  }

  public detailsDealStage(id: number) {
    return this.get(`${this.baseUrl}deal-stages/${id}`)
  }

  public updateDealStage(id: number, body: any) {
    const config = { params: { is_popup: true } }
    return this.put(`${this.baseUrl}deal-stages/${id}`, body, config)
  }

  public removeDealStage(id: number) {
    const config = { params: { is_popup: true } }
    return this.delete(`${this.baseUrl}deal-stages/${id}`, config)
  }

  // Deal lead types
  public listDealLeadType() {
    return this.get(`${this.baseUrl}deal-lead-types`)
  }

  public createDealLeadType(params: any) {
    const config = { params: { is_popup: true } }
    return this.post(`${this.baseUrl}deal-lead-types`, params, config)
  }

  public detailsDealLeadType(id: number) {
    return this.get(`${this.baseUrl}deal-lead-types/${id}`)
  }

  public updateDealLeadType(id: number, body: any) {
    const config = { params: { is_popup: true } }
    return this.put(`${this.baseUrl}deal-lead-types/${id}`, body, config)
  }

  public removeDealLeadType(id: number) {
    const config = { params: { is_popup: true } }
    return this.delete(`${this.baseUrl}deal-lead-types/${id}`, config)
  }

  // Deal payment
  public listDealPayment(params: { deal_id: number }) {
    return this.post(`${this.baseUrl}deal-payment-histories/index`, params)
  }

  public createDealPayment(params: any) {
    const config = { params: { is_popup: true } }
    return this.post(`${this.baseUrl}deal-payment-histories`, params, config)
  }
}
