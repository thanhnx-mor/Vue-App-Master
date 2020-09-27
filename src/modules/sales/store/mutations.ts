import { SET_SALES } from '../type'

export const mutations = {
    [SET_SALES](state: any, sales: any) {
        state.sales = sales
    },
}
