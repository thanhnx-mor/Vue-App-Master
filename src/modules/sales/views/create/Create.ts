import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

import Mixins from '@/mixins'
import { USER_STATUS_CODE_DEFAULT, OK, UNPROCESSABLE_ENTITY } from '@/types/const'
import SaleApi from '@/services/SaleApi'
import { IUser } from '@/modules/users/interface'
import { ISale } from '../../interface'
import Multiselect from 'vue-multiselect'

@Component({
  components: {
    Multiselect,
  },
  computed: {
    ...mapGetters(['allUsers', 'sales']),
  },
})

export default class Create extends Mixins {
  protected allUsers!: IUser[]
  protected serverErrors: object = {}
  protected isLoading: boolean = false
  protected sale: ISale = this.initSale()
  protected sales?: ISale[]
  private saleApi: SaleApi

  protected get users() {
    const sales = this.sales || []
    if (!sales || !sales.length) {
      return this.allUsers
    }
    const saleUserIds = sales.map((t: any) => t.user_id)
    const users: IUser[] = []
    this.allUsers.forEach((user: IUser) => {
      if (saleUserIds.includes(user.id)) {
        return
      }
      users.push(user)
    })
    return users
  }

  constructor() {
    super()
    this.saleApi = new SaleApi()
  }

  protected async onSubmit(bvModalEvt: any) {
    bvModalEvt.preventDefault()
    const isValid = await (this.$refs.validationObserver as any).validate()
    if (!isValid) {
      return
    }

    let sale: any = this.sale
    sale = {
      ...sale,
      user_id: sale.user_id && sale.user_id.id || undefined,
      allowed_assign_lead: sale.allowed_assign_lead ? 1 : 0,
    }
    this.isLoading = true
    const res = await this.saleApi.create(sale)
    this.isLoading = false
    if (res.status === UNPROCESSABLE_ENTITY) {
      this.serverErrors = res.data.errors
      this.toastError('Thêm nhân viên bán hàng thất bại.')
      return
    }
    if (res.status === OK) {
      this.onCancel()
      this.$emit('onCreated', true)
      this.$bvModal.hide('saleCreateModal')
      this.toastSuccess('Thêm nhân viên bán hàng thành công.')
    }
  }

  protected onCancel() {
    (this.$refs.validationObserver as any).reset()
    this.serverErrors = {}
    this.isLoading = false
    this.sale = this.initSale()
  }

  private initSale() {
    return {
      user_id: undefined,
      allowed_assign_lead: true,
    } as ISale
  }
}
