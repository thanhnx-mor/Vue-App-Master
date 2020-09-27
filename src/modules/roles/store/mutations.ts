import { SET_ALL_PERMISSIONS } from '../type'

export const mutations = {
    [SET_ALL_PERMISSIONS](state: any, permissions: any) {
        state.allPermissions = permissions
    },
}
