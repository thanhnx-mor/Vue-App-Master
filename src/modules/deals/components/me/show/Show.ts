import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import Mixins from '@/mixins'
import EventBus from '@/event-bus'
import { IAttribute } from '@/modules/settings/interface'
import { InputType } from '@/types/enum'
import { IUser } from '@/modules/users/interface'
import { IDeal, IDealActionHistory } from '@/modules/deals/interface'
import { ICustomer } from '@/modules/customers/interface'
import DealApi from '@/services/DealApi'
import CustomerApi from '@/services/CustomerApi'
import { GET_PRODUCT_ATTRIBUTES } from '@/modules/products/type'
import { GET_CUSTOMER_ATTRIBUTES } from '@/modules/customers/type'
import ShowCustomer from '../showCustomer/ShowCustomer'
import ShowDeal from '../../showDeal/ShowDeal'
import ListDealActionWithoutPagination from '../listDealActionWithoutPagination/ListDealActionWithoutPagination'
import moment from 'moment'

@Component({
  components: {
    ShowCustomer,
    ShowDeal,
    ListDealActionWithoutPagination,
  },
  computed: {
    ...mapGetters(['allUsers', 'activeUsers', 'dealAttributes', 'productAttributes', 'customerAttributes']),
  },
})

export default class ShowAction extends Mixins {
  protected dealAttributes!: IAttribute[]
  protected productAttributes!: IAttribute[]
  protected customerAttributes!: IAttribute[]
  protected serverErrors: object = {}
  protected isLoading: boolean = false
  protected isLoadingGetProducts: boolean = false
  protected isLoadingGetData: boolean = false
  protected isLoadingDealActionHistories: boolean = false
  protected inputType = InputType
  protected activeUsers!: IUser[]
  protected allUsers!: IUser[]
  protected dealId!: number
  protected customerId!: number
  protected deal!: IDeal
  protected customer!: ICustomer
  protected dealActionInfo: object = {}
  protected dealActionHistories = []
  protected tabErrors: { [key: string]: boolean } = {}
  protected tabIndex: number = 0

  private dealApi: DealApi
  private customerApi: CustomerApi

  constructor() {
    super()
    this.dealApi = new DealApi()
    this.customerApi = new CustomerApi()
  }

  protected isMultiple(inputType: number) {
    return [InputType['Select/ Nhiều lựa chọn'], InputType['Checkbox/ Nhiều lựa chọn'], InputType['Users/ Nhiều người dùng']].includes(+inputType)
  }

  private created() {
    this.showModalDealDetailsAction()
  }

  private showModalDealDetailsAction() {
    EventBus.$on('showModalDealDetailsAction', (data: any) => {
      this.dealId = data.deal_id
      this.customerId = data.customer_id
      this.$bvModal.show('showModalDealDetailsAction')
      this.getDealActionHistories()
      this.getData()
    })
  }

  private async getData() {
    this.isLoadingGetData = true
    this.$store.dispatch(GET_PRODUCT_ATTRIBUTES)
    this.$store.dispatch(GET_CUSTOMER_ATTRIBUTES)
    await this.dealApi.details(+this.dealId).then((res: any) => {
      this.deal = this.initData(res.data)
    })
    await this.customerApi.details(+this.customerId).then((res: any) => {
      this.customer = this.initData(res.data)
    })
    this.isLoadingGetData = false
  }

  private getDealActionHistories() {
    this.isLoadingDealActionHistories = true
    this.dealApi.dealActionHistories({ deal_id: +this.dealId }).then((res: any) => {
      const data: any = res.data as IDealActionHistory[] || []
      this.dealActionHistories = data
      if (data.length) {
        this.dealActionHistories = data.map((t: any) => {
          return {
            ...t,
            processing_time_from_now: moment(t.created_at).lang('vi').fromNow(),
            processing_time: moment(t.created_at).format('DD/MM/YYYY H:mm:ss'),
          }
        })
      }
      this.isLoadingDealActionHistories = false
    })
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
