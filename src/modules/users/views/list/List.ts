import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import Mixins from '@/mixins'
import moment from 'moment'

import { GET_USER_STATUS_CODES, GET_ALL_ROLES } from '../../type'
import { IBreadcrumb, ITableField, IResponse } from '@/types/interface'
import { IUser } from '../../interface'
import UserSidebarLeft from '@/components/UserSidebarLeft/UserSidebarLeft.vue'
import CreateUser from '../create/Create.vue'
import EditUser from '../edit/Edit.vue'
import EventBus from '@/event-bus'
import UserApi from '@/services/UserApi'

@Component({
  components: {
    CreateUser,
    EditUser,
    UserSidebarLeft,
  },
  computed: {
    ...mapGetters(['statusCodes']),
  },
})

export default class List extends Mixins {

  protected breadcrumbItems: IBreadcrumb[] = [{
    text: 'Trang chủ',
    to: '/',
  }, {
    text: 'Danh sách tài khoản',
    active: true,
  }]
  protected userFields: ITableField[] = [{
    key: 'actions',
    label: 'Hành động',
    tdClass: 'td-actions',
  }, {
    key: 'id',
    label: 'ID',
    tdClass: 'td-id',
  }, {
    key: 'name',
    label: 'Tên',
  }, {
    key: 'email',
  }, {
    key: 'status_code',
    label: 'Trạng Thái',
  }, {
    key: 'roles',
    label: 'Vai trò',
  }, {
    key: 'created_at',
    label: 'Ngày tạo',
  }, {
    key: 'updated_at',
    label: 'Ngày cập nhật',
  }]
  protected currentPage!: number
  protected isLoading: boolean = true
  protected perPage!: number
  protected statusCodes!: Array<{ code: number, label: string }>
  protected total!: number
  protected users: IUser[] = []
  private userApi: UserApi

  constructor() {
    super()
    this.userApi = new UserApi()
  }

  get codes() {
    const codes: { [key: number]: string } = {}
    this.statusCodes.forEach((t) => {
      codes[t.code] = t.label
    })
    return codes
  }

  public destroyed() {
    EventBus.$off('showModalUserEdit')
  }

  protected onChange(page: number) {
    if (page === this.currentPage) {
      return
    }
    this.currentPage = page
    this.setQueryUrl(page.toString())
    this.fetch(page)
  }

  protected getStatusCodeBagde(code: number) {
    switch (+code) {
      case 1:
        return 'success'
      case 2:
        return 'warning'
      case 3:
        return 'danger'
      default:
        return 'light'
    }
  }

  protected onEdit(id: number) {
    EventBus.$emit('showModalUserEdit', id)
  }

  protected onRefresh(isSuccess: boolean) {
    if (isSuccess) {
      this.currentPage = 1
      this.setQueryUrl('1')
      this.fetch()
    }
  }

  private setQueryUrl(page: string = '1') {
    if (this.currentPage !== +this.$route.query.page) {
      this.$router.replace({
        name: this.PERMISSION.USER.INDEX,
        query: {
          // per_page: this.perPage,
          page,
        },
      }).catch((e: any) => {
        // throw e
      })
    }
  }

  private created() {
    this.fetchUserStatusCodes()
    this.fetchAllRoles()
  }

  private fetch(page: number = +this.$route.query.page || 1) {
    this.userApi.list({ page }).then((res: IResponse) => {
      this.isLoading = false
      const data = res.data as IUser[]
      const meta = res.meta
      if (!data.length) {
        this.users = []
        return
      }
      this.users = data && data.map((t: IUser) => ({
        ...t,
        created_at: moment(t.created_at).format('DD/MM/YYYY'),
        updated_at: moment(t.updated_at).format('DD/MM/YYYY'),
      })) as IUser[]
      const pagination = meta && meta.pagination
      this.currentPage = pagination.current_page
      this.total = pagination.total
      this.perPage = pagination.per_page
    })
  }

  private fetchUserStatusCodes() {
    this.$store.dispatch(GET_USER_STATUS_CODES).then(() => {
      this.fetch()
    })
  }

  private fetchAllRoles() {
    this.$store.dispatch(GET_ALL_ROLES).then(() => {
      this.fetch()
    })
  }

}
