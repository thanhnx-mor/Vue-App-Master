import SaleApi from '@/services/SaleApi'
const saleApi = new SaleApi()
import { GET_SALES, SET_SALES } from '../type'

export const actions = {
    async [GET_SALES](context: any) {
        try {
            const res = await saleApi.all()
            context.commit(SET_SALES, res.data)
            return res
        } catch (e) {
            return e
        }
    },
}
