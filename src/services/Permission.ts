import BaseApi from './BaseApi'

import { BASE_URL } from '@/types/config'

export default class PermissionApi extends BaseApi {

  private baseUrl: string = BASE_URL

  constructor() {
    super()
  }

  public all() {
    return this.get(`${this.baseUrl}permissions`)
  }

}
