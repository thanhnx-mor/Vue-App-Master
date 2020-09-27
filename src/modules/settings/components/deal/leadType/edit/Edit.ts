import Mixins from '@/mixins'

import { Component, Prop } from 'vue-property-decorator'

import EventBus from '@/event-bus'
import { UNPROCESSABLE_ENTITY, OK } from '@/types/const'
import { IDealLeadType } from '@/modules/deals/interface'
import DealApi from '@/services/DealApi'

@Component({

})

export default class DealLeadTypeUpdate extends Mixins {
  protected dealLeadType: IDealLeadType = this.init()
  protected dealLeadTypeCached!: IDealLeadType
  protected isLoading: boolean = false
  protected serverErrors: object = {}
  protected dealLeadTypeId!: number
  private dealApi: DealApi

  constructor() {
    super()
    this.dealApi = new DealApi()
  }

  get isDisabled() {
    if (!this.dealLeadType || !this.dealLeadTypeCached) {
      return true
    }

    if (this.isLoading || this.dealLeadType.name === this.dealLeadTypeCached.name) {
      return true
    }
    return false
  }

  protected async onSubmit(bvModalEvt: any) {
    bvModalEvt.preventDefault()

    const isValid = await (this.$refs.validationObserver as any).validate()
    if (!isValid) {
      return
    }

    this.isLoading = true

    this.dealApi.updateDealLeadType(this.dealLeadTypeId, this.dealLeadType).then((res) => {
      this.isLoading = false

      if (res.status === UNPROCESSABLE_ENTITY) {
        this.serverErrors = res.data.errors
        this.toastError('Cập nhật lead thất bại.')
        return
      }

      if (res.status === OK) {
        this.onCancel()
        this.$emit('onUpdated', true)
        this.$bvModal.hide('dealLeadTypeUpdateModal')
        this.toastSuccess('Cập nhật lead thành công.')
      }
    })
  }

  protected onCancel() {
    (this.$refs.validationObserver as any).reset()
    this.serverErrors = {}
    this.isLoading = false
  }

  private created() {
    this.showModalDealLeadTypeEdit()
  }

  private showModalDealLeadTypeEdit() {
    EventBus.$on('showModalDealLeadTypeEdit', (dealLeadTypeId: number) => {
      this.dealLeadTypeId = dealLeadTypeId
      this.$bvModal.show('dealLeadTypeUpdateModal')
      this.getDealLeadTypeById()
    })
  }

  private init() {
    return {
      name: '',
    } as IDealLeadType
  }

  private getDealLeadTypeById() {
    this.isLoading = true
    this.dealApi.detailsDealLeadType(this.dealLeadTypeId).then((res) => {
      const data = res.data as IDealLeadType
      this.dealLeadType = data
      this.dealLeadTypeCached = Object.assign({}, data)
      this.isLoading = false
    })
  }
}
