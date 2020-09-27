import Mixins from '@/mixins'

import { Component, Prop } from 'vue-property-decorator'

import EventBus from '@/event-bus'
import { UNPROCESSABLE_ENTITY, OK } from '@/types/const'
import { IDealAction } from '@/modules/deals/interface'
import DealApi from '@/services/DealApi'

@Component({

})

export default class DealActionUpdate extends Mixins {
  protected dealAction: IDealAction = this.init()
  protected dealActionCached!: IDealAction
  protected isLoading: boolean = false
  protected serverErrors: object = {}
  protected dealActionId!: number
  private dealApi: DealApi

  constructor() {
    super()
    this.dealApi = new DealApi()
  }

  get isDisabled() {
    if (!this.dealAction || !this.dealActionCached) {
      return true
    }

    if (this.isLoading || this.dealAction.name === this.dealActionCached.name) {
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

    this.dealApi.updateDealAction(this.dealActionId, this.dealAction).then((res) => {
      this.isLoading = false

      if (res.status === UNPROCESSABLE_ENTITY) {
        this.serverErrors = res.data.errors
        this.toastError('Cập nhật hành động thất bại.')
        return
      }

      if (res.status === OK) {
        this.onCancel()
        this.$emit('onUpdated', true)
        this.$bvModal.hide('dealActionUpdateModal')
        this.toastSuccess('Cập nhật hành động thành công.')
      }
    })
  }

  protected onCancel() {
    (this.$refs.validationObserver as any).reset()
    this.serverErrors = {}
    this.isLoading = false
  }

  private created() {
    this.showModalDealActionEdit()
  }

  private showModalDealActionEdit() {
    EventBus.$on('showModalDealActionEdit', (dealActionId: number) => {
      this.dealActionId = dealActionId
      this.$bvModal.show('dealActionUpdateModal')
      this.getDealActionById()
    })
  }

  private init() {
    return {
      name: '',
    } as IDealAction
  }

  private getDealActionById() {
    this.isLoading = true
    this.dealApi.detailsDealAction(this.dealActionId).then((res) => {
      const data = res.data as IDealAction
      this.dealAction = data
      this.dealActionCached = Object.assign({}, data)
      this.isLoading = false
    })
  }
}
