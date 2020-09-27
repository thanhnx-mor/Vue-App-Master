import BaseApi from './BaseApi'

import { BASE_URL } from '@/types/config'

export default class UserApi extends BaseApi {

  private baseUrl: string = BASE_URL

  constructor() {
    super()
  }

  public list(params: {
    page: number,
  }) {
    return this.get(`${this.baseUrl}users`, { params })
  }

  public listStatusCodes() {
    return this.get(`${this.baseUrl}user-status-codes`)
  }

  public create(params: object = {}) {
    const config = { params: { is_popup: true } }
    return this.post(`${this.baseUrl}users`, params, config)
  }

  public currentUser() {
    return this.get(`${this.baseUrl}user`)
  }

  public show(id: number) {
    return this.get(`${this.baseUrl}users/${id}`)
  }

  public update(id: number, params: object = {}) {
    const config = { params: { is_popup: true } }
    return this.put(`${this.baseUrl}users/${id}`, params, config)
  }

  public all() {
    return this.get(`${this.baseUrl}users-all`)
  }

}
