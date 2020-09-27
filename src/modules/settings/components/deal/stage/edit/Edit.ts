import Mixins from '@/mixins'

import { Component, Prop } from 'vue-property-decorator'

import EventBus from '@/event-bus'
import { UNPROCESSABLE_ENTITY, OK } from '@/types/const'
import { IDealStage } from '@/modules/deals/interface'
import DealApi from '@/services/DealApi'

@Component({

})

export default class DealStageUpdate extends Mixins {
  protected dealStage: IDealStage = this.init()
  protected dealStageCached!: IDealStage
  protected isLoading: boolean = false
  protected serverErrors: object = {}
  protected dealStageId!: number
  private dealApi: DealApi

  constructor() {
    super()
    this.dealApi = new DealApi()
  }

  get isDisabled() {
    if (!this.dealStage || !this.dealStageCached) {
      return true
    }

    if (this.isLoading || this.dealStage.name === this.dealStageCached.name) {
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

    this.dealApi.updateDealStage(this.dealStageId, this.dealStage).then((res) => {
      this.isLoading = false

      if (res.status === UNPROCESSABLE_ENTITY) {
        this.serverErrors = res.data.errors
        this.toastError('Cập nhật trạng thái xử lý thất bại.')
        return
      }

      if (res.status === OK) {
        this.onCancel()
        this.$emit('onUpdated', true)
        this.$bvModal.hide('dealStageUpdateModal')
        this.toastSuccess('Cập nhật trạng thái xử lý thành công.')
      }
    })
  }

  protected onCancel() {
    (this.$refs.validationObserver as any).reset()
    this.serverErrors = {}
    this.isLoading = false
  }

  private created() {
    this.showModalDealStageEdit()
  }

  private showModalDealStageEdit() {
    EventBus.$on('showModalDealStageEdit', (dealStageId: number) => {
      this.dealStageId = dealStageId
      this.$bvModal.show('dealStageUpdateModal')
      this.getDealStageById()
    })
  }

  private init() {
    return {
      name: '',
    } as IDealStage
  }

  private getDealStageById() {
    this.isLoading = true
    this.dealApi.detailsDealStage(this.dealStageId).then((res) => {
      const data = res.data as IDealStage
      this.dealStage = data
      this.dealStageCached = Object.assign({}, data)
      this.isLoading = false
    })
  }
}
