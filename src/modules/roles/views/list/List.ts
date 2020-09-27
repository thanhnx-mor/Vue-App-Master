import { Component } from 'vue-property-decorator'
import Mixins from '@/mixins'
import moment from 'moment'

import { IBreadcrumb, ITableField, IResponse } from '@/types/interface'
import { GET_ALL_PERMISSIONS } from './../../type'
import EventBus from '@/event-bus'
import { IRole } from '../../interface'
import UserSidebarLeft from '@/components/UserSidebarLeft/UserSidebarLeft.vue'
import RoleApi from '@/services/RoleApi'
import CreateRole from '../create/Create.vue'
import EditRole from '../edit/Edit.vue'
import DeleteRole from '../delete/Delete.vue'

@Component({
    components: {
        CreateRole,
        EditRole,
        DeleteRole,
        UserSidebarLeft,
    },
})

export default class List extends Mixins {

    protected breadcrumbItems: IBreadcrumb[] = [
        {
            text: 'Trang chủ',
            to: '/',
        },
        {
            text: 'Danh sách vai trò',
            active: true,
        },
    ]

    protected roleFields: ITableField[] = [
        {
            key: 'actions',
            label: 'Hành động',
            tdClass: 'td-actions',
        },
        // {
        //     key: 'name',
        //     label: 'Tên',
        // },
        {
            key: 'display_name',
            label: 'Tên hiển thị',
        },
        {
            key: 'description',
            label: 'Mô tả',
        },
        {
            key: 'permissions',
            label: 'Quyền',
        },
        {
            key: 'created_at',
            label: 'Ngày tạo',
        },
        {
            key: 'updated_at',
            label: 'Ngày cập nhật',
        },
    ]

    protected isLoading: boolean = false
    protected roles: IRole[] = []
    private roleApi: RoleApi

    constructor() {
        super()
        this.roleApi = new RoleApi()
    }

    protected created() {
        this.fetchAllPermissions()
    }

    protected fetchAllPermissions() {
        this.$store.dispatch(GET_ALL_PERMISSIONS).then(() => {
            this.fetchRolesList()
        })
    }

    protected onRefresh(isSuccess: boolean) {
        if (isSuccess) {
            this.fetchRolesList()
        }
    }

    protected fetchRolesList() {
        this.roleApi.all().then((res: IResponse) => {
            this.isLoading = false
            const data = res.data as IRole[]

            if (!data.length) {
                this.roles = []
                return
            }

            this.roles = data && data.map((t: IRole) => ({
                ...t,
                created_at: t.created_at ? moment(t.created_at).format('DD/MM/YYYY') : undefined,
                updated_at: t.updated_at ? moment(t.updated_at).format('DD/MM/YYYY') : undefined,
            })) as IRole[]
        })
    }

    protected onEdit(id: number) {
        EventBus.$emit('modalRoleUpdate', id)
    }

    protected onDelete(role: any) {
        const { deleteModal } = this.$refs as any
        deleteModal.displayName = role.display_name
        deleteModal.id = role.id
        this.$bvModal.show('modalRoleDelete')
    }
}
