import RoleApi from '@/services/RoleApi'
import PermissionApi from '@/services/Permission'

import {
    GET_ALL_PERMISSIONS,
    SET_ALL_PERMISSIONS,
} from '../type'

const roleApi = new RoleApi()
const permissionApi = new PermissionApi()

export const actions = {
    async [GET_ALL_PERMISSIONS](context: any) {
        try {
            const response = await permissionApi.all()
            context.commit(SET_ALL_PERMISSIONS, response.data)
            return response
        } catch (error) {
            return error
        }
    },
}
