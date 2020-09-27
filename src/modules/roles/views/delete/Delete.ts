import { Component } from 'vue-property-decorator'

import RoleApi from '@/services/RoleApi'
import Mixins from '@/mixins'

@Component

export default class RoleDelete extends Mixins {

    protected id: string = ''
    protected isLoading: boolean = false
    protected displayName: string = ''
    private roleApi: RoleApi

    constructor() {
        super()
        this.roleApi = new RoleApi()
    }

    protected remove() {
        this.isLoading = true

        this.roleApi.remove(+this.id).then(() => {
            this.isLoading = false
            this.onClose()
            this.$emit('onDeleted', true)
            this.toastSuccess(`Vai trò ${this.displayName} đã xóa thành công.`)
        })
    }

    protected onClose() {
        this.$bvModal.hide('modalRoleDelete')
    }
}
