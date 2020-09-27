import Mixins from '@/mixins'

import { Component, Prop } from 'vue-property-decorator'

import EventBus from '@/event-bus'
import { UNPROCESSABLE_ENTITY, OK } from '@/types/const'
import { IDealActionResult } from '@/modules/deals/interface'
import DealApi from '@/services/DealApi'

@Component({

})

export default class DealActionResultUpdate extends Mixins {
  protected dealActionResult: IDealActionResult = this.init()
  protected dealActionResultCached!: IDealActionResult
  protected isLoading: boolean = false
  protected serverErrors: object = {}
  protected dealActionResultId!: number
  private dealApi: DealApi

  constructor() {
    super()
    this.dealApi = new DealApi()
  }

  get isDisabled() {
    if (!this.dealActionResult || !this.dealActionResultCached) {
      return true
    }

    if (this.isLoading || this.dealActionResult.name === this.dealActionResultCached.name) {
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

    this.dealApi.updateDealActionResult(this.dealActionResultId, this.dealActionResult).then((res) => {
      this.isLoading = false

      if (res.status === UNPROCESSABLE_ENTITY) {
        this.serverErrors = res.data.errors
        this.toastError('Cập nhật kết quả xử lý thất bại.')
        return
      }

      if (res.status === OK) {
        this.onCancel()
        this.$emit('onUpdated', true)
        this.$bvModal.hide('dealActionResultUpdateModal')
        this.toastSuccess('Cập nhật kết quả xử lý thành công.')
      }
    })
  }

  protected onCancel() {
    (this.$refs.validationObserver as any).reset()
    this.serverErrors = {}
    this.isLoading = false
  }

  private created() {
    this.showModalDealActionResultEdit()
  }

  private showModalDealActionResultEdit() {
    EventBus.$on('showModalDealActionResultEdit', (dealActionResultId: number) => {
      this.dealActionResultId = dealActionResultId
      this.$bvModal.show('dealActionResultUpdateModal')
      this.getDealActionResultById()
    })
  }

  private getDealActionResultById() {
    this.isLoading = true
    this.dealApi.detailsDealActionResult(this.dealActionResultId).then((res) => {
      const data = res.data as IDealActionResult
      this.dealActionResult = data
      this.dealActionResultCached = Object.assign({}, data)
      this.isLoading = false
    })
  }

  private init() {
    return {
      name: '',
    } as IDealActionResult
  }
}
