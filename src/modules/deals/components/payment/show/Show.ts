import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import Mixins from '@/mixins'
import EventBus from '@/event-bus'
import { IAttribute } from '@/modules/settings/interface'
import { InputType } from '@/types/enum'
import { IUser } from '@/modules/users/interface'
import { IDeal } from '@/modules/deals/interface'
import DealApi from '@/services/DealApi'
import { GET_PRODUCT_ATTRIBUTES } from '@/modules/products/type'
import ShowDeal from '../../showDeal/ShowDeal'
import ListDealPaymentWithoutPagination from '../listDealPaymentWithoutPagination/ListDealPaymentWithoutPagination'
import filters from '@/utils/filters'

@Component({
  components: {
    ShowDeal,
    ListDealPaymentWithoutPagination,
  },
  computed: {
    ...mapGetters(['allUsers', 'activeUsers', 'dealAttributes', 'productAttributes']),
  },
})

export default class ShowPayment extends Mixins {
  protected dealAttributes!: IAttribute[]
  protected productAttributes!: IAttribute[]
  protected isLoading: boolean = false
  protected isLoadingGetData: boolean = false
  protected inputType = InputType
  protected activeUsers!: IUser[]
  protected allUsers!: IUser[]
  protected dealId!: number
  protected deal!: IDeal
  protected tabIndex: number = 0

  private dealApi: DealApi

  protected get filters() {
    return filters
  }

  protected get dealTotalPayment() {
    let dealTotalPayment = 0
    if (this.deal && this.deal.attributes) {
      const attriubteTotalPayment: any = this.deal.attributes.find((t: any) => t.slug === 'tong_thanh_toan')
      dealTotalPayment = attriubteTotalPayment.attribute_values && attriubteTotalPayment.attribute_values[0].value || 0
    }
    return dealTotalPayment
  }

  protected get dealTotalAmountPaid() {
    let dealTotalAmountPaid = 0
    if (this.deal && this.deal.attributes) {
      const attriubteTotalAmountPaid: any = this.deal.attributes.find((t: any) => t.slug === 'tong_tien_da_thanh_toan')
      dealTotalAmountPaid = attriubteTotalAmountPaid.attribute_values && attriubteTotalAmountPaid.attribute_values[0].value || 0
    }
    return dealTotalAmountPaid
  }

  constructor() {
    super()
    this.dealApi = new DealApi()
  }

  protected isMultiple(inputType: number) {
    return [InputType['Select/ Nhiều lựa chọn'], InputType['Checkbox/ Nhiều lựa chọn'], InputType['Users/ Nhiều người dùng']].includes(+inputType)
  }

  private created() {
    this.showModalDealDetailsPayment()
  }

  private showModalDealDetailsPayment() {
    EventBus.$on('showModalDealDetailsPayment', (data: any) => {
      this.dealId = data.deal_id
      this.$bvModal.show('showModalDealDetailsPayment')
      this.getData()
    })
  }

  private async getData() {
    this.isLoadingGetData = true
    this.$store.dispatch(GET_PRODUCT_ATTRIBUTES)
    await this.dealApi.details(+this.dealId).then((res: any) => {
      this.deal = this.initData(res.data)
    })
    this.isLoadingGetData = false
  }

  private initData(data: any) {
    return {
      ...data,
      attributes: data.attributes.filter((t: any) => t.is_enabled).map((t: any) => ({
        ...t,
        [t.slug]: this.isMultiple(t.attribute_input_type_id) ? t.attribute_values.map((x: any) => x.value) : t.attribute_values.map((x: any) => x.value).join(', '),
      })),
    }
  }
}
