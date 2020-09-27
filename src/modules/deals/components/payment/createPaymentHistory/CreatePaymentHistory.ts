import { Component, Prop, Watch } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import Mixins from '@/mixins'
import Multiselect from 'vue-multiselect'
import DatePicker from 'vue2-datepicker'
import { IDealPaymentHistory } from '@/modules/deals/interface'
import moment from 'moment'
import filters from '@/utils/filters'

@Component({
  components: {
    Multiselect,
    DatePicker,
  },
  computed: {
    ...mapGetters(['']),
  },
})

export default class CreateDealPaymentHistory extends Mixins {
  @Prop()
  protected deal?: any
  @Prop()
  protected dealPayment?: any
  @Prop()
  protected serverErrors?: any
  protected dealPaymentInfo: IDealPaymentHistory = this.setDataDealPaymentDefault()
  protected dealPaymentMethod = [
    { id: 1, name: 'Tiền mặt' },
    { id: 2, name: 'Chuyển khoản' },
    { id: 3, name: 'Khác' },
  ]

  protected get filters() {
    return filters
  }

  protected get dealTotalPayment() {
    let dealTotalPayment = 0
    if (this.deal && this.deal.attributes) {
      const attriubteTotalPayment = this.deal.attributes.find((t: any) => t.slug === 'tong_thanh_toan')
      dealTotalPayment = attriubteTotalPayment.attribute_values && attriubteTotalPayment.attribute_values[0].value || 0
    }
    return dealTotalPayment
  }

  protected get dealTotalAmountPaid() {
    let dealTotalAmountPaid = 0
    if (this.deal && this.deal.attributes) {
      const attriubteTotalAmountPaid = this.deal.attributes.find((t: any) => t.slug === 'tong_tien_da_thanh_toan')
      dealTotalAmountPaid = attriubteTotalAmountPaid.attribute_values && attriubteTotalAmountPaid.attribute_values[0].value || 0
    }
    return dealTotalAmountPaid
  }

  constructor() {
    super()
  }

  @Watch('dealPaymentInfo', { immediate: true, deep: true })
  public onChangeDealPaymentInfo(newVal: any) {
    this.$emit('updateDataDealPayment', newVal)
  }

  private created() {
    this.dealPaymentInfo = this.setDataDealPaymentDefault()
  }

  private setDataDealPaymentDefault() {
    return this.dealPayment && {
      ...this.dealPayment,
      payment_amount: this.dealTotalPayment - this.dealTotalAmountPaid,
      payment_method: this.dealPaymentMethod && this.dealPaymentMethod[1] || undefined,
      payment_datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
    } || {}
  }
}
