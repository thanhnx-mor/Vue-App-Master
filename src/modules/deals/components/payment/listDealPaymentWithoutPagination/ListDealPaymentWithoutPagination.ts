import { Component, Prop } from 'vue-property-decorator'
import Mixins from '@/mixins'
import { IDealPaymentHistory } from '@/modules/deals/interface'
import { IUser } from '@/modules/users/interface'
import { mapGetters } from 'vuex'
import moment from 'moment'
import filters from '@/utils/filters'
import DealApi from '@/services/DealApi'

@Component({
  computed: {
    ...mapGetters(['allUsers']),
  },
})

export default class ListDealPaymentWithoutPagination extends Mixins {
  @Prop()
  protected dealId?: number

  protected isLoadingDealPaymentHistories: boolean = false
  protected dealPaymentHistories: IDealPaymentHistory[] = []
  protected allUsers!: IUser[]
  protected dealPaymentMethod = [
    { id: 1, name: 'Tiền mặt' },
    { id: 2, name: 'Chuyển khoản' },
    { id: 3, name: 'Khác' },
  ]
  private dealApi: DealApi

  constructor() {
    super()
    this.dealApi = new DealApi()
  }

  protected getUserName(userId: number) {
    const user = this.allUsers.find((t) => t.id === userId)
    return user && user.name || ''
  }

  protected getDealPaymentMethodName(paymentMethodId: number) {
    const paymentMethod = this.dealPaymentMethod.find((t) => t.id === paymentMethodId)
    return paymentMethod && paymentMethod.name || ''
  }

  private created() {
    this.getDealPaymentHistories()
  }

  private getDealPaymentHistories() {
    if (!this.dealId) {
      return
    }
    this.isLoadingDealPaymentHistories = true
    this.dealApi.listDealPayment({ deal_id: +this.dealId }).then((res: any) => {
      const data: any = res.data as IDealPaymentHistory[] || []
      this.dealPaymentHistories = data
      if (data.length) {
        this.dealPaymentHistories = data.map((t: any) => {
          return {
            ...t,
            created_at: moment(t.created_at).format('DD/MM/YYYY'),
            payment_datetime: moment(t.payment_datetime).format('DD/MM/YYYY'),
            payment_amount: filters.priceFormat(t.payment_amount),
          }
        })
      }
      this.isLoadingDealPaymentHistories = false
    })
  }

}
