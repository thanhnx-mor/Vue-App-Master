import BaseApi from './BaseApi'

import { BASE_URL } from '@/types/config'

export default class SettingApi extends BaseApi {

  private baseUrl: string = BASE_URL

  constructor() {
    super()
  }

  public attributeInputTypes() {
    return this.get(`${this.baseUrl}attribute-input-types`)
  }
}
