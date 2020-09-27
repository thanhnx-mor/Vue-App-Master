import BaseApi from './BaseApi'

import { BASE_URL } from '@/types/config'

export default class ProductApi extends BaseApi {

  private baseUrl: string = BASE_URL

  constructor() {
    super()
  }

  public attributes() {
    return this.get(`${this.baseUrl}product-attributes`)
  }

  public createAttribute(body: any) {
    const config = { params: { is_popup: true } }
    return this.post(`${this.baseUrl}product-attributes`, body, config)
  }

  public getAttribute(id: number) {
    return this.get(`${this.baseUrl}product-attributes/${id}`)
  }

  public updateAttribute(id: number, body: object = {}) {
    const config = { params: { is_popup: true } }
    return this.put(`${this.baseUrl}product-attributes/${id}`, body, config)
  }

  public removeAttribute(id: number) {
    const config = { params: { is_popup: true } }
    return this.delete(`${this.baseUrl}product-attributes/${id}`, config)
  }

  public checkCanDestroy(id: number) {
    const config = { params: { is_popup: true } }
    return this.get(`${this.baseUrl}product-attributes/check-can-destroy/${id}`, config)
  }

  public list(params: {
    page: number,
  }) {
    return this.get(`${this.baseUrl}products`, { params })
  }

  public details(id: number) {
    return this.get(`${this.baseUrl}products/${id}`)
  }

  public create(body: any) {
    const config = { params: { is_popup: true } }
    return this.post(`${this.baseUrl}products`, body, config)
  }

  public update(id: number, body: any) {
    const config = { params: { is_popup: true } }
    return this.put(`${this.baseUrl}products/${id}`, body, config)
  }

  public remove(id: number) {
    const config = { params: { is_popup: true } }
    return this.delete(`${this.baseUrl}products/${id}`, config)
  }

  public filter(body: { search: string, page: number, filter: object }) {
    return this.post(`${this.baseUrl}products/filter`, body)
  }

  public export(body: { search: string, page: number, filter: object, limit: number, offset: number }) {
    const config = { params: { is_popup: true } }
    return this.post(`${this.baseUrl}products/export`, body, config)
  }
}
