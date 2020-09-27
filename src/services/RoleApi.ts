import BaseApi from './BaseApi'

import { BASE_URL } from '@/types/config'

export default class RoleApi extends BaseApi {
    private baseUrl: string = BASE_URL

    constructor() {
        super()
    }

    public all() {
        return this.get(`${this.baseUrl}roles`)
    }

    public create(params: object = {}) {
        const config = { params: { is_popup: true } }
        return this.post(`${this.baseUrl}roles`, params, config)
    }

    public show(id: number) {
        return this.get(`${this.baseUrl}roles/${id}`)
    }

    public update(id: number, params: object = {}) {
        const config = { params: { is_popup: true } }
        return this.put(`${this.baseUrl}roles/${id}`, params, config)
    }

    public remove(id: number) {
        const config = { params: { is_popup: true } }
        return this.delete(`${this.baseUrl}roles/${id}`, config)
    }
}
