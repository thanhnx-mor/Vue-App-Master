import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import Mixins from '@/mixins'

import { IBreadcrumb, ITableField } from '@/types/interface'
import SaleApi from '@/services/SaleApi'
import SidebarLeft from '@/modules/settings/components/sidebarLeft/SidebarLeft'
import CreateSale from '../create/Create.vue'
import DeleteSale from '../delete/Delete.vue'
import EventBus from '@/event-bus'
import { ISale } from '../../interface'
import { IUser } from '@/modules/users/interface'
import { GET_SALES } from '../../type'
import moment from 'moment'
import { UNPROCESSABLE_ENTITY, OK } from '@/types/const'

@Component({
  components: {
    CreateSale,
    DeleteSale,
    SidebarLeft,
  },
  computed: {
    ...mapGetters(['allUsers', 'sales']),
  },
})

export default class ListSale extends Mixins {

  protected breadcrumbItems: IBreadcrumb[] = [{
    text: 'Trang chủ',
    to: '/',
  }, {
    text: 'Quản lý nhân viên bán hàng',
    active: true,
  }]
  protected fields: ITableField[] = [{
    key: 'actions',
    label: 'Hành động',
    tdClass: 'td-actions',
  }, {
    key: 'name',
    label: 'Tên',
  }, {
    key: 'email',
    label: 'Email',
  }, {
    key: 'allowed_assign_lead',
    label: 'Cho phép nhận lead',
  }, {
    key: 'created_at',
    label: 'Ngày tạo',
  }, {
    key: 'updated_at',
    label: 'Ngày cập nhật',
  }]
  protected isLoading: boolean = false
  protected isLoadingEdit: boolean = false
  protected allUsers!: IUser[]
  protected sales!: ISale[]

  protected get items() {
    if (!this.sales || !this.sales.length) {
      return []
    }
    return this.sales.map((t) => {
      return {
        ...t,
        name: t.user_id && this.getUserKeyById(t.user_id, 'name') || undefined,
        email: t.user_id && this.getUserKeyById(t.user_id, 'email') || undefined,
        allowed_assign_lead: t.allowed_assign_lead === 1 ? true : false,
        created_at: moment(t.created_at).format('DD/MM/YYYY'),
        updated_at: moment(t.created_at).format('DD/MM/YYYY'),
      }
    })
  }

  private saleApi: SaleApi

  constructor() {
    super()
    this.saleApi = new SaleApi()
  }

  public destroyed() {
    EventBus.$off('showModalSaleDelete')
  }

  protected onEdit(item: any) {
    this.isLoadingEdit = true
    const sale = {
      id: item.id,
      allowed_assign_lead: item.allowed_assign_lead ? 0 : 1,

    }
    this.saleApi.update(sale.id, sale).then((res) => {
      this.isLoadingEdit = false
      if (res.status === UNPROCESSABLE_ENTITY) {
        this.toastError('Cập nhật nhân viên bán hàng thất bại.')
        return
      }
      if (res.status === OK) {
        this.fetch()
        this.toastSuccess('Cập nhật nhân viên bán hàng thành công.')
      }
    })
  }

  protected onDelete(item: any) {
    EventBus.$emit('showModalSaleDelete', item)
  }

  protected onRefresh(isSuccess: boolean) {
    if (isSuccess) {
      this.fetch()
    }
  }

  private created() {
    this.fetch()
  }

  private fetch() {
    this.isLoading = true
    this.$store.dispatch(GET_SALES).then(() => {
      this.isLoading = false
    })
  }

  private getUserKeyById(userId: number, slug: string) {
    if (!userId) {
      return
    }
    const user: any = this.allUsers.find((t) => t.id === userId)
    return user && slug && user[slug] || undefined
  }
}
