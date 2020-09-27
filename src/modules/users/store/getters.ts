import { USER_STATUS_CODE_DEFAULT } from '@/types/const'
import { IUser } from '../interface'

export const getters = {
  statusCodes(state: any) {
    return state.statusCodes
  },

  currentUser(state: any) {
    const currentUser = state.currentUser || {}
    const roles = currentUser.roles || []
    if (!Object.keys(currentUser).length) {
      return currentUser
    }
    let permissions: any[] = []
    let permissionsName: any[] = []
    if (roles && roles.length) {
      permissions = roles.map((role: any) => {
        return role.permissions.map((permission: any) => permission.name)
      })
    }
    if (permissions.length) {
      permissions.forEach((permission: any) => {
        permissionsName = [...permissionsName, ...permission]
      })
    }
    currentUser.permissions = Array.from(new Set([...permissionsName]))
    return currentUser
  },

  allUsers(state: any) {
    return state.allUsers
  },

  activeUsers(state: any) {
    return state.allUsers.filter((t: IUser) => +t.status_code === USER_STATUS_CODE_DEFAULT)
  },

  allRoles(state: any) {
    return state.allRoles
  },
}
