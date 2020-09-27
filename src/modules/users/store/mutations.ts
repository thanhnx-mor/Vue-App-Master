import {
  SET_USER_STATUS_CODES,
  SET_CURRENT_USER,
  SET_ALL_USERS,
  SET_ALL_ROLES,
} from '../type'

export const mutations = {
  [SET_USER_STATUS_CODES](state: any, statusCodes: any) {
    state.statusCodes = statusCodes
  },

  [SET_CURRENT_USER](state: any, currentUser: any) {
    state.currentUser = currentUser
  },

  [SET_ALL_USERS](state: any, users: any) {
    state.allUsers = users
  },

  [SET_ALL_ROLES](state: any, roles: any) {
    state.allRoles = roles
  },
}
