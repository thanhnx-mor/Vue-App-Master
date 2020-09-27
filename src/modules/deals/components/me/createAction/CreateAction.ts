import { Component } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import Mixins from '@/mixins'
import EventBus from '@/event-bus'
import { IAttribute } from '@/modules/settings/interface'
import { InputType } from '@/types/enum'
import { IUser } from '@/modules/users/interface'
import { UNPROCESSABLE_ENTITY, INTERNAL_SERVER_ERROR, OK } from '@/types/const'
import { IDeal, IDealActionHistory } from '@/modules/deals/interface'
import { ICustomer } from '@/modules/customers/interface'
import DealApi from '@/services/DealApi'
import CustomerApi from '@/services/CustomerApi'
import { GET_PRODUCT_ATTRIBUTES } from '@/modules/products/type'
import { GET_CUSTOMER_ATTRIBUTES } from '@/modules/customers/type'
import EditCustomer from '../editCustomer/EditCustomer'
import EditDeal from '../editDeal/EditDeal'
import CreateActionHistory from '../createActionHistory/CreateActionHistory'
import ListDealActionWithoutPagination from '../listDealActionWithoutPagination/ListDealActionWithoutPagination'
import Multiselect from 'vue-multiselect'
import moment from 'moment'
@Component({
  components: {
    Multiselect,
    EditCustomer,
    EditDeal,
    CreateActionHistory,
    ListDealActionWithoutPagination,
  },
  computed: {
    ...mapGetters(['allUsers', 'activeUsers', 'dealAttributes', 'productAttributes', 'customerAttributes']),
  },
})

export default class CreateAction extends Mixins {
  protected dealAttributes!: IAttribute[]
  protected productAttributes!: IAttribute[]
  protected customerAttributes!: IAttribute[]
  protected serverErrors: object = {}
  protected isLoading: boolean = false
  protected isLoadingGetProducts: boolean = false
  protected isLoadingGetData: boolean = false
  protected inputType = InputType
  protected activeUsers!: IUser[]
  protected allUsers!: IUser[]
  protected dealId!: number
  protected customerId!: number
  protected deal!: IDeal
  protected customer!: ICustomer
  protected dealActionInfo: IDealActionHistory = this.setDataDealInfo()
  protected tabErrors: { [key: string]: boolean } = {}
  protected tabIndex: number = 0
  protected isLoadingDealActionHistories: boolean = false
  protected dealActionHistories: IDealActionHistory[] = []

  private dealApi: DealApi
  private customerApi: CustomerApi

  constructor() {
    super()
    this.dealApi = new DealApi()
    this.customerApi = new CustomerApi()
  }

  protected checkTabErrors(tabName: string = '') {
    this.$nextTick(() => {
      const tabAction = document.getElementById(tabName)
      const isInValid = tabAction?.getElementsByClassName('is-invalid')
      const isError = isInValid?.length ? true : false

      switch (tabName) {
        case 'tabActionInfo':
          this.tabErrors.actionInfo = isError
          break
        case 'tabDealInfo':
          this.tabErrors.dealInfo = isError
          break
        case 'tabCustomerInfo':
          this.tabErrors.customerInfo = isError
          break
      }

      if (this.tabErrors.actionInfo) {
        this.tabIndex = 0
        this.$nextTick(() => {
          this.scrollToViewFirstError(tabName, 150)
        })
        return
      }

      if (this.tabErrors.dealInfo) {
        this.tabIndex = 1
        this.$nextTick(() => {
          this.scrollToViewFirstError(tabName, 150)
        })
        return
      }

      if (this.tabErrors.customerInfo) {
        this.tabIndex = 2
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

  protected async onSubmit(bvModalEvt: any) {
    bvModalEvt.preventDefault()
    this.setDataTabError()
    const isValid = await (this.$refs.validationObserver as any).validate()
    if (!isValid) {
      this.checkTabErrors('tabActionInfo')
      this.checkTabErrors('tabDealInfo')
      this.checkTabErrors('tabCustomerInfo')
      return
    }

    this.isLoading = true
    const onSuccess = (res: any) => {
      this.onCancel()
      this.$bvModal.hide('showModalDealAction')
      this.toastSuccess('Thêm mới thành công.')
      const dealActionHistory = res.data
      const deal = { id: this.dealId, latest_action_history: dealActionHistory }
      this.$emit('onCreatedAction', deal)
    }
    const onFail = (res: any) => {
      const resData = res.data
      this.serverErrors = resData.errors
      this.toastError('Thêm mới thất bại.')
      this.checkTabErrors('tabActionInfo')
      this.checkTabErrors('tabDealInfo')
      this.checkTabErrors('tabCustomerInfo')
    }

    let customerAttributes = this.customer && this.customer.attributes as any || [] as any
    const ignoreFieldCustomerAttribute = ['ma_kh']
    customerAttributes = this.convertDataPushToServer(customerAttributes, ignoreFieldCustomerAttribute)

    let dealAttributes = this.deal && this.deal.attributes as any || [] as any
    dealAttributes = this.convertDataPushToServer(dealAttributes, [])
    let dealProducts = Object.assign(this.deal.products, {})
    dealProducts = dealProducts.map((t: any) => {
      return {
        ...t,
        is_delivered: t.is_delivered && t.is_delivered.id || 0,
        customer_id: t.customer && t.customer.id || t.customer_id,
        customer_code: t.customer && t.customer.ma_kh || t.customer_code,
        customer_name: t.customer && t.customer.ten_kh || t.customer_name,
        customer_email: t.customer && t.customer.email || t.customer_email,
        customer_phone: t.customer && t.customer.sdt || t.customer_phone,
      }
    })
    dealProducts = dealProducts.map((t: any) => {
      delete t.customer
      delete t.is_loading_search_customers
      return t
    })

    let dealActionInfo = Object.assign(this.dealActionInfo)
    dealActionInfo = {
      ...dealActionInfo,
      action_id: dealActionInfo.action_id && dealActionInfo.action_id.id || undefined,
      action_result_id: dealActionInfo.action_result_id && dealActionInfo.action_result_id.id || undefined,
      next_action_id: dealActionInfo.next_action_id && dealActionInfo.next_action_id.id || undefined,
      next_action_time: +dealActionInfo.next_action_time || undefined,
      next_action_timetype: dealActionInfo.next_action_timetype && dealActionInfo.next_action_timetype.id || undefined,
      stage_id: dealActionInfo.stage_id && dealActionInfo.stage_id.id || undefined,
      lead_type_id: dealActionInfo.lead_type_id && dealActionInfo.lead_type_id.id || undefined,
      workflow_id: this.deal.workflow_id,
    }

    const action = {
      deal_id: this.dealId,
      deal_attributes: dealAttributes,
      deal_products: dealProducts,
      customer_id: this.customerId,
      customer_attributes: customerAttributes,
      deal_action_info: dealActionInfo,
      user_id: this.currentUser.id,
    }

    this.dealApi.createDealActionHistories(action).then((res) => {
      this.isLoading = false
      if ([UNPROCESSABLE_ENTITY, INTERNAL_SERVER_ERROR].includes(res.status)) {
        onFail(res)
        return
      }
      if (res.status === OK) {
        onSuccess(res)
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

  protected getUserName(userId: number) {
    const user = this.allUsers.find((t) => t.id === userId)
    return user && user.name || ''
  }

  protected updateDataDealActionInfo(dealActionInfo: any) {
    this.dealActionInfo = dealActionInfo
  }

  private created() {
    this.showModalDealAction()
  }

  private showModalDealAction() {
    EventBus.$on('showModalDealAction', (data: any) => {
      this.dealId = data.deal_id
      this.customerId = data.customer_id
      this.$bvModal.show('showModalDealAction')
      this.dealActionInfo = this.setDataDealInfo()
      this.getData()
      this.getDealActionHistories()
    })
  }

  private async getData() {
    this.isLoadingGetData = true
    this.$store.dispatch(GET_PRODUCT_ATTRIBUTES)
    this.$store.dispatch(GET_CUSTOMER_ATTRIBUTES)
    await this.dealApi.details(+this.dealId).then((res: any) => {
      this.deal = this.initData(res.data)
      this.dealActionInfo = {
        ...this.dealActionInfo,
        workflow_id: this.deal.workflow_id,
      }
    })
    await this.customerApi.details(+this.customerId).then((res: any) => {
      this.customer = this.initData(res.data)
    })

    this.isLoadingGetData = false
  }

  private getDealActionHistories() {
    if (!this.dealId) {
      return
    }
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

  private convertDataPushToServer(attributes: any, ignoreField: any) {
    const data: Array<{}> = []
    attributes.forEach((attribute: { [key: string]: string | number | Array<{}> }) => {
      if (ignoreField.includes(attribute.slug as string)) {
        return
      }
      let value: string | number | Array<{}>
      if ([InputType['Select/ Nhiều lựa chọn'], InputType['Users/ Nhiều người dùng']].includes(+attribute.attribute_input_type_id)) {
        value = attribute[attribute.slug as string] && (attribute[attribute.slug as string] as Array<{ id: number }>).map((t) => t.id) || ''
      } else if ([InputType['Select/ 1 lựa chọn'], InputType['User/ 1 người dùng']].includes(+attribute.attribute_input_type_id)) {
        value = attribute[attribute.slug as string] && (attribute[attribute.slug as string] as any).id || ''
      } else {
        value = attribute[attribute.slug as string]
      }
      data.push({
        attribute_id: attribute.id,
        attribute_input_type_id: attribute.attribute_input_type_id,
        is_required: !!attribute.is_required,
        is_unique: attribute.is_unique,
        name: attribute.name,
        slug: attribute.slug,
        value,
      })
    })
    return data
  }

  private setDataTabError() {
    this.tabErrors = {
      actionInfo: false,
      dealInfo: false,
      customerInfo: false,
    }
  }

  private setDataDealInfo() {
    return {
      workflow_id: undefined,
      action_id: undefined,
      action_result_id: undefined,
      lead_type_id: undefined,
      stage_id: undefined,
      next_action_id: undefined,
      next_action_time: undefined,
      next_action_timetype: undefined,
      note: '',
    }
  }
}
