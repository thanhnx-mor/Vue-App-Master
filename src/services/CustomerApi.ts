import BaseApi from './BaseApi'

import { BASE_URL } from '@/types/config'

export default class CustomerApi extends BaseApi {

  private baseUrl: string = BASE_URL

  constructor() {
    super()
  }

  public attributes() {
    return this.get(`${this.baseUrl}customer-attributes`)
  }

  public createAttribute(body: any) {
    const config = { params: { is_popup: true } }
    return this.post(`${this.baseUrl}customer-attributes`, body, config)
  }

  public getAttribute(id: number) {
    return this.get(`${this.baseUrl}customer-attributes/${id}`)
  }

  public updateAttribute(id: number, body: object = {}) {
    const config = { params: { is_popup: true } }
    return this.put(`${this.baseUrl}customer-attributes/${id}`, body, config)
  }

  public removeAttribute(id: number) {
    const config = { params: { is_popup: true } }
    return this.delete(`${this.baseUrl}customer-attributes/${id}`, config)
  }

  public checkCanDestroy(id: number) {
    const config = { params: { is_popup: true } }
    return this.get(`${this.baseUrl}customer-attributes/check-can-destroy/${id}`, config)
  }

  public list(params: {
    page: number,
  }) {
    return this.get(`${this.baseUrl}customers`, { params })
  }

  public details(id: number) {
    return this.get(`${this.baseUrl}customers/${id}`)
  }

  public create(body: any) {
    const config = { params: { is_popup: true } }
    return this.post(`${this.baseUrl}customers`, body, config)
  }

  public update(id: number, body: any) {
    const config = { params: { is_popup: true } }
    return this.put(`${this.baseUrl}customers/${id}`, body, config)
  }

  public remove(id: number) {
    const config = { params: { is_popup: true } }
    return this.delete(`${this.baseUrl}customers/${id}`, config)
  }

  public filter(body: { search: string, page: number, filter: object }) {
    return this.post(`${this.baseUrl}customers/filter`, body)
  }

  public export(body: { search: string, page: number, filter: object, limit: number, offset: number }) {
    const config = { params: { is_popup: true } }
    return this.post(`${this.baseUrl}customers/export`, body, config)
  }
}
