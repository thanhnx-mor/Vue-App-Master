import { Component } from 'vue-property-decorator'
import Mixins from '@/mixins'
import EventBus from '@/event-bus'

import { mapGetters } from 'vuex'
import RoleApi from '@/services/RoleApi'
import { UNPROCESSABLE_ENTITY, OK } from '@/types/const'
import { IRole } from '../../interface'

@Component({
    computed: {
        ...mapGetters(['allPermissions']),
    },
})

export default class Edit extends Mixins {

    protected role: IRole = {
        id: -1,
        name: '',
        display_name: '',
        permissions: [],
    }
    protected serverErrors: object = {}
    protected isLoading: boolean = false
    private roleApi: RoleApi
    private roleId !: number
    private roleCached !: IRole

    constructor() {
        super()
        this.roleApi = new RoleApi()
    }

    get isDisabled() {
        if (!this.role || !this.roleCached) {
            return true
        }

        const isChange = (this.role.name !== this.roleCached.name) ||
            (this.role.display_name !== this.roleCached.display_name) ||
            (this.role.description !== this.roleCached.description) ||
            (JSON.stringify(this.role.permissions) !== JSON.stringify(this.roleCached.permissions))

        if (this.isLoading || !isChange) {
            return true
        }
        return false
    }

    protected created() {
        this.showModalRoleUpdate()
    }

    protected showModalRoleUpdate() {
        EventBus.$on('modalRoleUpdate', (roleId: number) => {
            this.roleId = roleId
            this.getRoleById()
        })
    }

    protected destroyed() {
        EventBus.$off('modalRoleUpdate')
    }

    protected async getRoleById() {
        const res = await this.roleApi.show(this.roleId)
        const data = res.data as IRole

        this.role = data
        if (this.role.permissions && this.role.permissions.length > 0) {
            (this.role.permissions as any) = this.role.permissions.map((permission: any) => {
                return permission.id
            })
        }
        this.roleCached = Object.assign({}, data)
        this.$nextTick(() => {
            this.$bvModal.show('roleUpdateModal')
        })
    }

    protected async onSubmit(bvModalEvt: any) {
        bvModalEvt.preventDefault()

        const isValid = await (this.$refs.validationObserver as any).validate()
        if (!isValid) {
            return
        }
        this.isLoading = true
        const res = await this.roleApi.update(this.roleId, this.role)
        this.isLoading = false

        if (res.status === UNPROCESSABLE_ENTITY) {
            this.serverErrors = res.data.errors
            this.toastError('Cập nhật vai trò thất bại.')
            return
        }
        if (res.status === OK) {
            this.onCancel()
            this.$emit('onUpdated', true)
            this.$bvModal.hide('roleUpdateModal')
            this.toastSuccess('Cập nhật vai trò thành công.')
        }
    }

    protected onCancel() {
        (this.$refs.validationObserver as any).reset()
        this.serverErrors = {}
        this.isLoading = false
    }
}
