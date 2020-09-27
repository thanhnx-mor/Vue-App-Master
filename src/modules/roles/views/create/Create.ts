import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import Mixins from '@/mixins'

import RoleApi from '@/services/RoleApi'
import { UNPROCESSABLE_ENTITY, OK } from '@/types/const'
import { IRole } from '../../interface'

@Component({
    computed: {
        ...mapGetters(['allPermissions']),
    },
})

export default class Create extends Mixins {
    protected role: IRole = this.initRole()
    protected serverErrors: object = {}
    protected isLoading: boolean = false

    private roleApi: RoleApi

    constructor() {
        super()
        this.roleApi = new RoleApi()
    }

    protected async onSubmit(bvModalEvt: any) {
        bvModalEvt.preventDefault()

        const isValid = await (this.$refs.validationObserver as any).validate()
        if (!isValid) {
            return
        }
        this.isLoading = true
        const res = await this.roleApi.create(this.role)

        this.isLoading = false
        if (res.status === UNPROCESSABLE_ENTITY) {
            this.serverErrors = res.data.errors
            this.toastError('Thêm vai trò thất bại.')
            return
        }
        if (res.status === OK) {
            this.onCancel()
            this.$emit('onCreated', true)
            this.$bvModal.hide('roleCreateModal')
            this.toastSuccess('Thêm vai trò thành công.')
        }
    }

    protected onCancel() {
        (this.$refs.validationObserver as any).reset()
        this.serverErrors = {}
        this.isLoading = false
        this.role = this.initRole()
    }

    private initRole() {
        return (this.role = {
            name: '',
            display_name: '',
            description: '',
            permissions: [],
        } as IRole)
    }
}
