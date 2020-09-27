import BaseApi from './BaseApi'

import { BASE_URL } from '@/types/config'
import utils from '@/utils/utils'

export default class UserApi extends BaseApi {

  private baseUrl: string = BASE_URL

  constructor() {
    super()
  }

  public login(body: {
    email: string,
    password: string,
  }) {
    return this.post(`${this.baseUrl}auth/login`, body)
  }

  public logout() {
    utils.deleteCookie('access_token')
  }

  public setToken(token: string) {
    utils.setCookie('access_token', token)
  }

}
