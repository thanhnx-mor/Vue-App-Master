import Mixins from '@/mixins'

import { Component, Prop } from 'vue-property-decorator'

import EventBus from '@/event-bus'
import { UNPROCESSABLE_ENTITY, OK } from '@/types/const'
import { IDealWorkflow } from '@/modules/deals/interface'
import DealApi from '@/services/DealApi'

@Component({

})

export default class DealWorkflowUpdate extends Mixins {
  protected dealWorkflow: IDealWorkflow = this.init()
  protected dealWorkflowCached!: IDealWorkflow
  protected isLoading: boolean = false
  protected serverErrors: object = {}
  protected dealWorkflowId!: number
  private dealApi: DealApi

  constructor() {
    super()
    this.dealApi = new DealApi()
  }

  get isDisabled() {
    if (!this.dealWorkflow || !this.dealWorkflowCached) {
      return true
    }

    if (this.isLoading || this.dealWorkflow.name === this.dealWorkflowCached.name) {
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

    this.dealApi.updateDealWorkflow(this.dealWorkflowId, this.dealWorkflow).then((res) => {
      this.isLoading = false

      if (res.status === UNPROCESSABLE_ENTITY) {
        this.serverErrors = res.data.errors
        this.toastError('Cập nhật quy trình làm việc thất bại.')
        return
      }

      if (res.status === OK) {
        this.onCancel()
        this.$emit('onUpdated', true)
        this.$bvModal.hide('dealWorkflowUpdateModal')
        this.toastSuccess('Cập nhật quy trình làm việc thành công.')
      }
    })
  }

  protected onCancel() {
    (this.$refs.validationObserver as any).reset()
    this.serverErrors = {}
    this.isLoading = false
  }

  private created() {
    this.showModalDealWorkflowEdit()
  }

  private showModalDealWorkflowEdit() {
    EventBus.$on('showModalDealWorkflowEdit', (dealWorkflowId: number) => {
      this.dealWorkflowId = dealWorkflowId
      this.$bvModal.show('dealWorkflowUpdateModal')
      this.getDealWorkflowById()
    })
  }

  private init() {
    return {
      name: '',
    } as IDealWorkflow
  }

  private getDealWorkflowById() {
    this.isLoading = true
    this.dealApi.detailsDealWorkflow(this.dealWorkflowId).then((res) => {
      const data = res.data as IDealWorkflow
      this.dealWorkflow = data
      this.dealWorkflowCached = Object.assign({}, data)
      this.isLoading = false
    })
  }
}
