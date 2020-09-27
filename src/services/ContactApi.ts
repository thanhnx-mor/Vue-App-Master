import BaseApi from './BaseApi'

import { BASE_URL } from '@/types/config'

export default class ContactApi extends BaseApi {

  private baseUrl: string = BASE_URL

  constructor() {
    super()
  }

  public attributes() {
    return this.get(`${this.baseUrl}contact-attributes`)
  }

  public createAttribute(body: any) {
    const config = { params: { is_popup: true } }
    return this.post(`${this.baseUrl}contact-attributes`, body, config)
  }

  public getAttribute(id: number) {
    return this.get(`${this.baseUrl}contact-attributes/${id}`)
  }

  public updateAttribute(id: number, body: object = {}) {
    const config = { params: { is_popup: true } }
    return this.put(`${this.baseUrl}contact-attributes/${id}`, body, config)
  }

  public removeAttribute(id: number) {
    const config = { params: { is_popup: true } }
    return this.delete(`${this.baseUrl}contact-attributes/${id}`, config)
  }

  public checkCanDestroy(id: number) {
    const config = { params: { is_popup: true } }
    return this.get(`${this.baseUrl}contact-attributes/check-can-destroy/${id}`, config)
  }

  public list(params: {
    page: number,
  }) {
    return this.get(`${this.baseUrl}contacts`, { params })
  }

  public details(id: number) {
    return this.get(`${this.baseUrl}contacts/${id}`)
  }

  public create(body: any) {
    const config = { params: { is_popup: true } }
    return this.post(`${this.baseUrl}contacts`, body, config)
  }

  public update(id: number, body: any) {
    const config = { params: { is_popup: true } }
    return this.put(`${this.baseUrl}contacts/${id}`, body, config)
  }

  public remove(id: number) {
    const config = { params: { is_popup: true } }
    return this.delete(`${this.baseUrl}contacts/${id}`, config)
  }

  public filter(body: { search: string, page: number, filter: object }) {
    return this.post(`${this.baseUrl}contacts/filter`, body)
  }

  public export(body: { search: string, page: number, filter: object, limit: number, offset: number }) {
    const config = { params: { is_popup: true } }
    return this.post(`${this.baseUrl}contacts/export`, body, config)
  }
}
