import RoleApi from '@/services/RoleApi'
import UserApi from '@/services/UserApi'
import {
  GET_USER_STATUS_CODES,
  SET_USER_STATUS_CODES,
  GET_CURRENT_USER,
  SET_CURRENT_USER,
  GET_ALL_USERS,
  SET_ALL_USERS,
  GET_ALL_ROLES,
  SET_ALL_ROLES,
} from '../type'

const userApi = new UserApi()
const roleApi = new RoleApi()

export const actions = {
  async [GET_USER_STATUS_CODES](context: any) {
    try {
      const res = await userApi.listStatusCodes()
      context.commit(SET_USER_STATUS_CODES, res.data)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_CURRENT_USER](context: any) {
    try {
      const res = await userApi.currentUser()
      context.commit(SET_CURRENT_USER, res.data)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_ALL_USERS](context: any) {
    try {
      const res = await userApi.all()
      context.commit(SET_ALL_USERS, res.data)
      return res
    } catch (e) {
      return e
    }
  },

  async [GET_ALL_ROLES](context: any) {
    try {
      const res = await roleApi.all()
      context.commit(SET_ALL_ROLES, res.data)
      return res
    } catch (e) {
      return e
    }
  },
}
