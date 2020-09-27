import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import Mixins from '@/mixins'
import EventBus from '@/event-bus'
import { IAttribute } from '@/modules/settings/interface'
import { InputType } from '@/types/enum'
import { IUser } from '@/modules/users/interface'
import { UNPROCESSABLE_ENTITY, INTERNAL_SERVER_ERROR, OK } from '@/types/const'
import { IDeal, IDealPaymentHistory } from '@/modules/deals/interface'
import DealApi from '@/services/DealApi'
import { GET_PRODUCT_ATTRIBUTES } from '@/modules/products/type'
import ShowDeal from '../../showDeal/ShowDeal'
import CreateDealPayment from '../createPaymentHistory/CreatePaymentHistory'
import ListDealPaymentWithoutPagination from '../listDealPaymentWithoutPagination/ListDealPaymentWithoutPagination'

@Component({
  components: {
    ShowDeal,
    CreateDealPayment,
    ListDealPaymentWithoutPagination,
  },
  computed: {
    ...mapGetters(['allUsers', 'activeUsers', 'dealAttributes', 'productAttributes']),
  },
})

export default class CreatePayment extends Mixins {
  protected dealAttributes!: IAttribute[]
  protected productAttributes!: IAttribute[]
  protected serverErrors: object = {}
  protected isLoading: boolean = false
  protected isLoadingGetData: boolean = false
  protected inputType = InputType
  protected activeUsers!: IUser[]
  protected allUsers!: IUser[]
  protected dealId!: number
  protected deal!: IDeal
  protected dealPayment: IDealPaymentHistory = this.setDataDealPayment()
  protected tabErrors: { [key: string]: boolean } = {}
  protected tabIndex: number = 0

  private dealApi: DealApi

  constructor() {
    super()
    this.dealApi = new DealApi()
  }

  protected checkTabErrors(tabName: string = '') {
    this.$nextTick(() => {
      const tabAction = document.getElementById(tabName)
      const isInValid = tabAction?.getElementsByClassName('is-invalid')
      const isError = isInValid?.length ? true : false

      switch (tabName) {
        case 'tabDealPayment':
          this.tabErrors.tabDealPayment = isError
          break
      }

      if (this.tabErrors.tabDealPayment) {
        this.tabIndex = 0
        this.$nextTick(() => {
          this.scrollToViewFirstError(tabName, 150)
        })
        return
      }
    })
  }

  protected isMultiple(inputType: number) {
    return [InputType['Select/ Nhiều lựa chọn'], InputType['Checkbox/ Nhiều lựa chọn'], InputType['Users/ Nhiều người dùng']].includes(+inputType)
  }

  protected updateDataDealPayment(dealPayment: any) {
    this.dealPayment = dealPayment
  }

  protected async onSubmit(bvModalEvt: any) {
    bvModalEvt.preventDefault()
    this.setDataTabError()
    const isValid = await (this.$refs.validationObserver as any).validate()
    if (!isValid) {
      this.checkTabErrors('tabDealPayment')
      return
    }
    this.isLoading = true
    const onSuccess = () => {
      this.onCancel()
      this.$bvModal.hide('showModalDealPayment')
      this.toastSuccess('Thêm mới thanh toán thành công.')
      this.$bvModal.hide('showModalDealPayment')
      this.$emit('onCreated', true)
    }
    const onFail = (res: any) => {
      const resData = res.data
      this.serverErrors = resData.errors
      this.toastError('Thêm mới thanh toán thất bại.')
      this.checkTabErrors('tabDealPayment')
    }

    let dealPayment: any = this.dealPayment
    dealPayment = {
      ...dealPayment,
      deal_id: this.deal && this.deal.id,
      user_id: this.currentUser && this.currentUser.id,
      payment_method: dealPayment.payment_method && dealPayment.payment_method.id || undefined,
    }

    this.dealApi.createDealPayment(dealPayment).then((res) => {
      this.isLoading = false
      if ([UNPROCESSABLE_ENTITY, INTERNAL_SERVER_ERROR].includes(res.status)) {
        onFail(res)
        return
      }
      if (res.status === OK) {
        onSuccess()
      }
    })
  }

  protected onCancel() {
    this.serverErrors = {}
    this.isLoading = false
    this.setDataTabError()
    this.tabIndex = 0
    this.$nextTick(() => {
      if ((this.$refs.validationObserver as any)) {
        (this.$refs.validationObserver as any).reset()
      }
    })
  }

  private created() {
    this.showModalDealPayment()
  }

  private showModalDealPayment() {
    EventBus.$on('showModalDealPayment', (data: any) => {
      this.dealId = data.deal_id
      this.$bvModal.show('showModalDealPayment')
      this.dealPayment = this.setDataDealPayment()
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

  private setDataTabError() {
    this.tabErrors = {
      tabDealPayment: false,
    }
  }

  private setDataDealPayment() {
    return {
      deal_id: undefined,
      user_id: undefined,
      payment_method: undefined,
      payment_amount: undefined,
      payment_datetime: undefined,
      voucher: undefined,
      note: '',
    }
  }
}
